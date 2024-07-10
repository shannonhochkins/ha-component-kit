import { useMemo, useState, useEffect } from "react";
import styled from "@emotion/styled";
import type { HassEntityWithService, HvacMode } from "@hakit/core";
import type { ClimateControlsProps, AvailableQueries } from "@components";
import { useEntity, OFF, isUnavailableState, useHass, localize } from "@hakit/core";
import { fallback, Row, ButtonBar, Column } from "@components";
import { capitalize } from "lodash";
import { icons, activeColors, colors } from "../../Shared/Entity/Climate/ClimateControls/shared";
import { ErrorBoundary } from "react-error-boundary";
import type { HassConfig } from "home-assistant-js-websocket";
import { LocaleKeys } from "@hooks";
import { FeatureEntity, type FeatureEntityProps } from "../CardBase/FeatureEntity";

import { ButtonCard, type ButtonCardProps } from "../ButtonCard";

const StyledClimateCard = styled(ButtonCard)`
  &.slim {
    &.has-temp-controls {
    }
  }
  &.slim-vertical {
    &.has-temp-controls {
    }
  }
`;

const Gap = styled.div`
  height: 20px;
`;

const Description = styled.div`
  color: var(--ha-S400-contrast);
  font-size: 0.7rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  > * {
    position: relative;
    display: flex;
    flex-shrink: 0;
    &:after {
      content: ",";
      position: absolute;
      bottom: 0;
      right: -3px;
    }
    &:last-of-type {
      &:after {
        display: none;
      }
    }
  }
`;

const Temperature = styled.span`
  position: relative;
  display: flex;
  span {
    font-size: 0.7rem;
    align-items: flex-start;
  }
`;

type OmitProperties = "onClick" | "children" | "active" | "as" | "ref" | "disableActiveState" | "features";

type Extendable = Omit<ClimateControlsProps, "onClick"> & Omit<ButtonCardProps<ClimateControlsProps["entity"]>, OmitProperties>;
export interface ClimateCardProps extends Extendable {
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithService<"climate">) => void;
  /** show the labels in the button bar for the hvac modes @default false */
  showHvacModeLabels?: boolean;
  /** show the temperature controls within the main card, does not change the popup @default false */
  showTemperatureControls?: boolean;
}

