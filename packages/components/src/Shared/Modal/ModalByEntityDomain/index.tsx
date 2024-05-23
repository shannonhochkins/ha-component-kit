import {
  Column,
  EntityAttributes,
  FabCard,
  LogBookRenderer,
  Modal,
  ModalCameraControls,
  ModalClimateControls,
  ModalCoverControls,
  ModalLightControls,
  ModalMediaPlayerControls,
  ModalPersonControls,
  ModalSwitchControls,
  ModalWeatherControls,
  ModalVacuumControls,
  type ModalCameraControlsProps,
  type ModalClimateControlsProps,
  type ModalCoverControlsProps,
  type ModalLightControlsProps,
  type ModalMediaPlayerControlsProps,
  type ModalPersonControlsProps,
  type ModalSwitchControlsProps,
  type ModalWeatherControlsProps,
  type ModalVacuumControlsProps,
} from "@components";
import styled from "@emotion/styled";
import {
  useEntity,
  useHass,
  type AllDomains,
  type EntityName,
  type EntityRegistryEntry,
  type ExtractDomain,
  type FilterByDomain,
} from "@hakit/core";
import { computeDomain } from "@utils/computeDomain";
import { lowerCase, startCase } from "lodash";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ModalProps } from "..";

const Separator = styled.div`
  height: 30px;
  width: 1px;
  background-color: var(--ha-S400);
`;

const State = styled.div`
  font-weight: 400;
  font-size: 36px;
  line-height: 44px;
  user-select: none;
  &:first-letter {
    text-transform: capitalize;
  }
`;

const Updated = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
  padding: 4px 0px;
  margin-bottom: 20px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 2rem;
