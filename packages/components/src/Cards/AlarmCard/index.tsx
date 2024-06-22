import styled from "@emotion/styled";
import { useMemo, useCallback, type ReactNode } from "react";
import {
  localize,
  useHass,
  type LocaleKeys,
  type AlarmMode,
  type HassEntityWithService,
  UNAVAILABLE,
  type EntityName,
  type FilterByDomain,
  useEntity,
  type AlarmPanelCardConfigState,
} from "@hakit/core";
import type { AlarmControlsProps, AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { fallback } from "../../Shared/ErrorBoundary";
import {
  _getActionLabel,
  _getActionColor,
  ALARM_MODES,
  ALARM_MODE_STATE_MAP,
  filterSupportedAlarmStates,
  DEFAULT_STATES,
} from "../../Shared/Entity/Alarm/AlarmControls/shared";
import { snakeCase } from "lodash";
import { FeatureEntity } from "../CardBase/FeatureEntity";
import { ButtonCard, type ButtonCardProps } from "../ButtonCard";

type OmitProperties = "title" | "entity" | "as";
type Extendable<E extends FilterByDomain<EntityName, "alarm_control_panel">> = Omit<ButtonCardProps<E>, OmitProperties>;
export interface AlarmCardProps<E extends FilterByDomain<EntityName, "alarm_control_panel">> extends Extendable<E> {
  /** the alarm entity to control */
  entity: E;
  /** overwrite the default actions that are displayed, by default it will show what's supported by the entity */
  states?: AlarmControlsProps["states"];
  /** title used in the card for the name of the entity and the modal  */
  title?: ReactNode;
  /** default code for the feature buttons to appear, this does not flow throw to the modal, to use the default code in the modal use modalProps.defaultCode @default undefined */
  defaultCode?: number;
}

type AlarmServices = keyof HassEntityWithService<"alarm_control_panel">["service"];

const Wrapper = styled(ButtonCard)``;

const ALARM_STATE_TO_MODE_MAP: Record<AlarmMode, LocaleKeys> = {
  armed_home: "arm_home",
  armed_away: "arm_away",
  armed_night: "arm_night",
  armed_vacation: "arm_vacation",
  armed_custom_bypass: "custom_bypass",
  disarmed: "disarm",
  triggered: "pending",
  pending: "pending",
  arming: "pending",
};

function _AlarmCard<E extends FilterByDomain<EntityName, "alarm_control_panel">>({
  entity: _entity,
  cssStyles,
  key,
  className,
  title: _title,
  states: _states,
  modalProps,
  layoutType = "slim-vertical",
  defaultCode,
  children,
  icon: _icon,
  ...rest
}: AlarmCardProps<E>) {
  const entity = useEntity<E>(_entity) as HassEntityWithService<"alarm_control_panel">;
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const stateLabel = useCallback((state: AlarmMode | "unavailable") => {
    return state === UNAVAILABLE ? localize("unavailable") : localize(ALARM_STATE_TO_MODE_MAP[state]);
  }, []);
  const title = useMemo(() => _title ?? entity.attributes.friendly_name, [_title, entity.attributes.friendly_name]);
  const stateTitle = stateLabel(entity.state);
  const states = _states || filterSupportedAlarmStates(entity, DEFAULT_STATES);

  const _handleActionClick = (state: AlarmPanelCardConfigState | "disarm"): void => {
    if (!defaultCode) return;
    entity.service[snakeCase(`alarm_${state}`) as AlarmServices]({
      code: defaultCode.toString(),
    });
  };
  const color = _getActionColor(entity.state, modalProps?.customActionColor);
  return (
    <Wrapper
      // @ts-expect-error - this is fine, FabCard is hard coded to type of button because of typescript generic shit
      as="div"
      key={key}
      entity={_entity}
      layoutType={layoutType}
      icon={_icon ?? (entity.state in ALARM_MODES ? ALARM_MODES[entity.state].icon : undefined)}
      // purposely using _title here as we don't want to render the entity title twice
      title={_title}
      hideToggle
      className={`alarm-card ${className ?? ""} ${entity.state}`}
      fabProps={{
        style: {
          backgroundColor: color,
          color: `var(--ha-S500-contrast)`,
          // now set the hover/disabled states
        },
      }}
      cssStyles={`
          .fab-card-inner.icon {
            background-color: ${color};
            color: var(--ha-S500-contrast);
          }
          &:not(.disabled),
          &:not(:disabled) {
            &:not(:focus):hover {
              .fab-card-inner.icon {
                background-color: ${color};
                color: var(--ha-S500-contrast);
              }
            }
          }
          ${globalComponentStyle.alarmCard ?? ""}
          ${cssStyles ?? ""}
        `}
      features={
        !defaultCode
          ? []
          : (entity.state === "disarmed" ? states : (["disarm"] as const)).map((state) => (
              <FeatureEntity
                entity={_entity}
                // @ts-expect-error - dont know why this is complaining.... fix later
                onClick={() => {
                  _handleActionClick(state);
                }}
                icon={state in ALARM_MODE_STATE_MAP ? ALARM_MODES[ALARM_MODE_STATE_MAP[state]].icon : undefined}
              >
                {_getActionLabel(state, modalProps?.labelMap)}
              </FeatureEntity>
            ))
      }
      disableActiveState
      modalProps={{
        title: title,
        stateTitle,
        states,
        ...modalProps,
      }}
      {...rest}
    >
      {children}
    </Wrapper>
  );
}

/**
 The AlarmCard is a wrapper for the ButtonCard which automates the "features" at the bottom of the card when there's a defaultCode added to the entity.
 Long pressing on the card will open the popup which will include a keypad to enter in the security code
 * */
export function AlarmCard<E extends FilterByDomain<EntityName, "alarm_control_panel">>(props: AlarmCardProps<E>) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "AlarmCard" })}>
      <_AlarmCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
