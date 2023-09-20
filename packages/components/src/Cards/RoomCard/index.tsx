import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useEffect, useCallback, useState } from "react";
import { useHass } from "@hakit/core";
import { Row, FabCard, fallback, mq } from "@components";
import type { PictureCardProps } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";
import type { MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

type Extendable = PictureCardProps &
  Omit<React.ComponentProps<"div">, "onClick" | "ref"> &
  MotionProps;
export interface RoomCardProps extends Extendable {
  /** the hash of the room, eg "office", "living-room", this will set the hash in the url bar and activate the room */
  hash: string;
  /** The children to render when the room is activated */
  children: React.ReactNode;
  /** the animation duration of the room expanding @default 0.25 */
  animationDuration?: number;
}

const StyledPictureCard = styled(motion.button)<Partial<PictureCardProps>>`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  width: var(--ha-device-picture-card-width);
  aspect-ratio: 16 / 9;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow, background-image;
  will-change: width, height;
  color: var(--ha-S200-contrast);
  ${mq(['mobile', 'tablet', 'smallScreen'], `
    width: calc(100% - 2rem);
    flex-shrink: 1;
  `)}
  svg {
    color: var(--ha-S200-contrast);
    transition: color var(--ha-transition-duration) var(--ha-easing);
  }
  ${(props) =>
    props.image &&
    `
    background-image: url(${props.image});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `}

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--ha-S300);
    color: var(--ha-500-contrast);
    svg {
      color: var(--ha-S300-contrast);
    }
  }
`;

const PictureCardFooter = styled(motion.div)`
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
  z-index: calc(var(--ha-device-room-card-z-index) + 1);
  border-bottom: 1px solid var(--ha-S200);
`;

const StyledRoomCard = styled(motion.div)`
  position: relative;
  button {
    max-height: 100%;
  }

  ${mq(['mobile'], `
    width: 100%;
    flex-shrink: 1;
  `)}
  ${mq(['tablet', 'smallScreen'], `
    width: calc(50% - var(--gap) / 2);
    flex-shrink: 1;
  `)}
`;

const FullScreen = styled(motion.div)`
  position: fixed;
  inset: 0;
  left: var(--ha-room-card-expanded-offset);
  padding: 0;
  margin: 0;
  max-height: 100svh;
  background: var(--ha-S100);
  z-index: var(--ha-device-room-card-z-index);
  display: flex;
  justify-content: center;
  align-items: stretch;
  transition: left var(--ha-transition-duration) var(--ha-easing);
  color: var(--ha-S50-contrast);
  ${mq(['mobile', 'tablet'], `
    left: 0;
  `)}
`;

const ChildContainer = styled(motion.div)`
  opacity: 0;
  padding: 1rem 1.5rem 1.5rem;
  margin-top: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  flex-direction: column;
`;

function _RoomCard({
  hash,
  children,
  icon,
  title,
  image,
  animationDuration = 0.25,
  ...rest
}: RoomCardProps) {
  const { addRoute, useRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [forceRender, setForceRender] = useState(false);
  const [animateChildren, setAnimateChildren] = useState(false);
  const route = useRoute(hash);
  const actualHash = window.location.hash;
  const active = actualHash.replace("#", "") === hash.replace("#", "");
  // starts the trigger to close the full screen card
  const resetAnimation = useCallback(() => {
    setForceRender(false);
  }, []);
  useEffect(() => {
    if (actualHash && active && !forceRender) {
      setForceRender(true);
    } else if (actualHash && active && forceRender && !animateChildren) {
      setAnimateChildren(true);
    } else if (!active && (forceRender || animateChildren)) {
      setAnimateChildren(false);
      setForceRender(false);
    }
  }, [actualHash, forceRender, active, animateChildren]);
  // add the current route by hash, even though this is called multiple times
  // it will only add it the first time
  useEffect(() => {
    addRoute({
      hash,
      icon: icon || "mdi:info",
      name: title,
      active: actualHash.replace("#", "") === hash.replace("#", ""),
    });
  }, [addRoute, actualHash, hash, icon, title]);

  // when the escape key is pressed and we're active, close the card
  useEffect(() => {
    if (isPressed && route?.active === true) {
      window.location.hash = "";
      resetAnimation();
    }
  }, [isPressed, route?.active, resetAnimation]);

  return (
    <>
      <AnimatePresence key={`${hash}-room-card-parent`}>
        {forceRender === true && (
          <FullScreen
            key={`layout-${hash}`}
            layoutId={`layout-${hash}`}
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
            <NavBar
              animate={{
                transition: {
                  duration: animationDuration,
                },
              }}
            >
              <Row gap="0.5rem" justifyContent="space-between">
                <Row gap="0.5rem">
                  {icon && <Icon icon={icon} />}
                  {title}
                </Row>
                <FabCard
                  title="Close"
                  tooltipPlacement="left"
                  icon="mdi:close"
                  onClick={() => {
                    window.location.hash = "";
                    resetAnimation();
                  }}
                />
              </Row>
            </NavBar>
            <AnimatePresence
              key={`layout-children-${hash}`}
              onExitComplete={() => {
                window.location.hash = "";
                resetAnimation();
              }}
            >
              {animateChildren && (
                <ChildContainer
                  initial={{ opacity: 0 }}
                  transition={{
                    duration: animationDuration,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  animate={{
                    transition: {
                      delay: animationDuration,
                    },
                    opacity: 1,
                  }}
                >
                  {children}
                </ChildContainer>
              )}
            </AnimatePresence>
          </FullScreen>
        )}
      </AnimatePresence>
      <StyledRoomCard layoutId={`layout-${hash}`}>
        <StyledPictureCard
          whileTap={{ scale: 0.9 }}
          {...rest}
          image={image}
          onClick={() => {
            window.location.hash = hash;
          }}
        >
          <PictureCardFooter
            animate={{
              transition: {
                duration: animationDuration,
              },
            }}
          >
            <Row gap={"0.5rem"}>
              {icon && (
                <Icon
                  icon={icon}
                  style={{
                    color: `var(--ha-500-contrast)`,
                  }}
                />
              )}
              {title}
            </Row>
          </PictureCardFooter>
        </StyledPictureCard>
      </StyledRoomCard>
    </>
  );
}
/** The RoomCard component is a very simple way of categorizing all your entities into a single "PictureCard" which will show all the entities when clicked. */
export function RoomCard(props: RoomCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "RoomCard" })}>
      <_RoomCard {...props} />
    </ErrorBoundary>
  );
}
