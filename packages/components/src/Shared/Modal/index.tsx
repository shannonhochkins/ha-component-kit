import { Column, FabCard, Row, fallback, mq, useModalStore } from "@components";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { localize, useHass } from "@hakit/core";
import { AnimatePresence, HTMLMotionProps, MotionProps, type Variant, type Transition, motion } from "framer-motion";
import { Fragment, ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useKeyPress } from "react-use";

const ModalContainer = styled(motion.div)`
  position: absolute;
  z-index: 1;
  top: 2rem;
  left: 50%;
  display: flex;
  width: var(--ha-modal-width);
  margin-left: calc(var(--ha-modal-width) / -2);
  color: var(--ha-S50-contrast);
  max-height: calc(100% - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--ha-S200);
  z-index: var(--ha-modal-z-index);
  box-shadow: 0px 0px 10px hsla(var(--ha-h), calc(var(--ha-50-s) * 0.8), 3%, 0.6);
  ${mq(
    ["xxs", "xs"],
    `
    max-width: 95vw;
    margin-left: calc(95vw / -2);
  `,
  )}
`;
const ModalInner = styled(motion.div)`
  display: flex;
  padding: 0rem 1rem 2rem;
  align-items: flex-start;
  flex-direction: column;
`;
const ModalOverflow = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
`;
const ModalHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  flex-wrap: nowrap;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  > span {
    margin: 0;
    font-size: 0.9rem;
    color: var(--ha-S500-contrast);
    display: flex;
  }
`;

const Description = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  color: var(--ha-S500-contrast);
`;

const ModalBackdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: hsla(var(--ha-h), calc(var(--ha-s) * 1%), 10%, 0.3);
  z-index: var(--ha-modal-z-index);
  backdrop-filter: blur(2em) brightness(0.75);
`;
interface Animation {
  variants?: {
    animate?: Variant;
    initial?: Variant;
    exit?: Variant;
  };
  layoutId?: string;
  transition?: Transition;
}
/** animation variant controls for the modal container */
export type CustomModalAnimation = (
  duration: number,
  id: string,
) => {
  /** animation variant controls for main modal element */
  modal?: Animation;
  /** animation variant controls for the modal header element */
  header?: Animation;
  /** animation variant controls for the modal content element */
  content?: Animation;
};

type Extendable = React.ComponentPropsWithoutRef<"div"> & MotionProps;
export interface ModalProps extends Omit<Extendable, "title"> {
  /** triggers the modal opening */
  open: boolean;
  /** the id to provide for framer-motion, this should link back to another layoutId property on the element triggering the Modal */
  id: string;
  /** the react layout to include inside the Modal */
  children: React.ReactNode;
  /** The title of the dialog */
  title?: ReactNode;
  /** the description of the modal */
  description?: ReactNode;
  /** triggered when the users pressed the close button, this is also triggered when the escape key is pressed */
  onClose: () => void;
  /** any prop to pass to the backdrop element */
  backdropProps?: HTMLMotionProps<"div">;
  /** react elements to render next to the close button */
  headerActions?: () => ReactNode;
  /** the animation duration modal animation in seconds @default 0.25 */
  animationDuration?: number;
  /** controls for the modalAnimations, by default the modal will animate expanding from the originating element */
  modalAnimation?: CustomModalAnimation;
  /** Automatically close the modal after the provided number of seconds */
  autocloseSeconds?: number;
}
const LAYOUT_MODAL_ANIMATION: CustomModalAnimation = (duration, id) => {
  const transition = {
    duration,
    ease: [0.42, 0, 0.58, 1],
  };
  return {
    modal: {
      transition: {
        duration,
        type: "spring",
        damping: 7.5,
        mass: 0.55,
        stiffness: 100,
        layout: {
          duration,
        },
      },
      layoutId: id,
    },
    header: {
      variants: {
        exit: { y: "-10%", opacity: 0, transition, scale: 0.9 },
        initial: { y: "-10%", opacity: 0, transition, scale: 0.9 },
        animate: {
          scale: 1,
          y: 0,
          x: 0,
          opacity: 1,
          transition: {
            ...transition,
            delay: duration / 2,
          },
        },
      },
    },
    content: {
      variants: {
        exit: { y: "-10%", opacity: 0, transition, scale: 0.9 },
        initial: { y: "-10%", opacity: 0, transition, scale: 0.9 },
        animate: {
          scale: 1,
          y: 0,
          x: 0,
          opacity: 1,
          transition,
        },
      },
    },
  };
};

