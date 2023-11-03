import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { Children, useEffect, useCallback, useState, useId, useMemo } from "react";
import { useHass, type EntityName } from "@hakit/core";
import { Row, FabCard, fallback, mq, PreloadImage, CardBase } from "@components";
import type { PictureCardProps, CardBaseProps, AvailableQueries } from "@components";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyPress } from "react-use";
import { ErrorBoundary } from "react-error-boundary";

type OmitProperties = 'as' | 'active' |
'title' |
'entity' |
'service' |
'serviceData' |
'longPressCallback' |
'onClick' |
'modalProps';

type Extendable = PictureCardProps & Omit<CardBaseProps<'div', EntityName>, OmitProperties>
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
  &:hover, &:active {
    background-color: transparent !important;
  }
  height: var(--stretch,);
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
  className,
  preloadProps,
  onClick,
  ...rest
}: AreaCardProps) {
  const _id = useId();
  const { addRoute } = useHass();
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const [forceRender, setForceRender] = useState(false);
  const [animateChildren, setAnimateChildren] = useState(false);
  const actualHash = window.location.hash;
  const active = useMemo(() => actualHash.replace("#", "") === hash.replace("#", ""), [hash, actualHash]);
  // starts the trigger to close the full screen card
  const resetAnimation = useCallback(() => {
    setForceRender(false);
  }, []);
  useEffect(() => {
    if (actualHash && active && !forceRender) {
      setForceRender(true);
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
    if (isPressed && active === true) {
      window.location.hash = "";
      resetAnimation();
    }
  }, [isPressed, active, resetAnimation]);

  return (
    <>
      <AnimatePresence key={`${_id}-area-card-parent`}>
        {forceRender === true && (
          <FullScreen
            key={`layout-${_id}`}
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
            onAnimationComplete={() => {
              if (!animateChildren) {
                setAnimateChildren(true);
              }
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
              key={`layout-children-${_id}`}
              onExitComplete={() => {
                resetAnimation();
              }}
            >
              {animateChildren && (
                <ChildContainer
                  className={"child-container"}
                  initial={{ opacity: 0 }}
                  exit={{
                    opacity: 0,
                  }}
                  animate={{
                    transition: {
                      duration: animationDuration,
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
        id={`${_id}-area-card`}
        layoutId={`layout-${_id}`}
        className={`area-card ${className ?? ""}`}
        onClick={() => {
          window.location.hash = hash;
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
  }
  return (
    <ErrorBoundary {...fallback({ prefix: "AreaCard" })}>
      <_AreaCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
