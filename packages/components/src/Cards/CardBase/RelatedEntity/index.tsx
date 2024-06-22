import styled from "@emotion/styled";
import { memo, useCallback, useMemo, type ReactNode, type CSSProperties } from "react";
import {
  type EntityName,
  type ExtractDomain,
  type HassEntityWithService,
  type DomainService,
  type ServiceData,
  isUnavailableState,
  computeDomain,
  useEntity,
  useIconByDomain,
  useIconByEntity,
  useIcon,
} from "@hakit/core";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { type IconProps } from "@iconify/react";

type Position =
  | "left top"
  | "left center"
  | "left bottom"
  | "center top"
  | "center center"
  | "center bottom"
  | "right top"
  | "right center"
  | "right bottom";

export interface RelatedEntityProps<E extends EntityName = EntityName> extends Omit<React.ComponentPropsWithoutRef<"div">, "onClick"> {
  /** The name of the entity */
  entity: E;
  /** The service name to call */
  service?: DomainService<ExtractDomain<E>>;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
  /** overwrite the default for the entity */
  icon?: string;
  /** properties for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** the position of the entity element, @default "top left" */
  position?: Position;
  /** should the element be disabled or not which will block the click events @default false */
  disabled?: boolean;
  /** custom render method for the element, this will replace any default children of this component */
  render?: (entity: HassEntityWithService<ExtractDomain<E>>, icon: ReactNode | null) => ReactNode;
  /** margin for the custom element @default 1rem */
  margin?: CSSProperties["margin"];
  /** padding for the custom element @default 0 */
  padding?: CSSProperties["padding"];
  /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
  onClick?: (entity: HassEntityWithService<ExtractDomain<E>>, event: React.MouseEvent<HTMLElement>) => void;
}

type PartialStyleProps = Pick<RelatedEntityProps<EntityName>, "position" | "padding" | "margin">;

const RelatedEntityEl = styled.div<PartialStyleProps>`
  position: absolute;
  margin: ${(props) => props.margin || "1rem"};
  padding: ${(props) => props.padding || "0"};
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  ${(props) => {
    switch (props.position) {
      case "left top":
        return `top: 0; left: 0;`;
      case "left center":
        return `top: 50%; left: 0; transform: translateY(-50%);`;
      case "left bottom":
        return `bottom: 0; left: 0;`;
      case "center top":
        return `top: 0; left: 50%; transform: translateX(-50%);`;
      case "center center":
        return `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
      case "center bottom":
        return `bottom: 0; left: 50%; transform: translateX(-50%);`;
      case "right top":
        return `top: 0; right: 0;`;
      case "right center":
        return `top: 50%; right: 0; transform: translateY(-50%);`;
      case "right bottom":
        return `bottom: 0; right: 0;`;
      default:
        return `top: 0; right: 0;`;
    }
  }}
`;

function _RelatedEntity<E extends EntityName>({
  entity: _entity,
  icon: _icon,
  iconProps,
  render,
  position,
  onClick,
  disabled,
  service,
  serviceData,
  ...rest
}: RelatedEntityProps<E>) {
  const entity = useEntity(_entity);
  const iconElement = useIcon(_icon ?? null, iconProps);
  const domain = computeDomain(_entity);
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, iconProps);
  const entityIcon = useIconByEntity(_entity || "unknown", iconProps);
  const icon = iconElement ?? entityIcon ?? domainIcon;
  const isUnavailable = useMemo(() => (typeof entity?.state === "string" ? isUnavailableState(entity.state) : false), [entity?.state]);
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
      if (typeof service === "string" && entity && !isUnavailable) {
        // @ts-expect-error - we don't actually know the service at this level
        const caller = entity.service[service];
        caller(serviceData);
      }
      if (typeof onClick === "function") {
        if (entity !== null) {
          // we don't know the types at this level, but they will be correct at the parent level
          onClick(entity as never, event);
        } else {
          onClick(null as never, event);
        }
      }
    },
    [service, disabled, entity, serviceData, onClick, isUnavailable],
  );
  return (
    <RelatedEntityEl position={position} onClick={onClickHandler} {...rest}>
      {render ? render(entity, icon) : <>{icon}</>}
    </RelatedEntityEl>
  );
}

/**
 * This can be used within the `relatedEntities` prop for any card that extends CardBase where you can place icons/elements in predefined positions across the card with full control over style/positions/rendering capabilities, click actions and more.
 * Each individual related entity can have clickable actions, stylable and more.
 * This would be useful to show an icon for an entity to indicate it's battery level or state.
 * */
export const RelatedEntity = memo(function RelatedEntity<E extends EntityName>(props: RelatedEntityProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "RelatedEntity" })}>
      <_RelatedEntity {...props} />
    </ErrorBoundary>
  );
});
