import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useEffect, useMemo, useState, useId } from "react";
import { useHass, type EntityName } from "@hakit/core";
import { Row, FabCard, fallback, mq, PreloadImage, CardBase } from "@components";
import type { PictureCardProps, CardBaseProps, AvailableQueries } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";
import { ErrorBoundary } from "react-error-boundary";

type OmitProperties =
  | "as"
  | "active"
  | "title"
  | "entity"
  | "modalProps"
  | "ref"
  | "entity"
  | "serviceData"
  | "service"
  | "disableRipples"
  | "disableScale"
  | "disableActiveState"
  | "rippleProps"
  | "service"
  | "serviceData"
  | "longPressCallback"
  | "onClick"
  | "modalProps";

type Extendable = PictureCardProps & Omit<CardBaseProps<"div", EntityName>, OmitProperties>;
export interface AreaCardProps extends Extendable {
  /** the hash of the area, eg "office", "living-room", this will set the hash in the url bar and activate the area */
  hash: string;
  /** The children to render when the area is activated */
  children: React.ReactNode;
  /** the animation duration of the area expanding @default 0.25 */
  animationDuration?: number;
  /** called when the card is pressed */
  onClick?: () => void;
}

const StyledAreaCard = styled(CardBase)<Partial<PictureCardProps>>`
  aspect-ratio: 16 / 9;
  background-color: transparent;
  &:hover,
  &:active {
    background-color: transparent !important;
  }
  height: var(--stretch,);
`;

const PictureCardFooter = styled.div`
  all: unset;
  padding: 1rem;
  color: var(--ha-500-contrast);
  background-color: var(--ha-background-opaque);
  transition: color var(--ha-transition-duration) var(--ha-easing);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

const NavBar = styled(PictureCardFooter)`
  padding: 0.95rem;
  color: var(--ha-S100-contrast);
  background-color: var(--ha-S50);
  inset: 0 0 auto 0;
  z-index: calc(var(--ha-device-area-card-z-index) + 1);
  border-bottom: 1px solid var(--ha-S200);
`;

const FullScreen = styled(motion.div)`
  position: fixed;
  inset: 0;
  left: var(--ha-area-card-expanded-offset);
  padding: 0;
  margin: 0;
  max-height: 100svh;
  background: var(--ha-S100);
  z-index: var(--ha-device-area-card-z-index);
  display: flex;
  justify-content: center;
  align-items: stretch;
  transition: left var(--ha-transition-duration) var(--ha-easing);
  color: var(--ha-S50-contrast);
  ${mq(
    ["xxs", "xs"],
    `
    left: 0;
  `,
  )}
`;

const ChildContainer = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  flex-direction: column;
`;

function _AreaCard({
  hash,
  children,
  icon,
  title,
  image,
  animationDuration = 0.25,
  className,
  preloadProps,
  onClick,
  ...rest
}: AreaCardProps) {
  const _id = useId();
  const { addRoute, getRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [open, setOpen] = useState(false);
  const route = useMemo(() => getRoute(hash), [hash, getRoute]);

  useEffect(() => {
    // if the route is active, and active isn't set, set it
    if (route?.active && !open) {
      setOpen(true);
      // if the route isn't active, and we're open, close it
    } else if (!route?.active && open) {
      setOpen(false);
    }
  }, [route, open]);

  useEffect(() => {
    // add the current route by hash, even though this is called multiple times
    // it will only add it the first time
    addRoute({
      hash,
      icon: icon || "mdi:info",
      name: title,
    });
  }, [addRoute, hash, icon, title]);

  // when the escape key is pressed and we're active, close the card
  useEffect(() => {
    if (isPressed && open) {
      // setting the hash change here, will also bubble up to the provider
      // which will update the routes, which will update the state automatically.
      location.hash = "";
    }
  }, [isPressed, open]);

  return (
    <>
      <AnimatePresence key={`${_id}-area-card-parent`} mode="wait" initial={false}>
        {open === true && (
          <FullScreen
            key={`fullscreen-layout-${_id}`}
            layoutId={`layout-${_id}`}
            id={`${_id}-expanded`}
            className={"full-screen"}
            initial={{ opacity: 0 }}
            transition={{
              duration: animationDuration,
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: animationDuration,
              },
            }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0,
              },
            }}
          >
            <Global
              styles={css`
                :root {
                  --ha-hide-body-overflow-y: hidden;
                }
              `}
            />
            <NavBar className={"nav-bar"}>
              <Row gap="0.5rem" justifyContent="space-between" className={"row"}>
                <Row gap="0.5rem" className={"row"}>
                  {icon && <Icon className={"icon"} icon={icon} />}
                  {title}
                </Row>
                <FabCard
                  title="Close"
                  tooltipPlacement="left"
                  icon="mdi:close"
                  onClick={() => {
                    location.hash = "";
                  }}
                />
              </Row>
            </NavBar>
            <ChildContainer className={"child-container"}>{children}</ChildContainer>
          </FullScreen>
        )}
      </AnimatePresence>
      <StyledAreaCard
        disableActiveState
        disableRipples
        id={`${_id}-area-card`}
        layoutId={`layout-${_id}`}
        className={`area-card ${className ?? ""}`}
        onClick={() => {
          location.hash = hash;
          if (onClick) {
            onClick();
          }
        }}
        {...rest}
      >
        <PreloadImage
          {...(preloadProps ?? {})}
          src={image}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          lazy
        >
          <PictureCardFooter className={"footer"}>
            <Row gap={"0.5rem"} className={"row"}>
              {icon && (
                <Icon
                  className={"icon"}
                  icon={icon}
                  style={{
                    color: `var(--ha-500-contrast)`,
                  }}
                />
              )}
              {title}
            </Row>
          </PictureCardFooter>
        </PreloadImage>
      </StyledAreaCard>
    </>
  );
}
/** The AreaCard component is a very simple way of categorizing all your entities into a single "PictureCard" which will show all the entities when clicked. */
export function AreaCard(props: AreaCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "AreaCard" })}>
      <_AreaCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
