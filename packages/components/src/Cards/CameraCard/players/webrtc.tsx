import { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "@components";
import { useHass, type EntityName, type FilterByDomain } from "@hakit/core";
import { VideoPlayer, type VideoState } from "./";

type SubscriptionUnsubscribe = () => Promise<void>;

export interface WebRTCPlayerProps {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "camera">;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  posterUrl?: string;
  onStateChange?: (state: VideoState) => void;
}

export type WebRtcOfferEvent = WebRtcId | WebRtcAnswer | WebRtcCandidate | WebRtcError;

export interface WebRtcId {
  type: "session";
  session_id: string;
}

export interface WebRtcAnswer {
  type: "answer";
  answer: string;
}

export interface WebRtcCandidate {
  type: "candidate";
  candidate: RTCIceCandidateInit;
}

export interface WebRtcError {
  type: "error";
  code: string;
  message: string;
}

export interface WebRTCClientConfiguration {
  configuration: RTCConfiguration;
  dataChannel?: string;
  getCandidatesUpfront: boolean;
}

/**
 * A WebRTC stream is established by first sending an offer through a signal
 * path via an integration. An answer is returned, then the rest of the stream
 * is handled entirely client side.
 */
export function WebRTCPlayer({ entity, controls, muted, autoPlay, playsInline, posterUrl, onStateChange }: WebRTCPlayerProps) {
  const { useStore } = useHass();
  const connection = useStore((store) => store.connection);
  const _videoEl = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const _peerConnection = useRef<RTCPeerConnection | undefined>(undefined);
  const _remoteStream = useRef<MediaStream | undefined>(undefined);
  const _sessionId = useRef<string | undefined>(undefined);
  const _candidatesList = useRef<RTCIceCandidate[]>([]);
  const _unsub = useRef<Promise<SubscriptionUnsubscribe> | undefined>(undefined);
  const started = useRef(false);
  const fetchWebRtcSettings = useCallback(
    async () =>
      connection?.sendMessagePromise<WebRTCClientConfiguration>({
        type: "camera/webrtc/get_client_config",
        entity_id: entity,
      }),
    [connection, entity],
  );

  const cleanUp = () => {
    if (_remoteStream.current) {
      _remoteStream.current.getTracks().forEach((track) => {
        track.stop();
      });

      _remoteStream.current = undefined;
    }
    if (_videoEl.current) {
      _videoEl.current.removeAttribute("src");
      _videoEl.current.load();
    }
    if (_peerConnection.current) {
      const peerConnection = _peerConnection.current;
      peerConnection.close();

      peerConnection.onnegotiationneeded = null;
      peerConnection.onicecandidate = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.onicegatheringstatechange = null;
      peerConnection.ontrack = null;
      peerConnection.onsignalingstatechange = null;
      _peerConnection.current = undefined;
    }
    _unsub.current?.then((unsub_call) => unsub_call());
    _unsub.current = undefined;
    _sessionId.current = undefined;
    _candidatesList.current = [];
  };

  const addTrack = useCallback(
    async (event: RTCTrackEvent) => {
      if (!_remoteStream.current || !_videoEl.current) {
        return;
      }
      _remoteStream.current.addTrack(event.track);
      _videoEl.current.srcObject = _remoteStream.current;
    },
    [_remoteStream],
  );

  // Reference: https://github.com/home-assistant/frontend/blob/7d1ca2acf0a7dcb68ebc69cf2d54c7395455c8e5/src/components/ha-web-rtc-player.ts
  const _startWebRtc = useCallback(async (): Promise<void> => {
    if (!connection || !_videoEl.current || started.current) return;
    started.current = true;
    setError(undefined);
    const configuration = await fetchWebRtcSettings();
    if (!configuration) return;
    const peerConnection: RTCPeerConnection | undefined = new RTCPeerConnection(configuration.configuration);
    if (configuration.dataChannel) {
      // Some cameras (such as nest) require a data channel to establish a stream
      // however, not used by any integrations.
      peerConnection.createDataChannel(configuration.dataChannel);
    }

    const addWebRtcCandidate = (candidateSession: string, candidate: RTCIceCandidateInit) =>
      connection?.sendMessage({
        type: "camera/webrtc/candidate",
        entity_id: entity,
        session_id: candidateSession,
        candidate: candidate,
      });

    const startNegotiation = async () => {
      if (!peerConnection) {
        return;
      }

      const offerOptions: RTCOfferOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };

      const offer: RTCSessionDescriptionInit = await peerConnection.createOffer(offerOptions);

      if (!peerConnection) {
        return;
      }

      await peerConnection.setLocalDescription(offer);

      if (!peerConnection) {
        return;
      }

      let candidates = "";

      if (configuration?.getCandidatesUpfront) {
        await new Promise<void>((resolve) => {
          peerConnection!.onicegatheringstatechange = (ev: Event) => {
            const iceGatheringState = (ev.target as RTCPeerConnection).iceGatheringState;
            if (iceGatheringState === "complete") {
              peerConnection!.onicegatheringstatechange = null;
              resolve();
            }
          };
        });

        if (!peerConnection) {
          return;
        }
      }

      while (_candidatesList.current.length) {
        const candidate = _candidatesList.current.pop();
        if (candidate) {
          candidates += `a=${candidate}\r\n`;
        }
      }

      const handleAnswer = async (event: WebRtcAnswer) => {
        if (!_peerConnection.current?.signalingState || ["stable", "closed"].includes(_peerConnection.current.signalingState)) {
          return;
        }

        // Initiate the stream with the remote device
        const remoteDesc = new RTCSessionDescription({
          type: "answer",
          sdp: event.answer,
        });
        try {
          await _peerConnection.current.setRemoteDescription(remoteDesc);
        } catch (err) {
          if (err instanceof Error) {
            setError("Failed to connect WebRTC stream: " + err.message);
          }
          cleanUp();
        }
      };

      const handleOfferEvent = async (event: WebRtcOfferEvent) => {
        if (event.type === "session") {
          _sessionId.current = event.session_id;
          _candidatesList.current.forEach((candidate) => addWebRtcCandidate(event.session_id, candidate.toJSON()));
          _candidatesList.current = [];
        } else if (event.type === "answer") {
          handleAnswer(event);
        } else if (event.type === "candidate") {
          try {
            // The spdMid or sdpMLineIndex is required so set sdpMid="0" if not
            // sent from the backend.
            const candidate =
              event.candidate.sdpMid || event.candidate.sdpMLineIndex != null
                ? new RTCIceCandidate(event.candidate)
                : new RTCIceCandidate({
                    candidate: event.candidate.candidate,
                    sdpMid: "0",
                  });

            await _peerConnection.current?.addIceCandidate(candidate);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            }
            console.error(err);
          }
        } else if (event.type === "error") {
          setError("Failed to start WebRTC stream: " + event.message);
          cleanUp();
        }
      };

      const offer_sdp = offer.sdp! + candidates;
      try {
        _unsub.current = connection.subscribeMessage<WebRtcOfferEvent>((event) => handleOfferEvent(event), {
          type: "camera/webrtc/offer",
          entity_id: entity,
          offer: offer_sdp,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError("Failed to start WebRTC stream: " + err.message);
        }
        cleanUp();
      }
    };

    peerConnection.onnegotiationneeded = startNegotiation;

    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (!event.candidate?.candidate) {
        return;
      }
      if (_sessionId.current) {
        addWebRtcCandidate(_sessionId.current, event.candidate.toJSON());
      } else {
        _candidatesList.current.push(event.candidate);
      }
    };
    peerConnection.onicecandidate = handleIceCandidate;

    const iceConnectionStateChanged = () => {
      if (peerConnection?.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };
    peerConnection.oniceconnectionstatechange = iceConnectionStateChanged;

    // just for debugging
    peerConnection.onsignalingstatechange = (ev) => {
      switch ((ev.target as RTCPeerConnection).signalingState) {
        case "stable":
          console.log("WebRTC ICE Negotiation complete");
          break;
        default:
          console.log(`WebRTC signaling state changed: ${(ev.target as RTCPeerConnection).signalingState}`);
      }
    };

    // Setup callbacks to render remote stream once media tracks are discovered.
    _remoteStream.current = new MediaStream();
    peerConnection.ontrack = addTrack;

    peerConnection.addTransceiver("audio", { direction: "recvonly" });
    peerConnection.addTransceiver("video", { direction: "recvonly" });

    _peerConnection.current = peerConnection;
  }, [fetchWebRtcSettings, addTrack, connection, entity]);

  useEffect(() => {
    _startWebRtc();
  }, [_startWebRtc]);

  useEffect(() => {
    const localVideo = _videoEl.current;
    return () => {
      if (_remoteStream.current) {
        _remoteStream.current.getTracks().forEach((track) => {
          track.stop();
        });
        _remoteStream.current = undefined;
      }
      if (localVideo) {
        localVideo.removeAttribute("src");
        localVideo.load();
      }
      if (_peerConnection.current) {
        _peerConnection.current.close();
        _peerConnection.current = undefined;
      }
    };
  }, []);

  if (error) {
    return <Alert type="error" description={error} />;
  }

  return (
    <VideoPlayer
      ref={_videoEl}
      poster={posterUrl}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onVideoStateChange={onStateChange}
    />
  );
}
