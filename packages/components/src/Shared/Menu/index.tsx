import { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import type { MotionProps, Variants } from "framer-motion";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useResizeDetector } from "react-resize-detector";
import { Row } from "@components";
import { Icon } from "@iconify/react";
import { useHass } from "@hakit/core";

type Extendable = Omit<React.ComponentPropsWithoutRef<"a">, "event" | "definition"> & MotionProps;

interface Item extends Extendable {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

const StyledIcon = styled(Icon)`
  font-size: 1rem;
  color: var(--ha-S400-contrast);
  margin-right: 0.5rem;
`;

const item = {
  variants: {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;

export interface MenuProps extends React.ComponentPropsWithoutRef<"div"> {
  /** the children should simply be the item to activate, it's used as a wrapped and binds the action automatically */
  children?: React.ReactNode;
  /** the placement of the popup @default 'bottom' */
  placement?: "top" | "bottom";
  /** the items for the menu to render */
  items: Item[];
}

const MenuPopup = styled(motion.div)<{
  triggerWidth: number;
}>`
  position: absolute;
  z-index: 50;
  display: flex;
  min-width: 180px;
  flex-direction: column;
  overscroll-behavior: contain;
  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
  border-color: var(--ha-S500);
  background-color: var(--ha-S400);
  padding: 0.5rem;
  color: var(--ha-S400-contrast);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  outline: none !important;
  max-height: max-content;
  max-height: max-content;
  overflow: visible;
  --menu-origin-inline: calc(${(props) => `${props.triggerWidth}px`} / 2);
  left: 0;

  &[data-placement^="bottom"] {
    top: calc(100% + 1em);
    transform-origin: var(--menu-origin-inline) -11px;
  }

  &[data-placement^="top"] {
    bottom: calc(100% + 1em);
    transform-origin: var(--menu-origin-inline) calc(100% + 11px);
  }
`;

const Parent = styled.div`
  position: relative;
`;

const MenuItem = styled(motion.a)`
  display: flex;
  scroll-margin: 0.5rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.5rem;
  outline: none !important;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  &:active,
  &:focus,
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
const MenuPopupArrow = styled.div`
  position: absolute;
  font-size: 30px;
  width: 1em;
  height: 1em;
  pointer-events: none;
  left: var(--menu-origin-inline);
  transform: translateX(-50%);
  &[data-placement^="bottom"] {
    bottom: 100%;
  }
  &[data-placement^="top"] {
    top: 100%;
    transform: translateX(-50%) scaleY(-1);
  }
  > svg {
    display: block;
    fill: var(--ha-S400);
    stroke-width: 1px;
    stroke: var(--ha-S500);
  }
`;

export function Menu({ children, placement = "bottom", items = [], cssStyles, ...props }: MenuProps) {
  const [open, setOpen] = useState(false);
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const { width, ref } = useResizeDetector({
    refreshMode: "debounce",
    handleHeight: false,
    refreshRate: 500,
  });
  // Reference to the menu popup
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to check if the clicked area is outside the menu
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const isMenu = menuRef.current && menuRef.current.contains(event.target as Node);
      const isParent = ref.current && ref.current.contains(event.target as Node);
      if (!isMenu && !isParent) {
        setOpen(false);
      }
    },
    [ref],
  );

  // Effect to add/remove document event listener
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, open]); // Only re-run if 'open' state changes

  return (
    <MotionConfig reducedMotion="user">
      <Parent
        {...props}
        ref={ref}
        css={css`
          ${globalComponentStyle.menu ?? ""}
          ${cssStyles ?? ""}
        `}
      >
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              ...child.props,
              onClick: () => {
                setOpen(!open);
                child.props.onClick?.();
              },
            });
          }
          return child;
        })}
        <AnimatePresence>
          {open && (
            <MenuPopup
              ref={menuRef}
              triggerWidth={width ?? 0}
              className="menu"
              data-placement={placement ?? "bottom"}
              animate={open ? "open" : "closed"}
              initial="closed"
              exit="closed"
              variants={menu}
            >
              <MenuPopupArrow className="menu-arrow" data-placement={placement ?? "bottom"}>
                <svg display="block" viewBox="0 0 30 30">
                  <g transform="rotate(0 15 15)">
                    <path
                      fill="none"
                      d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"
                    ></path>
                    <path
                      stroke="none"
                      d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"
                    ></path>
                  </g>
                </svg>
              </MenuPopupArrow>
              {items.map(({ onClick, active, label, icon, ...rest }, index) => {
                return (
                  <MenuItem
                    {...rest}
                    key={index}
                    variants={item.variants}
                    transition={item.transition}
                    onClick={() => {
                      onClick?.();
                      setOpen(false);
                    }}
                    className={`menu-item ${active ? "active" : ""}`}
                  >
                    <Row fullWidth justifyContent="flex-start">
                      {icon && <StyledIcon icon={icon} />}
                      {label}
                    </Row>
                  </MenuItem>
                );
              })}
            </MenuPopup>
          )}
        </AnimatePresence>
      </Parent>
    </MotionConfig>
  );
}
