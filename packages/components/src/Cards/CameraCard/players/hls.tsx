import type HlsType from "hls.js";
import { type ErrorData } from "hls.js";
import { useRef, useState, useCallback, useEffect } from "react";
import { Alert } from "@components";
import { VideoPlayer, type VideoState } from "./";

type HlsLite = Omit<HlsType, "subtitleTrackController" | "audioTrackController" | "emeController">;

export interface HlsPlayerProps {
  url: string;
  posterUrl: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  onStateChange?: (state: VideoState) => void;
}

export function HlsPlayer({
  url,
  posterUrl,
  controls = true,
  muted = false,
  autoPlay = false,
  playsInline = false,
  onStateChange,
}: HlsPlayerProps) {
  const _videoEl = useRef<HTMLVideoElement>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [retryableError, setRetryableError] = useState<string | null>(null);
  const _hlsPolyfillInstance = useRef<HlsLite | undefined>(undefined);
  const started = useRef(false);

  const _renderHLSPolyfill = useCallback(async (videoEl: HTMLVideoElement, Hls: typeof HlsType, url: string) => {
    const hls = new Hls({
      backBufferLength: 60,
      fragLoadingTimeOut: 30000,
      manifestLoadingTimeOut: 30000,
      levelLoadingTimeOut: 30000,
      maxLiveSyncPlaybackRate: 2,
      lowLatencyMode: _isLLHLSSupported(),
    });
    _hlsPolyfillInstance.current = hls;
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      setRetryableError(null);
      setFatalError(null);
      hls.loadSource(url);
    });
    hls.on(Hls.Events.FRAG_LOADED, () => {
      setRetryableError(null);
      setFatalError(null);
    });
    hls.on(Hls.Events.ERROR, (_event, data: ErrorData) => {
      // Some errors are recovered automatically by the hls player itself, and the others handled
      // in this function require special actions to recover. Errors retried in this function
      // are done with backoff to not cause unecessary failures.
      if (!data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        switch (data.details) {
          case Hls.ErrorDetails.MANIFEST_LOAD_ERROR: {
            let error = "Error starting stream, see logs for details";
            if (data.response !== undefined && data.response.code !== undefined) {
              if (data.response.code >= 500) {
                error += " (Server failure)";
              } else if (data.response.code >= 400) {
                error += " (Stream never started)";
              } else {
                error += " (" + data.response.code + ")";
              }
            }
            setRetryableError(error);
            break;
          }
          case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
            setRetryableError("Timeout while starting stream");
            break;
          default:
            setRetryableError("Stream network error");
            break;
        }
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setRetryableError("Error with media stream contents");
        hls.recoverMediaError();
      } else {
        setFatalError("Error playing stream");
      }
    });
  }, []);

  const _startHls = useCallback(async (): Promise<void> => {
    if (!_videoEl.current || started.current) {
      return;
    }
    const masterPlaylistPromise = fetch(url);
    // @ts-expect-error - no need for types
    const Hls: typeof HlsType = (await import("hls.js/dist/hls.light.mjs")).default;
    started.current = true;

    let hlsSupported = Hls.isSupported();

    if (!hlsSupported) {
      hlsSupported = _videoEl.current.canPlayType("application/vnd.apple.mpegurl") !== "";
    }

    if (!hlsSupported) {
      setFatalError("video not supported");
      return;
    }

    const masterPlaylist = await (await masterPlaylistPromise).text();

    // Parse playlist assuming it is a master playlist. Match group 1 is whether hevc, match group 2 is regular playlist url
    // See https://tools.ietf.org/html/rfc8216 for HLS spec details
    const playlistRegexp = /#EXT-X-STREAM-INF:.*?(?:CODECS=".*?(hev1|hvc1)?\..*?".*?)?(?:\n|\r\n)(.+)/g;
    const match = playlistRegexp.exec(masterPlaylist);
    const matchTwice = playlistRegexp.exec(masterPlaylist);

    // Get the regular playlist url from the input (master) playlist, falling back to the input playlist if necessary
    // This avoids the player having to load and parse the master playlist again before loading the regular playlist
    let playlist_url: string;
    if (match !== null && matchTwice === null) {
      // Only send the regular playlist url if we match exactly once
      playlist_url = new URL(match[2], url).href;
    } else {
      playlist_url = url;
    }

    // If codec is HEVC
    if (Hls.isSupported()) {
      _renderHLSPolyfill(_videoEl.current, Hls, playlist_url);
    } else {
      _renderHLSNative(_videoEl.current, playlist_url);
    }
  }, [url, _renderHLSPolyfill]);

  function _isLLHLSSupported(): boolean {
    // LL-HLS keeps multiple requests in flight, which can run into browser limitations without
    // an http/2 proxy to pipeline requests. However, a small number of streams active at
    // once should be OK.
    // The stream count may be incremented multiple times before this function is called to check
    // the count e.g. when loading a page with many streams on it. The race can work in our favor
    // so we now have a better idea on if we'll use too many browser connections later.
    // if (HaHLSPlayer.streamCount <= 2) {
    //   return true;
    // }
    if (!("performance" in window) || performance.getEntriesByType("resource").length === 0) {
      return false;
    }
    const perfEntry = performance.getEntriesByType("resource")[0] as PerformanceResourceTiming;
    return "nextHopProtocol" in perfEntry && perfEntry.nextHopProtocol === "h2";
  }

  async function _renderHLSNative(videoEl: HTMLVideoElement, url: string) {
    videoEl.src = url;
    videoEl.addEventListener("loadedmetadata", () => {
      videoEl.play();
    });
  }

  useEffect(() => {
    _startHls();
  }, [_startHls]);

  if (fatalError) {
    return <Alert type="error" description={fatalError} />;
  }
  if (retryableError) {
    console.error(retryableError);
  }

  return (
    <VideoPlayer
      ref={_videoEl}
      type="application/vnd.apple.mpegurl"
      poster={posterUrl}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onVideoStateChange={onStateChange}
    />
  );
}
