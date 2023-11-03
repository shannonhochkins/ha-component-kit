import {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
  CSSProperties,
  FC,
  forwardRef,
  Children,
  MutableRefObject,
  RefAttributes,
} from "react";
import styled from "@emotion/styled";

const StyledMarquee = styled.div`
  overflow-x: hidden !important;
  display: flex !important;
  flex-direction: row !important;
  position: relative;
  width: var(--ha-marquee-width);
  transform: var(--ha-marquee-transform);

  &:hover div {
    animation-play-state: var(--ha-marquee-pause-on-hover);
  }

  &:active div {
    animation-play-state: var(--ha-marquee-pause-on-click);
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;

    &::before,
    &::after {
      background: linear-gradient(to right, var(--ha-marquee-gradient-color));
      content: "";
      height: 100%;
      position: absolute;
      width: var(--ha-marquee-gradient-width);
      z-index: 2;
    }

    &::after {
      right: 0;
      top: 0;
      transform: rotateZ(180deg);
    }

    &::before {
      left: 0;
      top: 0;
    }
  }

  .marquee {
    flex: 0 0 auto;
    min-width: var(--ha-marquee-min-width);
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: scroll var(--ha-marquee-duration) linear var(--ha-marquee-delay) var(--ha-marquee-iteration-count);
    animation-play-state: var(--ha-marquee-play);
    animation-delay: var(--ha-marquee-delay);
    animation-direction: var(--ha-marquee-direction);

    @keyframes scroll {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }

  .initial-child-container {
    flex: 0 0 auto;
    display: flex;
    min-width: auto;
    flex-direction: row;
  }

  .child {
    transform: var(--ha-marquee-transform);
    &.last-child {
      padding-right: var(--ha-marquee-padding-right);
    }
  }
`;

export type MarqueeProps = {
  /**
   * @description Inline style for the container div
   * @type {CSSProperties}
   * @default {}
   */
  style?: CSSProperties;
  /**
   * @description Class name to style the container div
   * @type {string}
   * @default ""
   */
  className?: string;
  /**
   * @description Whether to automatically fill blank space in the marquee with copies of the children or not
   * @type {boolean}
   * @default false
   */
  autoFill?: boolean;
  /**
   * @description Whether to play or pause the marquee
   * @type {boolean}
   * @default true
   */
  play?: boolean;
  /**
   * @description Whether to pause the marquee when hovered
   * @type {boolean}
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * @description Whether to pause the marquee when clicked
   * @type {boolean}
   * @default false
   */
  pauseOnClick?: boolean;
  /**
   * @description The direction the marquee is sliding
   * @type {"left" | "right" | "up" | "down"}
   * @default "left"
   */
  direction?: "left" | "right" | "up" | "down";
  /**
   * @description Speed calculated as pixels/second
   * @type {number}
   * @default 50
   */
  speed?: number;
  /**
   * @description Duration to delay the animation after render, in seconds
   * @type {number}
   * @default 0
   */
  delay?: number;
  /**
   * @description The number of times the marquee should loop, 0 is equivalent to infinite
   * @type {number}
   * @default 0
   */
  loop?: number;
  /**
   * @description Whether to show the gradient or not
   * @type {boolean}
   * @default false
   */
  gradient?: boolean;
  /**
   * @description The rgb color of the gradient as an array of length 3
   * @type {Array<number>} of length 3
   * @default [255, 255, 255]
   */
  gradientColor?: [number, number, number];
  /**
   * @description The width of the gradient on either side
   * @type {number | string}
   * @default 200
   */
  gradientWidth?: number | string;
  /**
   * @description A callback for when the marquee finishes scrolling and stops. Only calls if loop is non-zero.
   * @type {() => void}
   * @default null
   */
  onFinish?: () => void;
  /**
   * @description A callback for when the marquee finishes a loop. Does not call if maximum loops are reached (use onFinish instead).
   * @type {() => void}
   * @default null
   */
  onCycleComplete?: () => void;
  /**
   * @description: A callback function that is invoked once the marquee has finished mounting. It can be utilized to recalculate the page size, if necessary.
   * @type {() => void}
   * @default null
   */
  onMount?: () => void;
  /**
   * @description The children rendered inside the marquee
   * @type {ReactNode}
   * @default null
   */
  children?: ReactNode;
} & RefAttributes<HTMLDivElement>;