function _Modal({
  open,
  id,
  title,
  description,
  children,
  onClose,
  backdropProps,
  style,
  className,
  cssStyles,
  headerActions,
  modalAnimation,
  animationDuration = 0.25,
  autocloseSeconds = undefined,
  ...rest
}: ModalProps) {
  const { useStore } = useHass();
  const modalStore = useModalStore();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const portalRoot = useStore((store) => store.portalRoot);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [ready, setReady] = useState(false);
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const duration = modalStore.animationDuration ?? animationDuration;
  const customAnimation = modalStore.modalAnimation ?? modalAnimation;
  const hasCustomAnimation = customAnimation !== undefined;
  const animation = customAnimation ?? LAYOUT_MODAL_ANIMATION;
  const autocloseRef = useRef<NodeJS.Timeout | null>(null);

  const doClose = useCallback(() => {
    if (autocloseRef.current) {
      clearTimeout(autocloseRef.current);
    }
    if (onClose && open) {
      onClose();
    }
  }, [open, onClose]);

  useEffect(() => {
    const removeCurrent = () => {
      if (autocloseRef.current) {
        clearTimeout(autocloseRef.current);
      }
    };
    removeCurrent();
    if (autocloseSeconds && open) {
      autocloseRef.current = setTimeout(doClose, autocloseSeconds * 1000);
      return removeCurrent;
    }
  }, [open, autocloseSeconds, doClose]);

  useEffect(() => {
    if (isPressed) {
      doClose();
    }
  }, [isPressed, doClose, open]);

  const delayUpdate = useCallback(() => {
    // this will delay the rendering of the children until the animation
    // is complete
    if (!open) return;
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      setReady(true);
      timerRef.current = null;
    }, duration);
  }, [duration, open]);

  const { modal = {}, content = {}, header = {} } = animation(duration, id);

  return createPortal(
    <AnimatePresence
      initial={false}
      mode="wait"
      onExitComplete={() => {
        setReady(false);
      }}
    >
      {open && (
        <Fragment key={`${id}-fragment`}>
          <ModalBackdrop
            key={`${id}-backdrop`}
            className="modal-backdrop"
            id={`${id}-backdrop`}
            initial={{
              opacity: 0,
            }}
            transition={{
              duration,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              // stops double tapping the backdrop whilst animating
              if (open && ready) {
                onClose();
              }
            }}
            {...backdropProps}
          />
          <ModalContainer
            {...rest}
            style={{
              borderRadius: "16px",
              ...style,
            }}
            css={css`
              ${globalComponentStyle.modal ?? ""}
              ${cssStyles ?? ""}
            `}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={() => {
              delayUpdate();
            }}
            {...modal}
            key={`${id}-container`}
            className={`modal-container ${className ?? ""}`}
          >
            <ModalHeader className={`modal-header`} initial="initial" animate="animate" exit="exit" {...header}>
              <Column
                alignItems="flex-start"
                className={`modal-column`}
                style={{
                  flexShrink: 1,
                  maxWidth: "70%",
                }}
              >
                {title && <Title className={`modal-title`}>{title}</Title>}
                {description && <Description className={`modal-description`}>{description}</Description>}
              </Column>
              <Row
                gap="0.5rem"
                wrap="nowrap"
                style={{
                  flexShrink: 0,
                }}
              >
                {headerActions && headerActions()}
                <FabCard
                  onClick={() => {
                    doClose();
                  }}
                  className={`modal-close-button`}
                  tooltipPlacement="left"
                  title={localize("close")}
                  icon="mdi:close"
                  disableRipples
                  disableScale
                />
              </Row>
            </ModalHeader>
            <ModalOverflow className={`modal-overflow`}>
              <ModalInner
                initial="initial"
                animate={ready || hasCustomAnimation ? "animate" : "initial"}
                exit="exit"
                {...content}
                className={"modal-inner"}
              >
                <AnimatePresence initial={false} mode="wait">
                  {(ready || hasCustomAnimation) && children}
                </AnimatePresence>
              </ModalInner>
            </ModalOverflow>
          </ModalContainer>
        </Fragment>
      )}
    </AnimatePresence>,
    portalRoot ?? document.body,
  );
}
/** The modal component was built to easily generate a popup dialog from any element by passing through an "open" value, if you pass an id value, and the same id value is used on another motion element from framer-motion the Modal will animate from this element, see the examples below. */
export const Modal = memo(function Modal(props: ModalProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Modal" })}>
      <_Modal {...props} />
    </ErrorBoundary>
  );
});
