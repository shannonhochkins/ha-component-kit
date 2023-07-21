import styled from "@emotion/styled";
import { useEffect, useMemo, useCallback, useState } from "react";
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
`;

const FullScreen = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: var(--ha-background);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;

const ChildContainer = styled(motion.div)`
  opacity: 0;
  padding-top: 4rem;
  width: 100%;
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
  const { addRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [_hash, setHash] = useHash();
  const [startAnimation, setStartAnimation] = useState(false);
  // if the current has value is the same as the hash, we're active
  const active = useMemo(() => {
    const hashWithoutPound = _hash.replace("#", "");
    if (hashWithoutPound === "") return null;
    return hashWithoutPound === hash;
  }, [_hash, hash]);
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
    addRoute(hash);
  }, [addRoute, hash]);

  // when the escape key is pressed and we're active, close the card
  useEffect(() => {
    if (isPressed && active) {
      resetAnimation();
    }
  }, [isPressed, active, resetAnimation]);

  return (
    <>
      <AnimatePresence>
        {active && (
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
          image={image}
          onClick={() => {
            setHash(hash);
            setStartAnimation(true);
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