function _ClimateCard({
  entity: _entity,
  onClick,
  hvacModes,
  hvacModeLabels,
  showHvacModeLabels = false,
  hideCurrentTemperature,
  showTemperatureControls = false,
  hideToggle = true,
  hideHvacModes,
  disabled,
  className,
  modalProps,
  service,
  serviceData,
  cssStyles,
  layoutType,
  key,
  title,
  ...rest
}: ClimateCardProps): React.ReactNode {
  const { getConfig, useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const entity = useEntity(_entity);
  const [config, setConfig] = useState<HassConfig | null>(null);
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const isUnavailable = isUnavailableState(entity.state);
  const on = entity.state !== "off" && !isUnavailable && !disabled;
  const {
    current_temperature,
    hvac_action,
    hvac_modes,
    min_temp = 6,
    max_temp = 40,
    unit_of_measurement,
    temperature = 20,
  } = entity.attributes || {};
  const isOff = entity.state === OFF;
  const titleValue = useMemo(() => {
    if (isUnavailable) {
      return localize("unavailable");
    }
    if (isOff) {
      return localize("off");
    }
    return hvac_action ? localize(hvac_action) : localize("unknown");
  }, [hvac_action, isUnavailable, isOff]);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [getConfig]);

  const havacModesToUse = (hvacModes ?? []).length === 0 ? hvac_modes : hvacModes ?? [];

  return (
    <>
      <StyledClimateCard
        key={key}
        hideToggle={hideToggle}
        disableActiveState
        className={`climate-card ${showTemperatureControls ? "has-temp-controls" : ""} ${className ?? ""}`}
        disabled={disabled || isUnavailable}
        entity={_entity}
        title={title ?? entity.attributes.friendly_name}
        // @ts-expect-error - don't know the entity name, so we can't know the service type
        service={service}
        // @ts-expect-error - don't know the entity name, so we can't know the service data
        serviceData={serviceData}
        layoutType={layoutType}
        modalProps={{
          hvacModes: havacModesToUse,
          hideCurrentTemperature,
          hideHvacModes,
          hvacModeLabels,
          ...modalProps,
        }}
        onClick={() => {
          if (isUnavailable || disabled || typeof onClick !== "function") return;
          onClick(entity);
        }}
        cssStyles={`
          ${globalComponentStyle.climateCard ?? ""}
          ${cssStyles ?? ""}
        `}
        hideState
        features={havacModesToUse
          .concat()
          .filter((x) => !!x)
          .map((mode) => {
            const props = {
              size: 35,
              disabled: disabled || isUnavailable,
              iconProps: {
                color: currentMode === mode ? activeColors[mode] : undefined,
              },
              rippleProps: {
                preventPropagation: true,
              },
              title: capitalize(mode.replace(/_/g, " ")),
              active: currentMode === mode,
              icon: icons[mode],
              onClick: () => {
                entity.service.setHvacMode({
                  hvac_mode: mode,
                });
              },
            } satisfies FeatureEntityProps;
            if (hvacModeLabels?.[mode] && showHvacModeLabels) {
              const customLabel = hvacModeLabels?.[mode];
              return (
                <FeatureEntity key={mode} {...props} title={customLabel}>
                  {customLabel}
                </FeatureEntity>
              );
            }
            return <FeatureEntity key={mode} {...props} />;
          })}
        fabProps={{
          style: {
            color: on ? "var(--ha-A400)" : "var(--ha-S500-contrast)",
            backgroundColor:
              isUnavailable || disabled
                ? colors["off"][1]
                : currentMode === "unknown-mode"
                  ? "var(--ha-S500-contrast)"
                  : colors[currentMode as HvacMode][1],
          },
        }}
        description={
          <Row justifyContent="flex-start">
            <Description className="climate-description">
              <span>{titleValue}</span>
              <span className="fan-speed">
                {localize("speed")}: {localize(entity.attributes.fan_mode as LocaleKeys) || localize("unknown")}
              </span>
              {!hideCurrentTemperature && (
                <span className="current-temperature">
                  <Temperature>
                    <div>
                      {capitalize(
                        localize("name_current_temperature", {
                          search: "{name} ",
                          replace: "",
                        }),
                      )}
                      : {current_temperature}
                    </div>
                    <span>{unit_of_measurement ?? config?.unit_system.temperature}</span>
                  </Temperature>
                </span>
              )}
            </Description>
          </Row>
        }
        {...rest}
      >
        {showTemperatureControls && (
          <Column alignItems={layoutType === "slim-vertical" ? "center" : "flex-start"} fullWidth fullHeight>
            <Gap />
            <ButtonBar fullWidth>
              <FeatureEntity
                size={40}
                disabled={disabled || isUnavailable || temperature === min_temp}
                rippleProps={{
                  preventPropagation: true,
                }}
                title={localize("decrease_temperature")}
                icon={"mdi:minus"}
                onClick={() => {
                  entity.service.setTemperature({
                    temperature: temperature - 1,
                  });
                }}
              />
              <FeatureEntity
                size={40}
                disabled
                rippleProps={{
                  preventPropagation: true,
                }}
                borderRadius={0}
                noIcon
                title={capitalize(
                  localize("name_current_temperature", {
                    search: "{name} ",
                    replace: "",
                  }),
                )}
                cssStyles={`
                  button {
                    cursor: default;
                  }
                `}
              >
                <Temperature>
                  <div>{temperature}</div>
                  <span>{unit_of_measurement ?? config?.unit_system.temperature}</span>
                </Temperature>
              </FeatureEntity>
              <FeatureEntity
                size={40}
                disabled={disabled || isUnavailable || temperature === max_temp}
                rippleProps={{
                  preventPropagation: true,
                }}
                title={localize("increase_temperature")}
                icon={"mdi:plus"}
                onClick={() => {
                  entity.service.setTemperature({
                    temperature: temperature + 1,
                  });
                }}
              />
            </ButtonBar>
          </Column>
        )}
      </StyledClimateCard>
    </>
  );
}
/** The ClimateCard is a card to easily interact with climate entities, whilst it's not documented below, the types are correct and you can also pass through anything related to ModalClimateControlsProps
 * The ClimateCard shares the same functionality/props as the ButtonCard so you can display in different layouts and also utilize the same props
 */
export function ClimateCard(props: ClimateCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "ClimateCard" })}>
      <_ClimateCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
