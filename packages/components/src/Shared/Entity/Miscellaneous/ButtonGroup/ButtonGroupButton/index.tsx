import styled from "@emotion/styled";
import { Tooltip, fallback, type TooltipProps, Row, Column } from "@components";
import {
  useIcon,
  ON,
  useEntity,
  type DomainService,
  type ServiceData,
  type ExtractDomain,
  type HassEntityWithService,
  type EntityName,
} from "@hakit/core";
import { ReactNode, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import { IconProps } from "@iconify/react";

const Button = styled(motion.button)<{
  borderRadius?: number;
  activeColor?: string;
}>`
  outline: none;
  cursor: pointer;
  border: 0;
  border-radius: ${(props) => props.borderRadius ?? 0.25}rem;
  background-color: var(--ha-S300);
  color: var(--ha-S500-contrast);
  display: flex;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, color, box-shadow, opacity;
  font-size: calc(var(--ha-control-button-group-thickness) / 4);
  width: 100%;
  height: 100%;
  svg {
    transition: color var(--ha-transition-duration) var(--ha-easing);
  }
  &:not(:disabled):hover {
    background-color: var(--ha-S400);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &.active:not(:disabled) {
    background-color: ${(props) => props.activeColor ?? "var(--ha-A400)"};
    color: var(--ha-900-contrast);
    svg {
      color: var(--ha-900-contrast);
    }
    &:hover {
      background-color: ${(props) => props.activeColor ?? "var(--ha-A700)"};
    }
  }
`;

export interface ButtonGroupButtonProps<E extends EntityName> extends Omit<TooltipProps, "title" | "children" | "onClick"> {
  /** the entity name to render */
  entity?: E;
  /** The service name to call" */
  service?: DomainService<ExtractDomain<E>>;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
  /** an optional override for the title for the tooltip */
  title?: React.ReactNode;
  /** an optional override for the icon */
  icon?: string;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** a callback when the button is clicked, this will receive the entity with the available services if entity was provided */
  onClick?: (entity: HassEntityWithService<ExtractDomain<E>> | null) => void;
  /** optional override to determine if the button should render in an active state */
  active?: boolean;
  /** optional override to the button color when active */
  activeColor?: string;
  /** show the title */
  showTitle?: boolean;
  /** optionally render children within the button */
  children?: ReactNode;
  /** should the button render as disabled */
  disabled?: boolean;
  /** disableScaleEffect while tapping */
  disableScaleEffect?: boolean;
}

function _ButtonGroupButton<E extends EntityName>({
  entity,
  onClick,
  icon,
  iconProps,
  title,
  active,
  service,
  serviceData,
  key,
  showTitle = false,
  activeColor,
  children,
  disabled,
  disableScaleEffect = false,
  style,
  ...rest
}: ButtonGroupButtonProps<E>) {
  const _entity = useEntity(entity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const _icon = useIcon(icon ?? _entity?.attributes?.icon ?? (children ? null : "mdi:help-circle-outline"), iconProps);
  const titleValue = useMemo(() => {
    return title ?? _entity?.attributes?.friendly_name ?? _entity?.entity_id ?? "";
  }, [_entity, title]);
  const _active = useMemo(() => {
    return active ?? _entity?.state === ON;
  }, [_entity, active]);
  return (
    <Tooltip placement="left" title={titleValue} key={key} {...rest}>
      <Button
        className={`button-group-button ${showTitle ? "has-title" : ""} ${_active ? "active" : ""}`}
        activeColor={activeColor}
        disabled={disabled}
        whileTap={{ scale: disabled || disableScaleEffect ? 1 : 0.9 }}
        onClick={() => {
          // @ts-expect-error - this is fine, entity name, service etc aren't known here
          if (onClick) onClick(_entity);
          if (service && _entity) {
            // @ts-expect-error - this is fine, entity name, service etc aren't known here
            _entity.service[service](serviceData ?? {});
          }
        }}
        style={style}
      >
        {showTitle && (
          <Column>
            <Row fullWidth>{_icon}</Row>
            <Row
              fullWidth
              style={{
                fontSize: "1.2rem",
              }}
            >
              {title}
            </Row>
          </Column>
        )}
        {!showTitle && _icon}
        {children && children}
      </Button>
    </Tooltip>
  );
}

/** This component is designed to work with the ButtonGroup as a child component */
export function ButtonGroupButton<E extends EntityName>(props: ButtonGroupButtonProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonGroupButton" })}>
      <_ButtonGroupButton {...props} />
    </ErrorBoundary>
  );
}