export const Marquee: FC<MarqueeProps> = forwardRef(function Marquee(
  {
    style = {},
    className = "",
    autoFill = false,
    play = true,
    pauseOnHover = false,
    pauseOnClick = false,
    direction = "left",
    speed = 50,
    delay = 0,
    loop = 0,
    gradient = false,
    gradientColor = [255, 255, 255],
    gradientWidth = 200,
    onFinish,
    onCycleComplete,
    onMount,
    children,
  },
  ref,
) {
  // React Hooks
  const [containerWidth, setContainerWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = (ref as MutableRefObject<HTMLDivElement>) || rootRef;
  const marqueeRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Calculate width of container and marquee and set multiplier
  const calculateWidth = useCallback(() => {
    if (marqueeRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const marqueeRect = marqueeRef.current.getBoundingClientRect();
      let containerWidth = containerRect.width;
      let marqueeWidth = marqueeRect.width;

      // Swap width and height if direction is up or down
      if (direction === "up" || direction === "down") {
        containerWidth = containerRect.height;
        marqueeWidth = marqueeRect.height;
      }

      if (autoFill && containerWidth && marqueeWidth) {
        setMultiplier(marqueeWidth < containerWidth ? Math.ceil(containerWidth / marqueeWidth) : 1);
      } else {
        setMultiplier(1);
      }

      setContainerWidth(containerWidth);
      setMarqueeWidth(marqueeWidth);
    }
  }, [autoFill, containerRef, direction]);

  // Calculate width and multiplier on mount and on window resize
  useEffect(() => {
    if (!isMounted) return;

    calculateWidth();
    if (marqueeRef.current && containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => calculateWidth());
      resizeObserverRef.current.observe(containerRef.current);
      resizeObserverRef.current.observe(marqueeRef.current);
    }
  }, [calculateWidth, containerRef, isMounted]);

  // Recalculate width when children change
  useEffect(() => {
    calculateWidth();
  }, [calculateWidth, children]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (!resizeObserverRef.current) return;
      resizeObserverRef.current.disconnect();
    };
  }, []);

  // Runs the onMount callback, if it is a function, when Marquee is mounted.
  useEffect(() => {
    if (typeof onMount === "function") {
      onMount();
    }
  }, [onMount]);

  // Animation duration
  const duration = useMemo(() => {
    if (autoFill) {
      return (marqueeWidth * multiplier) / speed;
    } else {
      return marqueeWidth < containerWidth ? containerWidth / speed : marqueeWidth / speed;
    }
  }, [autoFill, containerWidth, marqueeWidth, multiplier, speed]);

  // Gradient color in an unfinished rgba format
  const rgbaGradientColor = `rgba(${gradientColor[0]}, ${gradientColor[1]}, ${gradientColor[2]}`;

  const containerStyle = useMemo(
    () => ({
      ...style,
      ["--ha-marquee-pause-on-hover" as string]: !play || pauseOnHover ? "paused" : "running",
      ["--ha-marquee-pause-on-click" as string]: !play || (pauseOnHover && !pauseOnClick) || pauseOnClick ? "paused" : "running",
      ["--ha-marquee-width" as string]: direction === "up" || direction === "down" ? `100vh` : "100%",
      ["--ha-marquee-transform" as string]: direction === "up" ? "rotate(-90deg)" : direction === "down" ? "rotate(90deg)" : "none",
    }),
    [style, play, pauseOnHover, pauseOnClick, direction],
  );

  const gradientStyle = useMemo(
    () => ({
      ["--ha-marquee-gradient-color" as string]: `${rgbaGradientColor}, 1), ${rgbaGradientColor}, 0)`,
      ["--ha-marquee-gradient-width" as string]: typeof gradientWidth === "number" ? `${gradientWidth}px` : gradientWidth,
    }),
    [rgbaGradientColor, gradientWidth],
  );

  const marqueeStyle = useMemo(
    () => ({
      ["--ha-marquee-play" as string]: play ? "running" : "paused",
      ["--ha-marquee-direction" as string]: direction === "left" ? "normal" : "reverse",
      ["--ha-marquee-duration" as string]: `${duration}s`,
      ["--ha-marquee-delay" as string]: `${delay}s`,
      ["--ha-marquee-iteration-count" as string]: loop > 0 ? `${loop}` : "infinite",
      ["--ha-marquee-min-width" as string]: autoFill ? `auto` : "100%",
      ["--ha-marquee-padding-right" as string]: autoFill ? `4rem` : "0",
    }),
    [play, direction, duration, delay, loop, autoFill],
  );

  const childStyle = useMemo(
    () => ({
      ["--ha-marquee-transform" as string]: direction === "up" ? "rotate(90deg)" : direction === "down" ? "rotate(-90deg)" : "none",
    }),
    [direction],
  );

  // Render {multiplier} number of children
  const multiplyChildren = useCallback(
    (multiplier: number) => {
      return [...Array(Number.isFinite(multiplier) && multiplier >= 0 ? multiplier : 0)].map((_, i) => (
        <Fragment key={i}>
          {Children.map(children, (child, index) => {
            return (
              <div style={childStyle} className={`child ${index === Children.toArray(children).length - 1 ? "last-child" : ""}`}>
                {child}
              </div>
            );
          })}
        </Fragment>
      ));
    },
    [childStyle, children],
  );

  return !isMounted ? null : (
    <StyledMarquee ref={containerRef} style={containerStyle} className={"marquee-container " + className}>
      {gradient && <div style={gradientStyle} className="overlay" />}
      <div className="marquee" style={marqueeStyle} onAnimationIteration={onCycleComplete} onAnimationEnd={onFinish}>
        <div className="initial-child-container" ref={marqueeRef}>
          {Children.map(children, (child, index) => {
            return (
              <div style={childStyle} className={`child ${index === Children.toArray(children).length - 1 ? "last-child" : ""}`}>
                {child}
              </div>
            );
          })}
        </div>
        {multiplyChildren(multiplier - 1)}
      </div>
      <div className="marquee" style={marqueeStyle}>
        {multiplyChildren(multiplier)}
      </div>
    </StyledMarquee>
  );
});
