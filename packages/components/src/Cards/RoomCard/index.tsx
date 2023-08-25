import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useEffect, useCallback, useState } from "react";
import { useHass, useHash } from "@hakit/core";
import { Row, FabCard } from "@components";
import type { PictureCardProps } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";
import type { MotionProps } from "framer-motion";

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
  width: var(--ha-device-picture-card-width);
  display: flex;
  aspect-ratio: 16 / 9;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow, background-image;
  will-change: width, height;

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
    background-color: var(--ha-primary-background-hover);
  }
`;

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
  z-index: var(--ha-device-room-card-z-index);
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
  ...rest
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
    resetHash();
  }, [resetHash]);
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
                <FabCard icon="mdi:close" onClick={() => resetAnimation()} />
              </Row>
            </NavBar>
            <AnimatePresence
              key={`layout-children-${hash}`}
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
          whileTap={{ scale: 0.9 }}
          {...rest}
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
