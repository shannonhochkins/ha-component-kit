import styled from "@emotion/styled";
import React, { useState, useEffect, useMemo, ReactNode } from "react";
import { useEntity, useHass, isUnavailableState } from "@hakit/core";
import type { FilterByDomain, EntityName, HassEntityWithApi, ExtractDomain } from "@hakit/core";
import { Icon } from "@iconify/react";
import { capitalize } from "lodash";
import { Row, Column, fallback, Tooltip, mq, useDevice } from "@components";
import type { RowProps } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { getAdditionalWeatherInformation } from './helpers'

function weatherIconName(name: string) {
  switch (name) {
    case "clear-night":
      return "mdi:weather-night";
    case "cloudy":
      return "mdi:weather-cloudy";
      break;
    case "fog":
      return "mdi:weather-fog";
      break;
    case "hail":
      return "mdi:weather-hail";
    case "lightning":
      return "mdi:weather-lightning";
    case "lightning-rainy":
      return "mdi:weather-lightning-rainy";
    case "partlycloudy":
      return "mdi:weather-partly-cloudy";
    case "pouring":
      return "mdi:weather-pouring";
    case "rainy":
      return "mdi:weather-rainy";
    case "snowy":
      return "mdi:weather-snowy";
    case "snowy-rainy":
      return "mdi:weather-snowy-rainy";
    case "sunny":
      return "mdi:weather-sunny";
    case "windy":
      return "mdi:weather-windy";
    case "windy-variant":
      return "mdi:weather-windy-variant";
    case "exceptional":
    default:
      return "mdi:alert-circle-outline";
  }
}

const Card = styled(motion.div)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  cursor: default;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);
  gap: 1rem;
  flex-shrink: 1;
  &:hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc((50% - var(--gap, 0rem) / 2) - 2rem);
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3) - 2rem);
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc(((100% - 3 * var(--gap, 0rem)) / 4) - 2rem);
  `,
  )}
`;

const Title = styled.h4`
  all: unset;
  font-size: 0.8rem;
  color: var(--ha-S300-contrast);
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SubTitle = styled.h4`
  all: unset;
  font-size: 1rem;
  color: var(--ha-S500-contrast);
  margin-top: 0.3rem;
  margin-left: 1.1rem;
`;
const StyledIcon = styled(Icon)`
  font-size: 3rem;
  color: var(--ha-A100);
`;

const LocationIcon = styled(Icon)`
  font-size: 1rem;
  color: var(--ha-A400);
  margin-right: 0.2rem;
`;

function convertDateTime(datetime: string, timezone: string) {
  const options = {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  } satisfies Intl.DateTimeFormatOptions;
  return new Intl.DateTimeFormat("en-US", options).format(new Date(datetime));
}

const Forecast = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const ForecastIcon = styled(Icon)`
  font-size: 1.5rem;
  color: var(--ha-A100);
`;

const Day = styled.div`
  color: var(--ha-S50-contrast);
`;
const Time = styled.div`
  color: var(--ha-S200-contrast);
  font-size: 0.8rem;
`;
const Temperature = styled.div`
  color: var(--ha-S50-contrast);
  font-size: 0.8rem;
`;
const TemperatureLow = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.75rem;
`;

const DetailsRow = styled(Row)`
  width: calc(50% - 1rem);
  ${mq(['mobile'], `
    width: 100%;
  `)}
`;

const State = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface DetailsProps extends Omit<RowProps, 'title'> {
  icon?: string;
  entity: EntityName;
  title?: ReactNode;
  suffix?: ReactNode;
  render?: (value: HassEntityWithApi<ExtractDomain<EntityName>>) => ReactNode;
}

function Details({ icon, entity, title, suffix, render, ...rest }: DetailsProps) {
  const _entity = useEntity(entity);
  const _title = title ?? _entity.attributes.friendly_name ?? '';
  return <DetailsRow gap="0rem" justifyContent="flex-start" {...rest}>
    <Tooltip title={_title ?? 'unknown title'}>
      <Row fullWidth gap="0.5rem" justifyContent="flex-start">
        <Icon icon={icon ?? _entity.attributes.icon ?? 'mdi:info'} />
        <State>{typeof render === 'function' ? render(_entity) : `${_title ? `${_title} - ` : ''}${_entity.state ?? ''}${!suffix && _entity.attributes.unit_of_measurement ? `${_entity.attributes.unit_of_measurement}` : suffix ?? ''}`}</State>
      </Row>
    </Tooltip>
  </DetailsRow>
}

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;
export interface WeatherCardProps extends Omit<Extendable, 'title'> {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "weather">;
  /** Override the default title pulled from the entity */
  title?: ReactNode;
  /** override the icon displayed before the title */
  icon?: string;
  /** override the temperature suffix that's pulled from the entity @default "temperature_unit from entity"  */
  temperatureSuffix?: ReactNode;
  /** include the forecast @default true */
  includeForecast?: boolean;
  /** include the current forecast row, @default true */
  includeCurrent?: boolean;
  /** any related entities/sensors you want to include in the details section @default [] */
  details?: DetailsProps[];
  /** include time value under day name @default true */
  includeTime?: boolean;
  /** property on the weather entity attributes that returns the "feels like" temperature or "apparent temperature" @default "apparent_temperature" */
  apparentTemperatureAttribute?: string;
}

