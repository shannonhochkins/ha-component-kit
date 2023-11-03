import { useMemo, useState, useEffect } from "react";
import styled from "@emotion/styled";
import type { HassEntityWithService, HvacMode } from "@hakit/core";
import type { ClimateControlsProps, AvailableQueries, CardBaseProps } from "@components";
import { useEntity, useIconByDomain, useIconByEntity, OFF, isUnavailableState, useHass } from "@hakit/core";
import { fallback, Row, CardBase, ButtonBar, Column, ButtonBarButton } from "@components";
import { capitalize } from "lodash";
import { icons, activeColors } from "../../Shared/Entity/Climate/ClimateControls/shared";
import { ErrorBoundary } from "react-error-boundary";
import type { HassConfig } from "home-assistant-js-websocket";

const StyledClimateCard = styled(CardBase)``;

const Gap = styled.div`
  height: 20px;
`;

const Title = styled.div`
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
const Icon = styled.div`
  color: var(--ha-A400);
`;
const Description = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-transform: capitalize;
  color: var(--ha-S50-contrast);
`;

const Temperature = styled.span`
  position: relative;
  display: flex;
  span {
    font-size: 0.7rem;
    align-items: flex-start;
  }
`;

type OmitProperties = "onClick" | "children" | "active" | "as" | "ref" | "disableActiveState";

type Extendable = Omit<ClimateControlsProps, "onClick"> & Omit<CardBaseProps<"div", ClimateControlsProps["entity"]>, OmitProperties>;
export interface ClimateCardProps extends Extendable {
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithService<"climate">) => void;
}

function _ClimateCard({
  entity: _entity,
  title: _title,
  onClick,
  hvacModes,
  hideCurrentTemperature,
  hideFanMode,
  disabled,
  className,
  modalProps,
  service,
  serviceData,
  ...rest
}: ClimateCardProps): JSX.Element {
  const { getConfig } = useHass();
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain("climate");
  const [config, setConfig] = useState<HassConfig | null>(null);
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const title = _title || entity.attributes.friendly_name;
  const {
    current_temperature,
    hvac_action,
    hvac_modes,
    min_temp = 6,
    max_temp = 40,
    unit_of_measurement,
    temperature = 20,
  } = entity.attributes || {};
  const isUnavailable = isUnavailableState(entity.state);
  const isOff = entity.state === OFF;
  const titleValue = useMemo(() => {
    if (isUnavailable) {
      return entity.state;
    }
    if (isOff) {
      return "Off";
    }
    return hvac_action;
  }, [hvac_action, entity.state, isUnavailable, isOff]);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [getConfig]);

  const havacModesToUse = (hvacModes ?? []).length === 0 ? hvac_modes : hvacModes ?? [];

  return (
    <>
      <StyledClimateCard
        disableActiveState
        className={`climate-card ${className ?? ""}`}
        disabled={disabled || isUnavailable}
        entity={_entity}
        title={title}
        // @ts-expect-error - don't know the entity name, so we can't know the service type
        service={service}
        // @ts-expect-error - don't know the entity name, so we can't know the service data
        serviceData={serviceData}
        modalProps={{
          ...modalProps,
          hvacModes: havacModesToUse,
          hideCurrentTemperature,
          hideFanMode,
        }}
        onClick={() => {
          if (isUnavailable || disabled || typeof onClick !== "function") return;
          onClick(entity);
        }}
        {...rest}
      >
        <Column
          alignItems="flex-start"
          fullWidth
          fullHeight
          style={{
            padding: "1rem",
          }}
        >
          <Row justifyContent="space-between" fullWidth>
            <Description>
              <Icon
                style={{
                  color:
                    isUnavailable || disabled
                      ? activeColors["off"]
                      : currentMode === "unknown-mode"
                      ? "var(--ha-S500-contrast)"
                      : activeColors[currentMode as HvacMode],
                }}
              >
                {entityIcon || domainIcon}
              </Icon>{" "}
              {title} - {titleValue}
            </Description>
          </Row>
          <Row justifyContent="flex-start">
            <Title
              style={{
                paddingLeft: "2rem",
              }}
            >
              <span className="fan-speed">Speed: {entity.attributes.fan_mode || "Unknown"}</span>
              <span className="temperature">
                <Temperature>
                  <div>Temperature: {temperature}</div>
                  <span>{unit_of_measurement ?? config?.unit_system.temperature}</span>
                </Temperature>
              </span>
              <span className="current-temperature">
                <Temperature>
                  <div>Current Temperature: {current_temperature}</div>
                  <span>{unit_of_measurement ?? config?.unit_system.temperature}</span>
                </Temperature>
              </span>
            </Title>
          </Row>
          <Row
            justifyContent="flex-start"
            style={{
              paddingLeft: "2rem",
              paddingTop: "0.5rem",
            }}
          >
            <Title>{entity.custom.relativeTime}</Title>
          </Row>
          <Gap />
          <Row fullWidth gap="0.5rem" justifyContent="space-between">
            <ButtonBar>
              <ButtonBarButton
                size={35}
                disabled={disabled || isUnavailable || temperature === min_temp}
                rippleProps={{
                  preventPropagation: true,
                }}
                title={"Decrease Temperature"}
                icon={"mdi:minus"}
                onClick={() => {
                  entity.service.setTemperature({
                    temperature: temperature - 1,
                  });
                }}
              />
              <ButtonBarButton
                size={35}
                disabled={disabled || isUnavailable || temperature === min_temp}
                rippleProps={{
                  preventPropagation: true,
                }}
                borderRadius={0}
                noIcon
                title={"Current Temperature"}
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
              </ButtonBarButton>
              <ButtonBarButton
                size={35}
                disabled={disabled || isUnavailable || temperature === max_temp}
                rippleProps={{
                  preventPropagation: true,
                }}
                title={"Increase Temperature"}
                icon={"mdi:plus"}
                onClick={() => {
                  entity.service.setTemperature({
                    temperature: temperature + 1,
                  });
                }}
              />
            </ButtonBar>
            <ButtonBar>
              {havacModesToUse
                .concat()
                .filter((x) => !!x)
                .map((mode) => (
                  <ButtonBarButton
                    size={35}
                    disabled={disabled || isUnavailable}
                    iconColor={currentMode === mode ? activeColors[mode] : undefined}
                    rippleProps={{
                      preventPropagation: true,
                    }}
                    key={mode}
                    title={capitalize(mode.replace(/_/g, " "))}
                    active={currentMode === mode}
                    icon={icons[mode]}
                    onClick={() => {
                      entity.service.setHvacMode({
                        hvac_mode: mode,
                      });
                    }}
                  />
                ))}
            </ButtonBar>
          </Row>
        </Column>
      </StyledClimateCard>
    </>
  );
}
/** The ClimateCard is a card to easily interact with climate entities, whilst it's not documented below, the types are correct and you can also pass through anything related to ModalClimateControlsProps
 *
 * I will be updating this card as it's not as wildly supported as other cards where it checks for device support, so if you have any issues please let me know.
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
