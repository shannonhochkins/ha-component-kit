import { useRef, useEffect, useCallback, Children, isValidElement, cloneElement } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { useHass } from "@hakit/core";

const TooltipSpan = styled.span<Pick<TooltipProps, "placement">>`
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--ha-S300);
  color: var(--ha-S100-contrast);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px var(--ha-S100);
  font-size: 0.9rem;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: opacity, visibility;
  pointer-events: none;
  transform: ${(props) => {
    switch (props.placement) {
      default:
      case "top":
        return "translateY(calc(-100% - 10px)) translateX(-50%)";
      case "right":
        return "translateX(10px) translateY(-50%)";
      case "bottom":
        return "translateY(10px) translateX(-50%)";
      case "left":
        return "translateX(calc(-100% - 10px)) translateY(-50%)";
    }
  }};
  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    display: block;
    ${(props) => {
      switch (props.placement) {
        default:
        case "top":
          return `
            border-width: 6px 6px 0 6px;
            border-color: var(--ha-S300) transparent transparent transparent;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
          `;
        case "right":
          return `
            border-width: 6px 6px 6px 0;
            border-color: transparent var(--ha-S300) transparent transparent;
            left: 0;
            top: 50%;
            transform: translate(-100%, -50%);
          `;
        case "bottom":
          return `
            border-width: 0 6px 6px 6px;
            border-color: transparent transparent var(--ha-S300) transparent;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
          `;
        case "left":
          return `
            border-width: 6px 0 6px 6px;
            border-color: transparent transparent transparent var(--ha-S300);
            right: 0;
            top: 50%;
            transform: translate(100%, -50%);
          `;
      }
    }};
  }
`;

export interface TooltipProps extends Omit<React.ComponentPropsWithRef<"div">, "title"> {
  /** the placement of the tooltip @default 'top' */
  placement?: "top" | "right" | "bottom" | "left";
  /** the title of the tooltip */
  title?: React.ReactNode | null;
  /** the children of the tooltip */
  children: React.ReactNode;
}

function InternalTooltip({ placement = "top", title = null, children, ref, ...rest }: TooltipProps) {
  const tooltipRef = useRef<HTMLSpanElement | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);
  const { useStore } = useHass();
  const portalRoot = useStore((store) => store.portalRoot);
  const windowContext = useStore((store) => store.windowContext);
  const win = windowContext ?? window;

  const calculatePosition = useCallback(() => {
    const childRect = childRef.current?.getBoundingClientRect();
    if (typeof childRect === "undefined" || !tooltipRef.current) return;
    let top = 0;
    let left = 0;
    switch (placement) {
      case "top":
        top = childRect.top;
        left = childRect.left + childRect.width / 2;
        break;
      case "right":
        top = childRect.top + childRect.height / 2;
        left = childRect.right;
        break;
      case "bottom":
        top = childRect.bottom;
        left = childRect.left + childRect.width / 2;
        break;
      case "left":
        top = childRect.top + childRect.height / 2;
        left = childRect.left;
        break;
    }
    tooltipRef.current.style.top = `${top}px`;
    tooltipRef.current.style.left = `${left}px`;
  }, [placement]);

  useEffect(() => {
    calculatePosition();
    win.addEventListener("resize", calculatePosition);
    return () => {
      win.removeEventListener("resize", calculatePosition);
    };
  }, [calculatePosition, win]);

  const handleMouseEnter = useCallback(() => {
    const tooltipEl = tooltipRef.current;
    if (tooltipEl) {
      tooltipEl.style.opacity = "1";
      tooltipEl.style.visibility = "visible";
      calculatePosition();
    }
  }, [calculatePosition]);

  const handleHide = useCallback(() => {
    const tooltipEl = tooltipRef.current;
    if (tooltipEl) {
      tooltipEl.style.opacity = "0";
      tooltipEl.style.visibility = "hidden";
    }
  }, []);

  if (title === null || title === "") {
    return children;
  }

  return (
    <div
      ref={childRef}
      onBlur={handleHide}
      onTouchEnd={handleHide}
      onTouchStart={handleMouseEnter}
      onMouseUp={handleHide}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleHide}
      {...rest}
    >
      {Children.map(children, (child, index) => {
        if (
          isValidElement<
            Omit<React.ComponentPropsWithRef<"div">, "onClick"> & {
              onClick: (unknown: null, event: React.MouseEvent<HTMLDivElement>) => void;
            }
          >(child)
        ) {
          return cloneElement(child, {
            ...child.props,
            onClick(_unknown: null, event: React.MouseEvent<HTMLDivElement>) {
              child.props.onClick?.(_unknown, event);
              rest?.onClick?.(event);
            },
            ref,
            key: child.key ?? index,
          });
        }
        return child;
      })}
      {typeof document !== "undefined" &&
        createPortal(
          <TooltipSpan className="tooltip-inner" placement={placement} ref={tooltipRef}>
            {title}
          </TooltipSpan>,
          portalRoot ?? win.document.body,
        )}
    </div>
  );
}

/** Tooltip is a simplified component similar to material ui's Tooltip component, simply wrap any element in the Tooltip and provide a title as either ReactNode or string, and it will render the tooltip on hover, if you want to conditionally render a tooltip, simply set the title to either null or an empty string */
export function Tooltip(props: TooltipProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Tooltip" })}>
      <InternalTooltip {...props} />
    </ErrorBoundary>
  );
}
