import React, { Children, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useResizeDetector } from "react-resize-detector";
import { Row } from "@components";
import { Icon } from "@iconify/react";
import { useStore } from "@hakit/core";
import { useFloating, FloatingArrow, shift, limitShift, arrow, offset, autoUpdate, type Placement } from "@floating-ui/react";

type Extendable = Omit<React.ComponentPropsWithoutRef<"a">, "event" | "definition">;

interface Item extends Extendable {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

const StyledIcon = styled(Icon)`
  font-size: 1rem;
  color: var(--ha-S400-contrast);
  margin-right: 0.5rem;
`;

export interface MenuProps extends React.ComponentPropsWithoutRef<"div"> {
  /** the children should simply be the item to activate, it's used as a wrapped and binds the action automatically */
  children?: React.ReactNode;
  /** the placement of the popup @default 'bottom' */
  placement?: Placement;
  /** the items for the menu to render */
  items: Item[];
  /** if the menu/button should be disabled */
  disabled?: boolean;
}

const MenuPopup = styled.div<{
  triggerWidth: number;
}>`
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
  max-height: 300px;
  overflow-y: scroll;
`;

const Parent = styled.div`
  position: relative;
`;

const MenuItem = styled.a`
  display: flex;
  scroll-margin: 0.5rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.8rem 0.5rem;
  outline: none !important;
  background-color: transparent;
  cursor: pointer;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  &:active,
  &:focus,
  &:hover {
    background-color: var(--ha-S600);
  }
  &.active {
    background-color: var(--ha-S700);
  }
`;

export function Menu({ children, placement = "bottom", items = [], disabled = false, cssStyles, ...props }: MenuProps) {
  const [open, setOpen] = useState(false);
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [
      shift({
        limiter: limitShift({
          // Start limiting 5px earlier
          offset: 10,
        }),
      }),
      offset(20),
      arrow({
        element: arrowRef,
      }),
    ],
  });

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
    <Parent
      {...props}
      ref={ref}
      aria-disabled={disabled}
      aria-controls="listbox"
      aria-expanded={open}
      role="combobox"
      css={css`
        ${globalComponentStyle.menu ?? ""}
        ${cssStyles ?? ""}
      `}
    >
      {Children.map(children, (child) => {
        if (
          isValidElement<
            HTMLDivElement & {
              onClick: () => void;
              ref: (node: HTMLDivElement | null) => void;
            }
          >(child)
        ) {
          return cloneElement(child, {
            ...child.props,
            role: "option",
            ref: refs.setReference,
            onClick: () => {
              if (disabled) return;
              setOpen(!open);
              child.props.onClick?.();
            },
          });
        }
        return child;
      })}
      {open && (
        <div ref={refs.setFloating} style={floatingStyles} role="listbox">
          <FloatingArrow
            ref={arrowRef}
            context={context}
            style={{
              fill: "var(--ha-S400)",
            }}
          />
          <MenuPopup triggerWidth={width ?? 0} className="menu">
            {items.map(({ onClick, active, label, icon, ...rest }, index) => {
              return (
                <MenuItem
                  {...rest}
                  key={index}
                  aria-disabled={disabled}
                  role="option"
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
        </div>
      )}
    </Parent>
  );
}
