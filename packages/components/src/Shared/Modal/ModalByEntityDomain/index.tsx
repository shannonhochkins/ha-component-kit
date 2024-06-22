import {
  Column,
  EntityAttributes,
  FabCard,
  LogBookRenderer,
  Modal,
  type ModalAlarmControlsProps,
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
  useDevice,
  localize,
  type AllDomains,
  type EntityName,
  type ExtractDomain,
  type FilterByDomain,
} from "@hakit/core";
import { Icon } from "@iconify/react";
import { computeDomain } from "@utils/computeDomain";
import { lowerCase, startCase } from "lodash";
import { Suspense, lazy, useCallback, useMemo, useRef, useState, ReactNode } from "react";
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

const StyledIcon = styled(Icon)`
  font-size: 2rem;
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
  alarm_control_panel: ModalAlarmControlsProps;
}

export type ModalPropsHelper<D extends AllDomains> = D extends keyof ModalPropsByDomain
  ? ModalPropsByDomain[D]
  : {
      entity: EntityName;
    };

// remove children from ModalProps, and make it optional
type OptionalChildrenModalProps = Omit<ModalProps, "children"> & {
  children?: React.ReactNode;
};

export type ModalByEntityDomainProps<E extends EntityName> = ModalPropsHelper<ExtractDomain<E>> & {
  hideState?: boolean;
  hideUpdated?: boolean;
  hideAttributes?: boolean;
  hideLogbook?: boolean;
  stateTitle?: ReactNode;
  /** There's currently a few default header actions, this will allow you to place your own actions in a different order @default 'start' */
  headerActionsPosition?: "start" | "middle" | "end";
  /** This will hide the default lazy component thats loaded as the children of the modal if you want to create your own */
  hideDefaultLayout?: boolean;
} & OptionalChildrenModalProps;

function getLazyModal<D extends keyof ModalPropsByDomain>(
  domain: D,
): (() => Promise<{ default: React.ComponentType<ModalPropsByDomain[D]> }>) | null {
  const modals: { [K in keyof ModalPropsByDomain]: () => Promise<{ default: React.ComponentType<ModalPropsByDomain[K]> }> } = {
    cover: () => import("./Cover"),
    alarm_control_panel: () => import("./AlarmControlPanel"),
    camera: () => import("./Camera"),
    light: () => import("./Light"),
    media_player: () => import("./MediaPlayer"),
    person: () => import("./Person"),
    switch: () => import("./Switch"),
    vacuum: () => import("./Vacuum"),
    weather: () => import("./Weather"),
    climate: () => import("./Climate"),
  };
  return modals[domain] ?? null;
}

export function ModalByEntityDomain<E extends EntityName>({
  entity,
  hideState,
  hideUpdated,
  hideAttributes,
  headerActionsPosition = "start",
  headerActions,
  hideLogbook = false,
  hideDefaultLayout = false,
  children,
  ...rest
}: ModalByEntityDomainProps<E>) {
  const { joinHassUrl } = useHass();
  const [showLogbook, setShowLogbook] = useState(false);
  const _entity = useEntity(entity);
  const device = useDevice(entity);

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
  const LazyModalComponent = useMemo(() => {
    const modal = getLazyModal(domain as keyof ModalPropsByDomain);
    if (!modal) return null;
    return lazy(modal);
  }, [domain]);
  const defaultChildren = useMemo(() => {
    if (!LazyModalComponent || hideDefaultLayout) return null;
    const fallback = (
      <Column fullWidth fullHeight>
        <StyledIcon icon="eos-icons:three-dots-loading" className="preloader-loading-icon" />
      </Column>
    );
    if (domain === "person") {
      return (
        <Suspense fallback={fallback}>
          <LazyModalComponent
            entity={entity as FilterByDomain<EntityName, "person">}
            mapHeight={modalProps.open ? 300 : 0}
            {...childProps}
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={fallback}>
        <LazyModalComponent
          // @ts-expect-error types are impossible to fix at this level, cast it as anything
          entity={entity as FilterByDomain<EntityName, "light">}
          onStateChange={onStateChange}
          {...{
            ...childProps,
            entity,
          }}
        />
      </Suspense>
    );
  }, [entity, hideDefaultLayout, LazyModalComponent, childProps, onStateChange, domain, modalProps.open]);

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
                title={localize("device")}
                tooltipPlacement="left"
                icon="mdi:arrow-back"
                size={30}
                onClick={() => setShowLogbook(false)}
              />
            )}
            {headerActionsPosition === "start" && headerActions && headerActions()}
            {!hideLogbook && !showLogbook && (
              <FabCard
                title={localize("logbook")}
                tooltipPlacement="left"
                icon="mdi:graph-box"
                size={30}
                onClick={() => setShowLogbook(true)}
              />
            )}
            {headerActionsPosition === "middle" && headerActions && headerActions()}
            {device && device.device_id && (
              <FabCard title={localize("open_device_settings")} tooltipPlacement="left" icon="mdi:cog" size={30} onClick={openDevice} />
            )}
            {headerActionsPosition === "end" && headerActions && headerActions()}
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
          {children ?? null}
          {defaultChildren}
          {!hideAttributes && <EntityAttributes entity={entity} />}
        </>
      )}
    </Modal>
  );
}
