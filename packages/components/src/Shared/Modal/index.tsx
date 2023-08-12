import { useEffect, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { FabCard } from "@components";
import { useKeyPress } from "react-use";

const ModalContainer = styled(motion.div)`
  position: absolute;
  z-index: 1;
  top: 2rem;
  left: 50%;
  display: flex;
  width: var(--ha-modal-width);
  margin-left: calc(var(--ha-modal-width) / -2);
  color: var(--ha-color);
  height: calc(100% - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--ha-primary-background);
  z-index: var(--ha-modal-z-index);
`;
const ModalInner = styled.div`
  padding: 1rem;
  height: 100%;
`;
const Modalheader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const Title = styled.h4`
  all: unset;
  font-size: 1.5rem;
`;

const ModalBackdrop = styled(motion.div)`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--ha-background-opaque);
  cursor: pointer;
  z-index: var(--ha-modal-z-index);
  backdrop-filter: blur(2em) brightness(0.75);
`;

export interface ModalProps {
  /** triggers the modal opening */
  open: boolean;
  /** the id to provide for framer-motion, this should link back to another layoutId property on the element triggering the Modal */
  id: string;
  /** the react layout to include inside the Modal */
  children: React.ReactNode;
  /** The title of the dialog */
  title: string;
  /** triggered when the users pressed the close button, this is also triggered when the escape key is pressed */
  onClose: () => void;
}
/** The modal component was built to easily generate a popup dialog from any element by passing through an "open" value, if you pass an id value, and the same id value is used on another motion element from framer-motion the Modal will animate from this element, see the examples below. */
export function Modal({ open, id, title, children, onClose }: ModalProps) {
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
          />
          <ModalContainer
            style={{
              borderRadius: "1rem",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            layout
            layoutId={id}
            key={`${id}-container`}
          >
            <Modalheader>
              <Title>{title}</Title>
              <FabCard layout icon="mdi:close" onClick={onClose} />
            </Modalheader>
            <ModalInner>{children}</ModalInner>
          </ModalContainer>
        </Fragment>
      )}
    </AnimatePresence>,
    document.body
  );
}
