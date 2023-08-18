import React, {
  CSSProperties,
  memo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;
export interface RipplesProps extends Extendable {
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
/** Ripples is a component that can easily add an interactive ripple effect when clicked, simply wrap your component in Ripples and you're good to go! If your component has a border radius, simply pass the same value as a prop to ripples to mask the effect */
export const Ripples = memo(
  ({
    duration = 600,
    color = "rgba(0, 0, 0, .3)",
    borderRadius = "none",
    onClick,
    children,
    disabled,
    ...rest
  }: RipplesProps) => {
    const [rippleStyle, setRippleStyle] = useState<CSSProperties>({});
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

        const left = pageX - (rect.left + window.scrollX);
        const top = pageY - (rect.top + window.scrollY);
        const size = Math.max(rect.width, rect.height);

        setRippleStyle((state) => ({
          ...state,
          left: isNaN(left) ? 0 : left,
          top: isNaN(top) ? 0 : top,
          opacity: 1,
          transform: "translate(-50%, -50%)",
          transition: "initial",
          backgroundColor: color,
        }));
        // start a timeout to scale the ripple
        timeoutId.current = setTimeout(() => {
          setRippleStyle((state) => ({
            ...state,
            opacity: 0,
            transform: `scale(${size / 9})`,
            transition: `all ${duration}ms`,
          }));
          timeoutId.current = null;
        }, 50);

        if (typeof onClick === "function") onClick(event);
      },
      [color, duration, disabled, onClick]
    );

    return (
      <ParentRipple borderRadius={borderRadius}>
        <motion.div
          layout
          {...rest}
          style={{
            ...boxStyle,
            borderRadius,
          }}
          onClick={onClickHandler}
        >
          {children}
          <StyledRipple
            style={{
              ...rippleStyle,
            }}
          />
        </motion.div>
      </ParentRipple>
    );
  }
);
