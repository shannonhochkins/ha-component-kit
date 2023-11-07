import { computeDomain } from "@utils/computeDomain";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  useHass,
  useEntity,
  type EntityRegistryEntry,
  type AllDomains,
  type EntityName,
  type FilterByDomain,
  type ExtractDomain,
} from "@hakit/core";
import type { ModalProps } from "..";
import {
  Modal,
  EntityAttributes,
  ModalLightControls,
  ModalClimateControls,
  ModalSwitchControls,
  ModalCameraControls,
  ModalCoverControls,
  ModalWeatherControls,
  FabCard,
  LogBookRenderer,
  Column,
  type ModalWeatherControlsProps,
  type ModalClimateControlsProps,
  type ModalLightControlsProps,
  type ModalSwitchControlsProps,
  type ModalCameraControlsProps,
  type ModalCoverControlsProps,
} from "@components";
import styled from "@emotion/styled";

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
};

export function ModalByEntityDomain<E extends EntityName>({
  entity,
  hideState,
  hideUpdated,
  hideAttributes,
  ...rest
}: ModalByEntityDomainProps<E> & Omit<ModalProps, "children">) {
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
    // if we have a device value, open it up in a new tab and join the url with joinHassUrl
    if (device && device.device_id) {
      window.open(joinHassUrl(`config/devices/device/${device.device_id}`), "_blank");
    }
  }, [device, joinHassUrl]);

  const [modalProps, childProps] = useMemo(() => {
    const { open, id, title, description, onClose, backdropProps, ...childProps } = rest;
    return [
      {
        open,
        id,
        title,
        description,
        onClose,
        backdropProps,
      },
      childProps,
    ];
  }, [rest]);
  const domain = computeDomain(entity);

  const onStateChange = useCallback((value: string) => {
    if (!stateRef.current) return;
    stateRef.current.innerText = value;
  }, []);
  const children = useMemo(() => {
    switch (domain) {
      case "light":
        return <ModalLightControls entity={entity as FilterByDomain<EntityName, "light">} onStateChange={onStateChange} {...childProps} />;
      case "climate":
        return (
          <ModalClimateControls entity={entity as FilterByDomain<EntityName, "climate">} onStateChange={onStateChange} {...childProps} />
        );
      case "switch":
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
      default:
        return null;
    }
  }, [entity, childProps, onStateChange, domain]);

  const stateRef = useRef<HTMLDivElement>(null);
  const titleValue = useMemo(() => {
    return `${_entity.state}${_entity.attributes.unit_of_measurement ?? ""}`;
  }, [_entity]);

  return (
    <Modal
      {...modalProps}
      headerActions={() => {
        return (
          <>
            {showLogbook && (
              <FabCard
                title="Show Controls"
                tooltipPlacement="left"
                icon="mdi:arrow-back"
                size={30}
                onClick={() => setShowLogbook(false)}
              />
            )}
            {!showLogbook && (
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
            <Separator />
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
          <Column fullWidth>
            {!hideState && (
              <State className="state" ref={stateRef}>
                {titleValue}
              </State>
            )}
            {!hideUpdated && <Updated className="last-updated">{_entity.custom.relativeTime}</Updated>}
          </Column>
          {children}
          {!hideAttributes && <EntityAttributes entity={entity} />}
        </>
      )}
    </Modal>
  );
}
