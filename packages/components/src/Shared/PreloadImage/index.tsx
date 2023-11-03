import { useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { Icon } from "@iconify/react";
import { MotionProps } from "framer-motion";

const Preloader = styled.div`
  position: relative;
`;

const PreloaderBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transitionproperty: background-image, opacity;
  opacity: 0;
`;
const StyledIcon = styled(Icon)`
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
`;

type Extendable = Omit<React.ComponentPropsWithoutRef<"div"> & MotionProps, "onLoad" | "onError">;
export interface PreloadImageProps extends Extendable {
  lazy?: boolean;
  src: string;
  style?: React.CSSProperties;
  innerStyle?: {
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
  };
  /** duration of the fade in animation in milliseconds */
  duration?: number;
  ease?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onLoading?: () => void;
}

/** The PreloadImage is a helper component to load an image into the background of the element, this component is pretty generic and requires additional styling to set the width/height of the
 * background image element
 *
 * It will automatically fade in the image once it's loaded, and will show a loading icon while it's loading, everything is pretty configurable and is completely documented
 */
export const PreloadImage = ({
  lazy,
  src,
  className,
  style,
  innerStyle,
  duration: _duration,
  ease,
  children,
  onLoad,
  onLoading,
  onError,
  onClick,
  cssStyles,
  ...rest
}: PreloadImageProps) => {
  const el = useRef<HTMLDivElement>(null);
  const loadingIconRef = useRef<SVGSVGElement | null>(null);
  const imageDivRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const preloader = useRef<HTMLImageElement | null>(null);
  const duration = _duration ?? 300;

  const setPreloader = useCallback(() => {
    if (!src) return;
    preloader.current = new Image();
    onLoading && onLoading();
    if (imageDivRef.current) {
      imageDivRef.current.style.opacity = "0";
      imageDivRef.current.style.backgroundImage = `url(${src})`;
    }
    if (loadingIconRef.current) {
      loadingIconRef.current.style.opacity = "1";
    }

    preloader.current.onload = () => {
      if (imageDivRef.current) {
        imageDivRef.current.style.opacity = "1";
      }
      if (loadingIconRef.current) {
        loadingIconRef.current.style.opacity = "0";
      }
      onLoad && onLoad();
    };
    preloader.current.onerror = () => {
      if (imageDivRef.current) {
        imageDivRef.current.style.opacity = "1";
      }
      if (loadingIconRef.current) {
        loadingIconRef.current.style.opacity = "0";
      }
      onError && onError();
    };

    preloader.current.src = src;
  }, [src, onLoading, onLoad, onError]);

  const setObserver = useCallback(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPreloader();
          if (observer.current) observer.current.disconnect();
        }
      });
    });

    if (el.current) observer.current.observe(el.current);
  }, [setPreloader]);

  useEffect(() => {
    if (lazy && "IntersectionObserver" in window) {
      setObserver();
    } else {
      setPreloader();
    }

    return () => {
      if (observer.current) observer.current.disconnect();
      if (preloader.current) preloader.current.onload = null;
    };
  }, [lazy, observer, preloader, setObserver, setPreloader]);

  const backgroundSize = innerStyle?.backgroundSize || "cover";
  const backgroundPosition = innerStyle?.backgroundPosition || "center";
  const backgroundRepeat = innerStyle?.backgroundRepeat || "no-repeat";

  return (
    <Preloader
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`preload-image ${className ?? ""}`}
      style={{ ...style }}
      ref={el}
      {...rest}
      onClick={onClick}
    >
      <PreloaderBackground
        className="preloader-background-image"
        ref={imageDivRef}
        style={{
          backgroundSize: backgroundSize,
          backgroundPosition: backgroundPosition,
          backgroundRepeat: backgroundRepeat,
          transitionProperty: "background-image, opacity",
          transitionDuration: `${duration}ms, ${duration}ms`,
          transitionTimingFunction: `${ease ?? "cubic-bezier(0.215, 0.61, 0.355, 1)"}, ${ease ?? "cubic-bezier(0.215, 0.61, 0.355, 1)"}`,
        }}
      ></PreloaderBackground>
      <StyledIcon ref={loadingIconRef} icon="eos-icons:three-dots-loading" className="preloader-loading-icon" />
      {children}
    </Preloader>
  );
};
