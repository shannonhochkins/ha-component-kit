import styled from "@emotion/styled";
import { useState, useEffect, useMemo, ReactNode, ReactElement, Children, isValidElement, cloneElement } from "react";
import { useWeather, useHass, isUnavailableState, getSupportedForecastTypes } from "@hakit/core";
import type { FilterByDomain, ModernForecastType, EntityName } from "@hakit/core";
import { Icon } from "@iconify/react";
import { capitalize } from "lodash";
import {
  Row,
  Column,
  fallback,
  WeatherCardDetail,
  ButtonBar,
  ButtonBarButton,
  CardBase,
  type CardBaseProps,
  type AvailableQueries,
} from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { useResizeDetector } from "react-resize-detector";
import { getAdditionalWeatherInformation } from "./helpers";
import { motion } from "framer-motion";

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

const Card = styled(CardBase)``;

const Contents = styled.div`
  padding: 1rem;
  gap: 1rem;
  flex-direction: column;
  display: flex;
  width: 100%;
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
  color: var(--ha-A100) !important;
`;

const LocationIcon = styled(Icon)`
  font-size: 1rem;
  color: var(--ha-A400) !important;
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

const Forecast = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const ForecastIcon = styled(Icon)`
  font-size: 1.5rem;
  color: var(--ha-A100) !important;
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

type OmitProperties = "as" | "ref" | "entity";
export interface WeatherCardProps extends Omit<CardBaseProps<"div", FilterByDomain<EntityName, "weather">>, OmitProperties> {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "weather">;
  /** override the icon displayed before the title */
  icon?: string;
  /** override the temperature suffix that's pulled from the entity, will retrieve the temperature_unit from entity by default"  */
  temperatureSuffix?: ReactNode;
  /** include the forecast @default true */
  includeForecast?: boolean;
  /** include the current forecast row, @default true */
  includeCurrent?: boolean;
  /** any related entities/sensors you want to include in the details section @default [] */
  details?: ReactElement<typeof WeatherCardDetail>[];
  /** include time value under day name @default true */
  includeTime?: boolean;
  /** property on the weather entity attributes that returns the "feels like" temperature or "apparent temperature" @default "apparent_temperature" */
  apparentTemperatureAttribute?: string;
  /** the forecast type to display @default "daily" */
  forecastType?: ModernForecastType;
}

const FORECAST_ITEM_PROJECTED_WIDTH = 40;

function _WeatherCard({
  entity,
  title,
  icon: _icon,
  temperatureSuffix,
  includeForecast = true,
  includeCurrent = true,
  includeTime = true,
  details = [],
  apparentTemperatureAttribute = "apparent_temperature",
  className,
  service,
  serviceData,
  forecastType = "daily",
  ...rest
}: WeatherCardProps): JSX.Element {
  const { getConfig } = useHass();
  const { width, ref: widthRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 500,
  });
  const itemsToRender = Math.floor((width ?? 0) / FORECAST_ITEM_PROJECTED_WIDTH);
  const [timeZone, setTimeZone] = useState<string>("UTC");
  const [type, setType] = useState<ModernForecastType>(forecastType);
  const weather = useWeather(entity, {
    type,
  });
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
  }, [getConfig]);

  const supportedForecasts = useMemo(() => getSupportedForecastTypes(weather), [weather]);

  useEffect(() => {
    setType(forecastType);
  }, [forecastType]);

  const weatherDetails = useMemo(() => {
    const { humidity, temperature, wind_speed, wind_speed_unit, temperature_unit } = weather.attributes;
    const additional = getAdditionalWeatherInformation(temperature, temperature_unit, wind_speed, wind_speed_unit, humidity);
    const apparentTemperature = weather.attributes[apparentTemperatureAttribute] as number | null | undefined;
    return {
      apparent_temperature: apparentTemperature ?? null,
      ...weather.attributes,
      ...(additional ?? {}),
    };
  }, [weather.attributes, apparentTemperatureAttribute]);

  const feelsLikeBase = weatherDetails.apparent_temperature ?? weatherDetails.feelsLike;
  const feelsLike = feelsLikeBase === temperature ? null : feelsLikeBase;
  console.log("details", details);
  return (
    <Card
      title={title}
      entity={entity}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      className={`${className ?? ""} weather-card`}
      {...rest}
    >
      <Contents ref={widthRef}>
        {includeCurrent && !isUnavailable && (
          <Row className="row" justifyContent="space-between" fullWidth>
            <Row wrap="nowrap">
              <StyledIcon icon={icon} className="icon" />
              <Column className="column">
                <Title className="title">
                  <LocationIcon className="location-icon icon" icon={_icon || "mdi:location"} />
                  {title || friendly_name}
                </Title>
                <SubTitle className="sub-title">
                  {temperature}
                  {temperatureSuffix || unit}, {capitalize(weather.state)}
                  {feelsLike ? `, Feels like: ${feelsLike}${temperatureSuffix || unit}` : ""}
                </SubTitle>
              </Column>
            </Row>
            {includeForecast && (
              <ButtonBar>
                {supportedForecasts.map((forecastType, index) => {
                  const icon =
                    forecastType === "daily" ? "mdi:view-day" : forecastType === "twice_daily" ? "mdi:hours-12" : "mdi:hourglass";
                  return (
                    <ButtonBarButton
                      key={index}
                      onClick={() => {
                        setType(forecastType);
                      }}
                      icon={icon}
                      noIcon={false}
                      title={forecastType}
                      active={type === forecastType}
                      rippleProps={{
                        preventPropagation: true,
                      }}
                    />
                  );
                })}
              </ButtonBar>
            )}
          </Row>
        )}
        {details && details.length > 0 && (
          <Row gap="0.5rem" className="row">
            {Children.map(details, (child, index) => {
              if (isValidElement(child)) {
                return cloneElement(child, {
                  key: child.key || index,
                });
              }
              return child;
            })}
          </Row>
        )}
        {includeForecast && !isUnavailable && (
          <Row
            className="row"
            style={{
              justifyContent: "space-between",
            }}
          >
            {(weather.forecast?.forecast ?? []).slice(0, itemsToRender).map((forecast, index) => {
              const dateFormatted = convertDateTime(forecast.datetime, timeZone);
              const [day, , hour] = dateFormatted.split(",");
              return (
                <Forecast key={index} className="forecast" layoutId={forecast.datetime}>
                  <Day className="day">{day}</Day>
                  {includeTime && <Time className="time">{hour}</Time>}
                  <ForecastIcon className="icon forecast-icon" icon={weatherIconName(forecast.condition as string)} />
                  <Temperature className="temperature">
                    {forecast.temperature}
                    {temperatureSuffix || unit}
                  </Temperature>
                  {forecast.templow && (
                    <TemperatureLow className="temperature-low">
                      {forecast.templow}
                      {temperatureSuffix || unit}
                    </TemperatureLow>
                  )}
                </Forecast>
              );
            })}
          </Row>
        )}
        {isUnavailable && weather.state}
      </Contents>
    </Card>
  );
}
/** This will pull information from the weather entity provided to display the forecast provided by home assistant, this card will display exactly what the weather card in lovelace displays.
 *
 * It will render more information depending on the size of the card, the smaller the card, the less "hourly / daily" forecast items will be displayed.
 */
export function WeatherCard(props: WeatherCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "WeatherCard" })}>
      <_WeatherCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