function _WeatherCard({
  entity,
  title,
  icon: _icon,
  temperatureSuffix,
  includeForecast = true,
  includeCurrent = true,
  includeTime = true,
  details = [],
  apparentTemperatureAttribute = 'apparent_temperature',
  ...rest
}: WeatherCardProps): JSX.Element {
  const { getConfig } = useHass();
  const device = useDevice();
  const [timeZone, setTimeZone] = useState<string>("UTC");
  const weather = useEntity(entity);
  const isUnavailable = isUnavailableState(weather.state);
  const icon = weatherIconName(weather.state);
  const {
    attributes: { friendly_name, temperature, temperature_unit },
  } = weather;
  const unit = temperature_unit.slice(0, -1);
  useEffect(() => {
    async function getTimeZone() {
      const config = await getConfig();
      if (config) {
        setTimeZone(config.time_zone);
      }
    }
    getTimeZone();
  });

  const weatherDetails = useMemo(() => {
    const { humidity, temperature, wind_speed, wind_speed_unit, temperature_unit } = weather.attributes;
    const additional = getAdditionalWeatherInformation(temperature, temperature_unit, wind_speed, wind_speed_unit, humidity);
    const apparentTemperature = weather.attributes[apparentTemperatureAttribute] as number | null | undefined;
    return {
      apparent_temperature: apparentTemperature ?? null,
      ...weather.attributes,
      ...additional ?? {},
    }
  }, [weather.attributes, apparentTemperatureAttribute]);
  
  const feelsLikeBase = weatherDetails.apparent_temperature ?? weatherDetails.feelsLike;
  const feelsLike = feelsLikeBase === temperature ? null : feelsLikeBase;
  return (
    <Card {...rest}>
      {includeCurrent && !isUnavailable && (
        <Row>
          <StyledIcon icon={icon} />
          <Column>
            <Title>
              <LocationIcon icon={_icon || "mdi:location"} />
              {title || friendly_name}
            </Title>
            <SubTitle>
              {temperature}
              {temperatureSuffix || unit}, {capitalize(weather.state)}{feelsLike ? `, Feels like: ${feelsLike}${temperatureSuffix || unit}` : ''}
            </SubTitle>
          </Column>
        </Row>
      )}
      {(details ?? []).length > 0 && <Row gap="0.5rem">
        {(details ?? []).map((props, index) => <Details key={index} {...props} />)}
      </Row>}
      {includeForecast && !isUnavailable && (
        <Row
          style={{
            justifyContent: "space-between",
          }}
        >
          {(weather.attributes.forecast ?? []).slice(0, device.mobile ? 7 : 10).map((forecast, index) => {
            const dateFormatted = convertDateTime(forecast.datetime, timeZone);
            const [day, , hour] = dateFormatted.split(",");
            return (
              <Forecast key={index}>
                <Day>{day}</Day>
                {includeTime && <Time>{hour}</Time>}
                <ForecastIcon
                  icon={weatherIconName(forecast.condition as string)}
                />
                <Temperature>
                  {forecast.temperature}
                  {temperatureSuffix || unit}
                </Temperature>
                {forecast.templow && <TemperatureLow>
                  {forecast.templow}
                  {temperatureSuffix || unit}
                </TemperatureLow>}
              </Forecast>
            );
          })}
        </Row>
      )}
      {isUnavailable && weather.state}
    </Card>
  );
}
/** This will pull information from the weather entity provided to display the forecast provided by home assistant, this card will display exactly what the weather card in lovelace displays. */
export function WeatherCard(props: WeatherCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "WeatherCard" })}>
      <_WeatherCard {...props} />
    </ErrorBoundary>
  );
}
