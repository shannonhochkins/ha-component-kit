import React, { CSSProperties, memo, useCallback, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";

export interface RipplesProps extends React.ComponentPropsWithoutRef<"div"> {
  /** the animation duration of the ripple @default 600 */
  duration?: number;
  /** the color of the ripple, @default rgba(0, 0, 0, .3) */
  color?: string;
  /** click even to bind to the ripple, @default void */
  onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void;
  /** the children of the ripple */
  children: React.ReactNode;
  /** the css border radius of the ripple, @default none */
  borderRadius?: CSSProperties["borderRadius"];
  /** disable the ripple */
  disabled?: boolean;
  /** prevent propagation on ripples */
  preventPropagation?: boolean;
}

const boxStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  overflow: "hidden",
};

const StyledRipple = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  width: 35px;
  height: 35px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  flex-shrink: 0;
`;

const ParentRipple = styled.div<{
  borderRadius: RipplesProps["borderRadius"];
}>`
  ${(props) =>
    props.borderRadius &&
    `
    border-radius: ${props.borderRadius};
    overflow: hidden;
    display: inline-flex;
  `}
`;
const _Ripples = memo(
  ({
    duration = 600,
    color = "rgba(0, 0, 0, .3)",
    borderRadius = "none",
    onClick,
    children,
    disabled,
    preventPropagation = false,
    style,
    className,
    cssStyles,
    id,
    ...rest
  }: RipplesProps) => {
    const rippleRef = useRef<HTMLDivElement | null>(null);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
      return () => {
        // cleanup
        if (timeoutId.current) clearTimeout(timeoutId.current);
      };
    }, []);

    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (disabled) return;
        // clear the timeout if exists
        if (timeoutId.current !== null) clearTimeout(timeoutId.current);

        const { pageX, pageY, currentTarget } = event;

        const rect = currentTarget.getBoundingClientRect();
        let xMultiplier = 1;
        if (typeof window !== "undefined") {
          xMultiplier = window.scrollX;
        }
        let yMultiplier = 1;
        if (typeof window !== "undefined") {
          yMultiplier = window.scrollY;
        }

        const left = pageX - (rect.left + xMultiplier);
        const top = pageY - (rect.top + yMultiplier);
        const size = Math.max(rect.width, rect.height);

        if (rippleRef.current) {
          const newStyles = {
            left: isNaN(left) ? "0px" : `${left}px`,
            top: isNaN(top) ? "0px" : `${top}px`,
            opacity: 1,
            transform: "translate(-50%, -50%)",
            transition: "initial",
            backgroundColor: color,
          };
          Object.assign(rippleRef.current.style, newStyles);
        }
        // start a timeout to scale the ripple
        timeoutId.current = setTimeout(() => {
          if (rippleRef.current) {
            const newStyles = {
              opacity: 0,
              transform: `scale(${size / 9})`,
              transition: `all ${duration}ms`,
            };
            Object.assign(rippleRef.current.style, newStyles);
          }
          timeoutId.current = null;
        }, 50);

        if (typeof onClick === "function") onClick(event);
      },
      [color, duration, disabled, onClick],
    );

    return (
      <ParentRipple
        borderRadius={borderRadius}
        id={id ?? ""}
        className={`ripple-parent ${className ?? ""}`}
        css={css`
          ${cssStyles ?? ""}
        `}
        style={{
          ...(style ?? {}),
        }}
      >
        <div
          className="ripple-inner"
          onPointerDownCapture={(e) => {
            if (preventPropagation) {
              e.stopPropagation();
            }
          }}
          {...rest}
          style={{
            width: "100%",
            ...boxStyle,
            borderRadius,
          }}
          onClick={onClickHandler}
        >
          {children}
          <StyledRipple ref={rippleRef} />
        </div>
      </ParentRipple>
    );
  },
);
/** Ripples is a component that can easily add an interactive ripple effect when clicked, simply wrap your component in Ripples and you're good to go! If your component has a border radius, simply pass the same value as a prop to ripples to mask the effect */
export function Ripples(props: RipplesProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Ripples" })}>
      <_Ripples {...props} />
    </ErrorBoundary>
  );
}
