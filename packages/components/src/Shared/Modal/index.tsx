import { Column, FabCard, Row, fallback, mq } from "@components";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useHass } from "@hakit/core";
import { AnimatePresence, HTMLMotionProps, MotionProps, motion } from "framer-motion";
import { Fragment, ReactNode, memo, useEffect, useRef, useState } from "react";
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
const ModalHeader = styled.div`
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
}
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
  animationDuration = 1,
  ...rest
}: ModalProps) {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [ready, setReady] = useState(false);
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  useEffect(() => {
    if (isPressed && onClose && open) {
      onClose();
    }
  }, [isPressed, onClose, open]);
  const transition = {
    duration: animationDuration,
    ease: [0.42, 0, 0.58, 1],
  };

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    if (timerRef.current) return;
    timerRef.current = setTimeout(
      () => {
        setReady(true);
        timerRef.current = null;
      },
      (animationDuration * 1000) / 1.8,
    );
  }, [animationDuration, open]);

  const variants = {
    hidden: { y: "-10%", opacity: 0, transition, scale: 0.9 },
    show: {
      scale: 1,
      y: 0,
      x: 0,
      opacity: 1,
      transition,
    },
  };
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
              duration: animationDuration,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            {...backdropProps}
          />
          <ModalContainer
            {...rest}
            style={{
              borderRadius: "1rem",
              ...style,
            }}
            css={css`
              ${globalComponentStyle.modal ?? ""}
              ${cssStyles ?? ""}
            `}
            transition={{
              duration: animationDuration,
              type: "spring",
              damping: 7.5,
              mass: 0.55,
              stiffness: 100,
            }}
            layoutId={id}
            key={`${id}-container`}
            className={`modal-container ${className ?? ""}`}
          >
            <ModalHeader className={`modal-header`}>
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
                    onClose();
                  }}
                  className={`modal-close-button`}
                  tooltipPlacement="left"
                  title="Close"
                  icon="mdi:close"
                  disableRipples
                  disableScale
                />
              </Row>
            </ModalHeader>
            <ModalOverflow className={`modal-overflow`}>
              <ModalInner initial="hidden" animate={ready ? "show" : "hidden"} exit="hidden" variants={variants} className={"modal-inner"}>
                <AnimatePresence initial={false} mode="wait">
                  {ready && children}
                </AnimatePresence>
              </ModalInner>
            </ModalOverflow>
          </ModalContainer>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body,
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
