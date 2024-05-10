import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Icon } from "@iconify/react";

const ALERT_ICONS = {
  info: "mdi:information-outline",
  warning: "mdi:alert-outline",
  error: "mdi:alert-circle-outline",
  success: "mdi:check-circle-outline",
};

const StyledAlert = styled.div`
  position: relative;
  padding: 8px;
  display: flex;
  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.12;
    pointer-events: none;
    content: "";
    border-radius: 6px;
  }
  .icon {
    z-index: 1;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
  }
  .main-content {
    overflow-wrap: anywhere;
    word-break: break-word;
    margin-left: 8px;
    margin-right: 0;
    margin-inline-start: 8px;
    margin-inline-end: 0;
  }
  .title {
    font-weight: bold;
    font-size: 0.8rem;
    line-height: 1rem;
    color: var(--ha-S50-contrast);
  }
  .description {
    margin-top: 2px;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--ha-S100-contrast);
  }

  &.no-title {
    align-items: center;
    justify-content: center;
    .description {
      margin-top: 0;
    }
    .icon {
      align-self: center;
    }
  }

  &.info > .icon {
    color: var(--ha-alert-info-color);
  }
  &.info::after {
    background-color: var(--ha-alert-info-color);
  }

  &.warning > .icon {
    color: var(--ha-alert-warning-color);
  }
  &.warning::after {
    background-color: var(--ha-alert-warning-color);
  }

  &.error > .icon {
    color: var(--ha-alert-error-color);
  }
  &.error::after {
    background-color: var(--ha-alert-error-color);
  }

  &.success > .icon {
    color: var(--ha-alert-success-color);
  }
  &.success::after {
    background-color: var(--ha-alert-success-color);
  }
`;

export interface AlertProps extends React.ComponentProps<"div"> {
  /** the title of the alert @default "" */
  title?: string;
  /** the description of the alert @default "" */
  description?: string;
  /** the onClick event to fire on click of the alert  */
  onClick?: () => void;
  /** The type of the alert message @default info */
  type?: "info" | "warning" | "error" | "success";
  /** optionally render children in the main content of the alert */
  children?: React.ReactNode;
}
/** A simple Alert component to display messages or warnings if need be, this is currently used internally for error boundaries. */
export function Alert({ title = "", description = "", type = "info", onClick, className, children, cssStyles, ...rest }: AlertProps) {
  return (
    <StyledAlert
      css={css`
        ${cssStyles ?? ""}
      `}
      onClick={onClick}
      className={`alert issue-type ${title ? "" : "no-title"} ${type} ${className ?? ""}`}
      role="alert"
      {...rest}
    >
      <Icon className={`icon`} icon={ALERT_ICONS[type]} />
      <div className="content">
        <div className="main-content">
          {title ? <div className="title">{title}</div> : ""}
          {description ? <div className="description">{description}</div> : ""}
          {children && children}
        </div>
      </div>
    </StyledAlert>
  );
}
