import { useEffect, Fragment, ReactNode } from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useKeyPress } from "react-use";
import { FabCard, fallback, Column, mq } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const ModalContainer = styled(motion.div)`
  position: absolute;
  z-index: 1;
  top: 2rem;
  left: 50%;
  display: flex;
  width: var(--ha-modal-width);
  margin-left: calc(var(--ha-modal-width) / -2);
  color: var(--ha-S50-contrast);
  height: calc(100% - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--ha-S200);
  z-index: var(--ha-modal-z-index);
  ${mq(
    ["tablet", "mobile"],
    `
    max-width: 95vw;
    margin-left: calc(95vw / -2);
  `,
  )}
`;
const ModalInner = styled.div`
  display: flex;
  padding: 0rem 1rem 2rem;
  height: 100%;
  align-items: flex-start;
`;
const ModalOverflow = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Title = styled.h4`
  all: unset;
  font-size: 1.5rem;
`;

const Description = styled.h4`
  all: unset;
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
  background: var(--ha-background-opaque);
  z-index: var(--ha-modal-z-index);
  backdrop-filter: blur(2em) brightness(0.75);
`;

export interface ModalProps extends Omit<HTMLMotionProps<"div">, "title"> {
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
  ...rest
}: ModalProps) {
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  useEffect(() => {
    if (isPressed && onClose && open) {
      onClose();
    }
  }, [isPressed, onClose, open]);
  return createPortal(
    <AnimatePresence>
      {open && (
        <Fragment key={`${id}-fragment`}>
          <ModalBackdrop
            key={`${id}-backdrop`}
            className="modal-backdrop"
            initial={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
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
            style={{
              borderRadius: "1rem",
              boxShadow: "0px 2px 4px var(--ha-S50)",
              ...style,
            }}
            layout
            layoutId={id}
            key={`${id}-container`}
            className={`modal-container ${className}`}
            {...rest}
          >
            <ModalHeader className={`modal-header`}>
              <Column alignItems="flex-start" className={`modal-column`}>
                {title && <Title className={`modal-title`}>{title}</Title>}
                {description && (
                  <Description className={`modal-description`}>
                    {description}
                  </Description>
                )}
              </Column>
              <FabCard
                className={`modal-close-button`}
                tooltipPlacement="left"
                title="Close"
                layout
                icon="mdi:close"
                onClick={onClose}
              />
            </ModalHeader>
            <ModalOverflow className={`modal-overflow`}>
              <ModalInner className={`modal-inner`}>{children}</ModalInner>
            </ModalOverflow>
          </ModalContainer>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body,
  );
}
/** The modal component was built to easily generate a popup dialog from any element by passing through an "open" value, if you pass an id value, and the same id value is used on another motion element from framer-motion the Modal will animate from this element, see the examples below. */
export function Modal(props: ModalProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Modal" })}>
      <_Modal {...props} />
    </ErrorBoundary>
  );
}
