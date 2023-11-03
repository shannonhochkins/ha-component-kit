import styled from "@emotion/styled";
import { Tooltip, fallback, type TooltipProps } from "@components";
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
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Button = styled.button<{
  borderRadius?: number;
}>`
  outline: none;
  cursor: pointer;
  border: 0;
  border-radius: ${(props) => props.borderRadius ?? 0.25}rem;
  background-color: var(--ha-S300);
  color: var(--ha-S500-contrast);
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, color, box-shadow;
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
  &.active {
    background-color: var(--ha-A400);
    color: var(--ha-900-contrast);
    svg {
      color: var(--ha-900-contrast);
    }
    &:hover {
      background-color: var(--ha-A700);
    }
  }
`;

export interface ButtonGroupButtonProps<E extends EntityName> extends Omit<TooltipProps, "title" | "children"> {
  /** the entity name to render */
  entity?: E;
  /** The service name, eg "toggle, turnOn ..." */
  service?: DomainService<ExtractDomain<E>>;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
  /** an optional override for the title for the tooltip */
  title?: React.ReactNode;
  /** an optional override for the icon */
  icon?: string;
  /** a callback when the button is clicked, this will receive the entity with the available services if entity was provided */
  onClick?: (entity: HassEntityWithService<ExtractDomain<E>> | null) => void;
  /** optional override to determine if the button should render in an active state */
  active?: boolean;
}

function _ButtonGroupButton<E extends EntityName>({
  entity,
  onClick,
  icon,
  title,
  active,
  service,
  serviceData,
  ...rest
}: ButtonGroupButtonProps<E>) {
  const _entity = useEntity(entity ?? "unknown", {
    returnNullIfNotFound: true,
  });
  const _icon = useIcon(icon ?? _entity?.attributes?.icon ?? "mdi:help-circle-outline");
  const titleValue = useMemo(() => {
    return title ?? _entity?.attributes?.friendly_name ?? _entity?.entity_id ?? "unknown";
  }, [_entity, title]);
  const _active = useMemo(() => {
    return active ?? _entity?.state === ON;
  }, [_entity, active]);
  return (
    <Tooltip placement="left" title={titleValue} {...rest}>
      <Button
        className={`button-group-button ${_active ? "active" : ""}`}
        onClick={() => {
          // @ts-expect-error - this is fine, entity name, service etc aren't known here
          if (onClick) onClick(_entity);
          if (service && _entity) {
            // @ts-expect-error - this is fine, entity name, service etc aren't known here
            _entity.service[service](serviceData ?? {});
          }
        }}
      >
        {_icon}
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
