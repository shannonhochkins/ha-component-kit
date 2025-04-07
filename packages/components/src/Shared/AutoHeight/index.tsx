import React, { useRef, useState, useLayoutEffect } from "react";

type AutoHeightProps = {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  onCollapseComplete?: () => void;
};

export const AutoHeight = ({ isOpen, children, duration = 300, className, style, onCollapseComplete }: AutoHeightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderChildren, setRenderChildren] = useState(isOpen);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const hasMountedRef = useRef(false);

  // Ensure children are present before measuring during expand
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // On first render only
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (isOpen) {
        // Start open: skip animation
        setRenderChildren(true);
        setShouldAnimate(false);
        el.style.height = "auto";
      } else {
        // Start collapsed: do nothing, wait for open to trigger animation
        setRenderChildren(false);
      }
      return;
    }

    if (isOpen) {
      setRenderChildren(true);
      el.style.height = "0px";

      requestAnimationFrame(() => {
        const scrollHeight = el.scrollHeight;
        setShouldAnimate(true);
        el.style.transition = `height ${duration}ms ease`;
        el.style.height = `${scrollHeight}px`;

        const timeout = setTimeout(() => {
          el.style.transition = "";
          el.style.height = "auto";
        }, duration);

        return () => clearTimeout(timeout);
      });
    } else {
      const currentHeight = el.scrollHeight;
      el.style.height = `${currentHeight}px`;

      requestAnimationFrame(() => {
        setShouldAnimate(true);
        el.style.transition = `height ${duration}ms ease`;
        el.style.height = "0px";

        const timeout = setTimeout(() => {
          setRenderChildren(false);
          if (onCollapseComplete) onCollapseComplete();
        }, duration);

        return () => clearTimeout(timeout);
      });
    }
  }, [isOpen, duration, onCollapseComplete]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: "hidden",
        height: isOpen && !shouldAnimate ? "auto" : undefined,
        ...style,
      }}
    >
      {renderChildren ? children : null}
    </div>
  );
};
