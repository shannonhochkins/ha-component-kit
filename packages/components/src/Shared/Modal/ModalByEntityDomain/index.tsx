import { computeDomain } from "@utils/computeDomain";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useHass, type EntityRegistryEntry, type EntityName, type FilterByDomain } from "@hakit/core";
import type { ModalProps } from "..";
import {
  Modal,
  EntityAttributes,
  ModalLightControls,
  ModalClimateControls,
  FabCard, 
  type ModalClimateControlsProps,
  type ModalLightControlsProps
} from "@components";
import styled from "@emotion/styled";

const Separator = styled.div`
  height: 30px;
  width: 1px;
  background-color: var(--ha-S400);
`;

interface ModalPropsByDomain {
  light: ModalLightControlsProps;
  climate: ModalClimateControlsProps;
}

type EntityDomainProps<E extends EntityName> =
  E extends `${infer Domain}.${string}`
    ? Domain extends keyof ModalPropsByDomain
      ? ModalPropsByDomain[Domain]
      : {
        entity: EntityName
      }
    : never;

export type ModalByEntityDomainProps<E extends EntityName> = EntityDomainProps<E>;

export function ModalByEntityDomain<E extends EntityName>({
  entity,
  ...rest
}: ModalByEntityDomainProps<E> & Omit<ModalProps, "children">) {
  const { joinHassUrl, useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const [device, setDevice] = useState<EntityRegistryEntry | null>(null);

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
    const {
      open,
      id,
      title,
      description,
      onClose,
      backdropProps,
      ...childProps
    } = rest;
    return [{
      open,
      id,
      title,
      description,
      onClose,
      backdropProps,
    }, childProps];
  }, [rest]);
  const domain = computeDomain(entity);
  const children = useMemo(() => {
    switch (domain) {
      case "light":
        return (
          <ModalLightControls
            entity={entity as FilterByDomain<EntityName, "light">}
            {...childProps}
          />
        );
      case "climate":
        return (
          <ModalClimateControls
            entity={entity as FilterByDomain<EntityName, "climate">}
            {...childProps}
          />
        );
      default:
        return null;
    }
  }, [entity, childProps, domain]);

  return <Modal {...modalProps} headerActions={() => {
    return <>
      <FabCard title="Show History Information" tooltipPlacement="left" icon="mdi:graph-box" size={30} />
      {device && device.device_id && <FabCard title="Open Device" tooltipPlacement="left" icon="mdi:cog" size={30} onClick={openDevice} />}
      <Separator />
    </>
  }}>
    {children}
    <EntityAttributes entity={entity} />
  </Modal>
}