`;

interface ModalPropsByDomain {
  light: ModalLightControlsProps;
  climate: ModalClimateControlsProps;
  weather: ModalWeatherControlsProps;
  switch: ModalSwitchControlsProps;
  camera: ModalCameraControlsProps;
  cover: ModalCoverControlsProps;
  media_player: ModalMediaPlayerControlsProps;
  person: ModalPersonControlsProps;
  vacuum: ModalVacuumControlsProps;
}

export type ModalPropsHelper<D extends AllDomains> = D extends keyof ModalPropsByDomain
  ? ModalPropsByDomain[D]
  : {
      entity: EntityName;
    };

export type ModalByEntityDomainProps<E extends EntityName> = ModalPropsHelper<ExtractDomain<E>> & {
  hideState?: boolean;
  hideUpdated?: boolean;
  hideAttributes?: boolean;
  hideLogbook?: boolean;
  stateTitle?: string;
};

export function ModalByEntityDomain<E extends EntityName>({
  entity,
  hideState,
  hideUpdated,
  hideAttributes,
  hideLogbook = false,
  children,
  ...rest
}: ModalByEntityDomainProps<E>) {
  const { joinHassUrl, useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const [device, setDevice] = useState<EntityRegistryEntry | null>(null);
  const [showLogbook, setShowLogbook] = useState(false);
  const _entity = useEntity(entity);

  const getDeviceId = useCallback(async () => {
    if (!connection) return;
    try {
      if (device && device.entity_id === entity) return;
      const response = await connection.sendMessagePromise<EntityRegistryEntry>({
        type: "config/entity_registry/get",
        entity_id: entity,
      });
      setDevice(response);
    } catch (e) {
      // ignore, just won't show the link to HA
    }
  }, [entity, device, connection]);

  useEffect(() => {
    if (!rest.open) return;
    getDeviceId();
  }, [getDeviceId, rest.open]);

  const openDevice = useCallback(() => {
    if (typeof window === "undefined") return;
    // if we have a device value, open it up in a new tab and join the url with joinHassUrl
    if (device && device.device_id) {
      window.open(joinHassUrl(`config/devices/device/${device.device_id}`), "_blank");
    }
  }, [device, joinHassUrl]);

  const [modalProps, childProps] = useMemo(() => {
    const { open, id, title, description, onClose, backdropProps, stateTitle, ...childProps } = rest;
    return [
      {
        open,
        id,
        title,
        description,
        onClose,
        backdropProps,
        stateTitle,
      },
      childProps,
    ];
  }, [rest]);
  const domain = computeDomain(entity);

  const onStateChange = useCallback((value: string) => {
    if (!stateRef.current) return;
    stateRef.current.innerText = value;
  }, []);
  const defaultChildren = useMemo(() => {
    switch (domain) {
      case "light":
        return <ModalLightControls entity={entity as FilterByDomain<EntityName, "light">} onStateChange={onStateChange} {...childProps} />;
      case "climate":
        return (
          <ModalClimateControls entity={entity as FilterByDomain<EntityName, "climate">} onStateChange={onStateChange} {...childProps} />
        );
      case "switch":
      case "script":
      case "automation":
        return (
          <ModalSwitchControls entity={entity as FilterByDomain<EntityName, "switch">} onStateChange={onStateChange} {...childProps} />
        );
      case "camera":
        return (
          <ModalCameraControls entity={entity as FilterByDomain<EntityName, "camera">} onStateChange={onStateChange} {...childProps} />
        );
      case "cover":
        return <ModalCoverControls entity={entity as FilterByDomain<EntityName, "cover">} onStateChange={onStateChange} {...childProps} />;
      case "weather":
        return <ModalWeatherControls entity={entity as FilterByDomain<EntityName, "weather">} {...childProps} />;
      case "person":
        return (
          <Suspense fallback={<div>Loading map...</div>}>
            <ModalPersonControls
              entity={entity as FilterByDomain<EntityName, "person">}
              mapHeight={modalProps.open ? 300 : 0}
              {...childProps}
            />
          </Suspense>
        );
      case "media_player": {
        return (
          // @ts-expect-error - child prop types are correct, it does have groupEntities but ts doesn't think it does, will fix later, parent intellisense is correct
          <ModalMediaPlayerControls
            onStateChange={onStateChange}
            {...{
              ...childProps,
              entity,
            }}
          />
        );
      }
      case "vacuum": {
        return <ModalVacuumControls entity={entity as `vacuum.${string}`} {...childProps} />;
      }

      default:
        return null;
    }
  }, [entity, childProps, onStateChange, domain, modalProps.open]);

  const stateRef = useRef<HTMLDivElement>(null);
  const titleValue = useMemo(() => {
    return modalProps.stateTitle ?? startCase(lowerCase(`${_entity.state}${_entity.attributes.unit_of_measurement ?? ""}`));
  }, [_entity, modalProps.stateTitle]);

  return (
    <Modal
      {...modalProps}
      headerActions={() => {
        return (
          <>
            {!hideLogbook && showLogbook && (
              <FabCard
                title="Show Controls"
                tooltipPlacement="left"
                icon="mdi:arrow-back"
                size={30}
                onClick={() => setShowLogbook(false)}
              />
            )}
            {!hideLogbook && !showLogbook && (
              <FabCard
                title="Show Logbook Information"
                tooltipPlacement="left"
                icon="mdi:graph-box"
                size={30}
                onClick={() => setShowLogbook(true)}
              />
            )}
            {device && device.device_id && (
              <FabCard title="Open Device" tooltipPlacement="left" icon="mdi:cog" size={30} onClick={openDevice} />
            )}
            {(!hideLogbook || (device && device.device_id)) && <Separator />}
          </>
        );
      }}
    >
      {showLogbook ? (
        <>
          <LogBookRenderer entity={entity} />
        </>
      ) : (
        <>
          {(!hideUpdated || !hideState) && (
            <Column fullWidth>
              {!hideState && (
                <State className="state" ref={stateRef}>
                  {titleValue}
                </State>
              )}
              {!hideUpdated && <Updated className="last-updated">{_entity.custom.relativeTime}</Updated>}
            </Column>
          )}
          {children}
          {defaultChildren}
          {!hideAttributes && <EntityAttributes entity={entity} />}
        </>
      )}
    </Modal>
  );
}
