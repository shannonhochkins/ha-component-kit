import { Column, FabCard, Row, fallback, mq } from "@components";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { localize, useHass } from "@hakit/core";
import { Fragment, ReactNode, memo, useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useKeyPress } from "react-use";

const ModalContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  display: flex;
  width: var(--ha-modal-width);
  margin-left: calc(var(--ha-modal-width) / -2);
  transform: translateY(-50%);
  color: var(--ha-S50-contrast);
  max-height: calc(100% - 4rem);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--ha-S200);
  z-index: var(--ha-modal-z-index);
  opacity: 0;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  box-shadow: 0px 0px 10px hsla(var(--ha-h), calc(var(--ha-50-s) * 0.8), 3%, 0.6);
  ${mq(
    ["xxs", "xs"],
    `
    max-width: 95vw;
    margin-left: calc(95vw / -2);
  `,
  )}
`;
const ModalInner = styled.div`
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

const ModalBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: hsla(var(--ha-h), calc(var(--ha-s) * 1%), 10%, 0.3);
  z-index: var(--ha-modal-z-index);
  backdrop-filter: blur(2em) brightness(0.75);
  opacity: 0;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
`;

type Extendable = React.ComponentPropsWithoutRef<"div">;
export interface ModalProps extends Omit<Extendable, "title"> {
  /** triggers the modal opening */
  open: boolean;
  /** the react layout to include inside the Modal */
  children: React.ReactNode;
  /** The title of the dialog */
  title?: ReactNode;
  /** the description of the modal */
  description?: ReactNode;
  /** triggered when the users pressed the close button, this is also triggered when the escape key is pressed */
  onClose: () => void;
  /** any prop to pass to the backdrop element */
  backdropProps?: React.ComponentProps<"div">;
  /** react elements to render next to the close button */
  headerActions?: () => ReactNode;
  /** the animation duration modal animation in seconds @default 0.25 */
  animationDuration?: number;
  /** Automatically close the modal after the provided number of seconds */
  autocloseSeconds?: number;
}

function InternalModal({
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
  autocloseSeconds = undefined,
  animationDuration = 0.25,
  ...rest
}: ModalProps) {
  const _id = useId();
  const prefix = id ?? _id;
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const windowContext = useStore((store) => store.windowContext);
  const win = windowContext ?? window;
  const portalRoot = useStore((store) => store.portalRoot);
  const [isPressed] = useKeyPress((event) => event.key === "Escape");
  const autocloseRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = open ? "1" : "0";
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = open ? "1" : "0";
      }
    }, 25);
  }, [open, animationDuration]);

  return createPortal(
    <>
      {open && (
        <Fragment key={`${prefix}-fragment`}>
          <ModalBackdrop
            ref={backdropRef}
            key={`${prefix}-backdrop`}
            className="modal-backdrop"
            id={`${prefix}-backdrop`}
            onClick={() => {
              // stops double tapping the backdrop whilst animating
              if (open) {
                onClose();
              }
            }}
            css={css`
              transition-duration: ${animationDuration}s;
            `}
            {...backdropProps}
          />
          <ModalContainer
            {...rest}
            ref={containerRef}
            style={{
              borderRadius: "16px",
              ...style,
            }}
            css={css`
              ${globalComponentStyle.modal ?? ""}
              ${cssStyles ?? ""}
            transition-duration: ${animationDuration}s;
            `}
            key={`${prefix}-container`}
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
                className={"modal-inner"}
                style={{
                  transformOrigin: "top",
                }}
              >
                {children}
              </ModalInner>
            </ModalOverflow>
          </ModalContainer>
        </Fragment>
      )}
    </>,
    portalRoot ?? win.document.body,
  );
}
/** The modal component was built to easily generate a popup dialog from any element by passing through an "open" value */
export const Modal = memo(function Modal(props: ModalProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Modal" })}>
      <InternalModal {...props} />
    </ErrorBoundary>
  );
});
