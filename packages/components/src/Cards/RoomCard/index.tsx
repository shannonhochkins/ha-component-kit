import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useEffect, useCallback, useState } from "react";
import { useHass, useHash } from "@hakit/core";
import { StyledPictureCard, Row, FabCard } from "@components";
import type { PictureCardProps } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";

export interface RoomCardProps extends PictureCardProps {
  /** the hash of the room, eg "office", "living-room", this will set the hash in the url bar and activate the room */
  hash: string;
  /** The children to render when the room is activated */
  children: React.ReactNode;
  /** the animation duration of the room expanding @default 0.25 */
  animationDuration?: number;
}

const PictureCardFooter = styled(motion.div)`
  all: unset;
  padding: 1rem;
  background-color: var(--ha-background-opaque);
  position: absolute;
  inset: auto 0 0 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

const NavBar = styled(PictureCardFooter)`
  background-color: var(--ha-primary-background);
  inset: 0 0 auto 0;
`;

const StyledRoomCard = styled(motion.div)`
  position: relative;
  button {
    max-height: 100%;
  }
`;

const FullScreen = styled(motion.div)`
  position: fixed;
  inset: 0;
  left: var(--ha-room-card-expanded-offset);
  padding: 0;
  margin: 0;
  max-height: 100svh;
  background: var(--ha-background);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: stretch;
  transition: left var(--ha-transition-duration) var(--ha-easing);
`;

const ChildContainer = styled(motion.div)`
  opacity: 0;
  padding-top: 4rem;
  padding: 4rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/** The RoomCard component is a very simple way of categorizing all your entities into a single "PictureCard" which will show all the entities when clicked. */
export function RoomCard({
  hash,
  children,
  icon,
  title,
  image,
  animationDuration = 0.25,
}: RoomCardProps) {
  const { addRoute, useRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [, setHash] = useHash();
  const [startAnimation, setStartAnimation] = useState(false);
  const route = useRoute(hash);
  useEffect(() => {
    if (route?.active && !startAnimation) {
      setStartAnimation(true);
    }
  }, [route, startAnimation]);
  // will reset the hash back to it's original empty value
  const resetHash = useCallback(() => {
    setHash("");
  }, [setHash]);
  // starts the trigger to close the full screen card
  const resetAnimation = useCallback(() => {
    setStartAnimation(false);
  }, []);
  // add the current route by hash
  useEffect(() => {
    addRoute({
      hash,
      icon: icon || "mdi:info",
      name: title,
      active: false,
    });
  }, [addRoute, hash, icon, title]);

  // when the escape key is pressed and we're active, close the card
  useEffect(() => {
    if (isPressed && route?.active) {
      resetAnimation();
    }
  }, [isPressed, route, resetAnimation]);

  return (
    <>
      <AnimatePresence>
        {route?.active && (
          <FullScreen
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
                <FabCard icon="mdi:close" onClick={() => resetAnimation()} />
              </Row>
            </NavBar>
            <AnimatePresence
              onExitComplete={() => {
                resetHash();
              }}
            >
              {startAnimation && (
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
          style={{
            width: "var(--ha-device-room-card-width)",
          }}
          image={image}
          onClick={() => {
            setHash(hash);
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
              {icon && <Icon icon={icon} />}
              {title}
            </Row>
          </PictureCardFooter>
        </StyledPictureCard>
      </StyledRoomCard>
    </>
  );
}
