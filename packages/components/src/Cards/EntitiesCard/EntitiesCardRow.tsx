import {
  computeStateDisplay,
  useHass,
  useEntity,
  useIconByDomain,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
  ON,
  localize,
} from "@hakit/core";
import type { EntityName, ExtractDomain, AllDomains, HassEntityWithService } from "@hakit/core";
import { Icon, type IconProps } from "@iconify/react";
import { Row, fallback, ModalByEntityDomain, type ModalPropsHelper } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import React, { ReactNode, useId, useMemo, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useLongPress } from "use-long-press";
import styled from "@emotion/styled";
import { Connection, HassConfig } from "home-assistant-js-websocket";

const IconWrapper = styled(Row)`
  width: 100%;
  max-width: 2rem;
`;
const Name = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  color: var(--ha-S50-contrast);
  font-weight: 500;
  span {
    width: 100%;
    font-size: 0.7rem;
    font-weight: 400;
    display: block;
    margin-top: 0.2rem;
    color: var(--ha-S500-contrast);
  }
`;
const State = styled.div`
  max-width: 5rem;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: right;
  white-space: nowrap;
  color: var(--ha-S300-contrast);
`;

const EntityRowInner = styled(motion.div)`
  width: 100%;
  padding: 1rem;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  &:hover {
    background-color: var(--ha-S500);
  }
`;

const LAZY_LOAD_STATE_TYPES = {
  climate: () => import("./action-types/climate"),
  toggle: () => import("./action-types/toggle"),
  sensor: () => import("./action-types/sensor"),
};

const DOMAIN_TO_ELEMENT_TYPE: Partial<Record<AllDomains, keyof typeof LAZY_LOAD_STATE_TYPES>> = {
  water_heater: "climate",
  climate: "climate",
  // _domain_not_found: "simple",
  alert: "toggle",
  automation: "toggle",
  // button: "button",
  // cover: "cover",
  // date: "date",
  // datetime: "datetime",
  // event: "event",
  fan: "toggle",
  // group: "group",
  // humidifier: "humidifier",
  input_boolean: "toggle",
  // input_button: "input-button",
  // input_datetime: "input-datetime",
  // input_number: "input-number",
  // input_select: "input-select",
  // input_text: "input-text",
  light: "toggle",
  // lock: "lock",
  // media_player: "media-player",
  // number: "number",
  remote: "toggle",
  // scene: "scene",
  // script: "script",
  // select: "select",
  sensor: "sensor",
  siren: "toggle",
  switch: "toggle",
  // text: "text",
  // time: "time",
  // timer: "timer",
  // update: "update",
  vacuum: "toggle",
  // valve: "valve",
  // weather: "weather",
};

export interface EntitiesCardRowProps<E extends EntityName> extends Omit<React.ComponentPropsWithoutRef<"div">, "onClick"> {
  /** The name of the entity to render */
  entity: E;
  /** the icon name to use @default entity_icon */
  icon?: string;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** the name of the entity @default friendly_name */
  name?: ReactNode;
  /** the function to call when the row is clicked @default undefined */
  onClick?: (entity: HassEntityWithService<ExtractDomain<E>>) => void;
  /** the function to render the state @default undefined */
  renderState?: (entity: HassEntityWithService<ExtractDomain<E>>) => React.ReactElement;
  /** include last updated time @default false */
  includeLastUpdated?: boolean;
  /** props to pass to the modal for each row */
  modalProps?: Partial<ModalPropsHelper<ExtractDomain<E>>>;
}

function _EntitiesCardRow<E extends EntityName>({
  entity: _entity,
  icon: _icon,
  iconProps,
  name: _name,
  renderState,
  onClick,
  modalProps,
  key,
  includeLastUpdated = false,
}: EntitiesCardRowProps<E>) {
  const _id = useId();
  const [openModal, setOpenModal] = React.useState(false);
  const { useStore } = useHass();
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const entity = useEntity(_entity);
  const domain = computeDomain(_entity);
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain);
  const entityIcon = useIconByEntity(_entity || "unknown");
  const isUnavailable = isUnavailableState(entity?.state);
  const title = useMemo(() => _name ?? entity.attributes.friendly_name ?? entity.attributes.entity_id, [_name, entity]);
  const on = entity?.state === ON;
  const iconColor = on ? entity.custom.hexColor : "var(--ha-S500-contrast)";
  const bind = useLongPress(
    () => {
      if (typeof _entity === "string" && !openModal) {
        setOpenModal(true);
      }
    },
    {
      threshold: 300,
      cancelOnMovement: true,
      cancelOutsideElement: true,
      filterEvents(e) {
        return !("button" in e && e.button === 2);
      },
    },
  );
  const computeState = useCallback(
    () => computeStateDisplay(entity, connection as Connection, config as HassConfig, entities, entity.state),
    [config, connection, entities, entity],
  );
  const lazyKey = DOMAIN_TO_ELEMENT_TYPE[domain];

  const LazyComponent = useMemo(() => {
    if (!lazyKey || !(lazyKey in LAZY_LOAD_STATE_TYPES)) return null;
    return lazy(LAZY_LOAD_STATE_TYPES[lazyKey]);
  }, [lazyKey]);

  return (
    <>
      <EntityRowInner key={key} className={`entities-card-row`} layoutId={_id} {...bind()}>
        <Row className={`row`} wrap="nowrap" gap="1rem" fullWidth onClick={() => onClick && onClick(entity)}>
          <IconWrapper
            className={`icon-wrapper`}
            style={{
              opacity: isUnavailable ? "0.3" : "1",
              color: iconColor,
              filter: (on && entity?.custom.brightness) || "brightness(100%)",
            }}
          >
            {_icon ? <Icon className={`icon`} icon={_icon} {...(iconProps ?? {})} /> : entityIcon ?? domainIcon}
          </IconWrapper>
          <Name className={`name`}>
            {title}
            {includeLastUpdated && <span>{entity.custom.relativeTime}</span>}
          </Name>
          <State className={`state`}>
            {typeof renderState === "function" ? (
              renderState(entity)
            ) : isUnavailable ? (
              localize("unavailable")
            ) : LazyComponent ? (
              <Suspense fallback={<div>Loading...</div>}>{<LazyComponent entity={entity as HassEntityWithService<AllDomains>} />}</Suspense>
            ) : (
              <>{computeState()}</>
            )}
          </State>
        </Row>
      </EntityRowInner>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title ?? localize("unknown")}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={_id}
          {...modalProps}
        />
      )}
    </>
  );
}

/** The EntitiesCardRow component is a child component of the EntitiesCard component. */
export function EntitiesCardRow<E extends EntityName>(props: EntitiesCardRowProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "EntitiesCardRow" })}>
      <_EntitiesCardRow {...props} />
    </ErrorBoundary>
  );
}
