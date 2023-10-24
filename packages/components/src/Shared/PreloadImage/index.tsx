import { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';

const Preloader = styled.div`
  position: relative;
`;
export interface PreloadImageProps extends Partial<Omit<HTMLImageElement, 'children' | 'style'>> {
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
  onLoad?: () => void;
  onError?: () => void;
}

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
  onError,
}: PreloadImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(`url(${src})`);
  const el = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const preloader = useRef<HTMLImageElement | null>(null);
  const duration = _duration ?? 300;

  const setPreloader = useCallback(() => {
    preloader.current = new Image();
    setLoaded(false);
    const timeout = setTimeout(() => {
      setImageSrc(`url(${src})`);
    }, duration);

    preloader.current.onload = () => {
      setLoaded(true);
      if (timeout) clearTimeout(timeout);
      onLoad && onLoad();
    };
    preloader.current.onerror = () => {
      if (timeout) clearTimeout(timeout);
      setLoaded(true);
      onError && onError();
    }

    preloader.current.src = src;
  }, [src, duration, onLoad, onError]);
  
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
    if (lazy && 'IntersectionObserver' in window) {
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
    <Preloader className={className} style={{ ...style }} ref={el}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: imageSrc,
          backgroundSize: backgroundSize,
          backgroundPosition: backgroundPosition,
          backgroundRepeat: backgroundRepeat,
          transition: `opacity ${duration}ms ${ease ?? 'cubic-bezier(0.215, 0.61, 0.355, 1)'}`,
          opacity: loaded ? 1 : 0,
        }}
      ></div>
      {children}
    </Preloader>
  );
};