import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { useEffect, useCallback, useState } from "react";
import { useHass } from "@hakit/core";
import { Row, FabCard, fallback, mq, PreloadImage } from "@components";
import type { PictureCardProps, PreloadImageProps } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";
import type { MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

type Extendable = PictureCardProps &
  Omit<React.ComponentProps<"div">, "onClick" | "ref"> &
  MotionProps;
export interface AreaCardProps extends Extendable {
  /** the hash of the area, eg "office", "living-room", this will set the hash in the url bar and activate the area */
  hash: string;
  /** The children to render when the area is activated */
  children: React.ReactNode;
  /** the animation duration of the area expanding @default 0.25 */
  animationDuration?: number;
  /** props to pass to the image preloader */
  preloadProps?: PreloadImageProps;
}

const StyledPictureCard = styled(motion.button)<Partial<PictureCardProps>>`
  all: unset;
  box-sizing: border-box;
  padding: 0;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  width: 100%;
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
  flex-shrink: 1;
  svg {
    color: var(--ha-S200-contrast);
    transition: color var(--ha-transition-duration) var(--ha-easing);
  }
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--ha-S300);
    color: var(--ha-500-contrast);
    svg {
      color: var(--ha-S300-contrast);
    }
  }
  height: var(--stretch, );
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
  z-index: calc(var(--ha-device-area-card-z-index) + 1);
  border-bottom: 1px solid var(--ha-S200);
`;

const StyledAreaCard = styled(motion.div)`
  position: relative;
  button {
    max-height: 100%;
  }

  ${mq(
    ["mobile"],
    `
    width: 100%;
    flex-shrink: 1;
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc(50% - var(--gap, 0rem) / 2);
    flex-shrink: 1;
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3));
    flex-shrink: 1;
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc(((100% - 3 * var(--gap, 0rem)) / 4));
    flex-shrink: 1;
  `,
  )}
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
    ["mobile", "tablet"],
    `
    left: 0;
  `,
  )}
`;

const ChildContainer = styled(motion.div)`
  opacity: 0;
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
  cssStyles,
  className,
  id,
  preloadProps,
  ...rest
}: AreaCardProps) {
  const { addRoute, getRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [forceRender, setForceRender] = useState(false);
  const [animateChildren, setAnimateChildren] = useState(false);
  const route = getRoute(hash);
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
      <AnimatePresence key={`${hash}-area-card-parent`}>
        {forceRender === true && (
          <FullScreen
            key={`layout-${hash}`}
            layoutId={`layout-${hash}`}
            id={`${id ?? hash}-expanded`}
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
            <NavBar
              className={"nav-bar"}
              animate={{
                transition: {
                  duration: animationDuration,
                },
              }}
            >
              <Row
                gap="0.5rem"
                justifyContent="space-between"
                className={"row"}
              >
                <Row gap="0.5rem" className={"row"}>
                  {icon && <Icon className={"icon"} icon={icon} />}
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
                resetAnimation();
              }}
            >
              {animateChildren && (
                <ChildContainer
                  className={"child-container"}
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
      <StyledAreaCard
        id={`${id ?? hash}-area-card`}
        layoutId={`layout-${hash}`}
        className={`${className ?? ""}`}
        css={css`
          ${cssStyles ?? ""}
        `}
      >
        <StyledPictureCard
          whileTap={{ scale: 0.9 }}
          {...rest}
          onClick={() => {
            window.location.hash = hash;
          }}
        >
          <PreloadImage
            {...preloadProps ?? {}}
            src={image}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
            lazy
            >
            <PictureCardFooter
              className={"footer"}
              animate={{
                transition: {
                  duration: animationDuration,
                },
              }}
            >
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
        </StyledPictureCard>
      </StyledAreaCard>
    </>
  );
}
/** The AreaCard component is a very simple way of categorizing all your entities into a single "PictureCard" which will show all the entities when clicked. */
export function AreaCard(props: AreaCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "AreaCard" })}>
      <_AreaCard {...props} />
    </ErrorBoundary>
  );
}
