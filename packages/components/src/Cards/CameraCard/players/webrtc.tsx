import { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "@components";
import { useHass, type EntityName, type FilterByDomain } from "@hakit/core";
import { VideoPlayer, type VideoState } from "./";

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

interface WebRtcSettings {
  stun_server?: string;
}

interface WebRtcAnswer {
  answer: string;
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
  const started = useRef(false);
  const fetchWebRtcSettings = useCallback(
    async () =>
      connection?.sendMessagePromise<WebRtcSettings>({
        type: "rtsp_to_webrtc/get_settings",
      }),
    [connection],
  );

  const _fetchPeerConfiguration = useCallback(async (): Promise<RTCConfiguration> => {
    const settings = await fetchWebRtcSettings();
    if (!settings || !settings.stun_server) {
      return {};
    }
    return {
      iceServers: [
        {
          urls: [`stun:${settings.stun_server!}`],
        },
      ],
    };
  }, [fetchWebRtcSettings]);

  const _startWebRtc = useCallback(async (): Promise<void> => {
    if (!connection || !_videoEl.current || started.current) return;
    started.current = true;
    setError(undefined);
    const configuration = await _fetchPeerConfiguration();
    const peerConnection = new RTCPeerConnection(configuration);
    // Some cameras (such as nest) require a data channel to establish a stream
    // however, not used by any integrations.
    peerConnection.createDataChannel("dataSendChannel");
    peerConnection.addTransceiver("audio", { direction: "recvonly" });
    peerConnection.addTransceiver("video", { direction: "recvonly" });

    const offerOptions: RTCOfferOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
    const offer: RTCSessionDescriptionInit = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer);

    let candidates = ""; // Build an Offer SDP string with ice candidates
    const iceResolver = new Promise<void>((resolve) => {
      peerConnection.addEventListener("icecandidate", async (event) => {
        if (!event.candidate) {
          resolve(); // Gathering complete
          return;
        }
        candidates += `a=${event.candidate.candidate}\r\n`;
      });
    });
    await iceResolver;
    const offer_sdp = offer.sdp! + candidates;

    let webRtcAnswer: WebRtcAnswer;
    try {
      webRtcAnswer = await connection.sendMessagePromise<WebRtcAnswer>({
        type: "camera/web_rtc_offer",
        entity_id: entity,
        offer: offer_sdp,
      });
    } catch (err) {
      console.error("err", err);
      if (err instanceof Error) {
        setError("Failed to start WebRTC stream: " + err.message);
      }
      peerConnection.close();
      return;
    }

    // Setup callbacks to render remote stream once media tracks are discovered.
    const remoteStream = new MediaStream();
    peerConnection.addEventListener("track", (event) => {
      remoteStream.addTrack(event.track);
      if (_videoEl.current) {
        _videoEl.current.srcObject = remoteStream;
      }
    });
    _remoteStream.current = remoteStream;

    // Initiate the stream with the remote device
    const remoteDesc = new RTCSessionDescription({
      type: "answer",
      sdp: webRtcAnswer.answer,
    });
    try {
      await peerConnection.setRemoteDescription(remoteDesc);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Failed to connect WebRTC stream: " + err.message);
      }
      peerConnection.close();
      return;
    }
    _peerConnection.current = peerConnection;
  }, [_fetchPeerConfiguration, connection, entity]);

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
