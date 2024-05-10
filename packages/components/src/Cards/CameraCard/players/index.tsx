import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import styled from "@emotion/styled";

export type VideoState = "canplay" | "canplaythrough" | "waiting" | "stalled" | "loadeddata" | "play" | "playing" | "pause";

export interface VideoPlayerProps extends Omit<React.HTMLProps<HTMLVideoElement>, "as"> {
  src?: string;
  type?: string;
  onVideoStateChange?: (state: VideoState) => void;
}

const Video = styled.video`
  display: block;
  width: 100%;
`;

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ src, type, onVideoStateChange, ...rest }, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(ref, () => videoRef.current!);

  const notifyStateChange = useCallback(
    (state: VideoState) => {
      if (onVideoStateChange) {
        onVideoStateChange(state);
      }
    },
    [onVideoStateChange],
  );

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleCanPlay = () => {
      notifyStateChange("canplay");
    };

    const handleCanPlayThrough = () => {
      notifyStateChange("canplaythrough");
    };

    const handleWaiting = () => {
      notifyStateChange("waiting");
    };

    const handleStalled = () => {
      notifyStateChange("stalled");
    };

    const handleLoadedData = () => {
      notifyStateChange("loadeddata");
    };
    const handlePlay = () => {
      notifyStateChange("play");
    };
    const handlePlaying = () => {
      notifyStateChange("playing");
    };
    const handlePause = () => {
      notifyStateChange("pause");
    };

    if (videoElement) {
      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
      videoElement.addEventListener("waiting", handleWaiting);
      videoElement.addEventListener("stalled", handleStalled);
      videoElement.addEventListener("loadeddata", handleLoadedData);
      videoElement.addEventListener("playing", handlePlaying);
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("canplay", handleCanPlay);
        videoElement.removeEventListener("canplaythrough", handleCanPlayThrough);
        videoElement.removeEventListener("waiting", handleWaiting);
        videoElement.removeEventListener("stalled", handleStalled);
        videoElement.removeEventListener("loadeddata", handleLoadedData);
        videoElement.removeEventListener("playing", handlePlaying);
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
      }
    };
  }, [notifyStateChange]);

  return (
    <Video ref={videoRef} {...rest}>
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </Video>
  );
});
