import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Column, WeatherCard, ThemeControlsModal, WeatherCardDetail } from "@components";
import type { WeatherCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";
import { HassEntityWithService } from "@hakit/core";

function convertUvIndexToText(uvi: number | null): string | null {
  if (!uvi) return null;
  if (uvi >= 0 && uvi <= 2) return "Low";
  if (uvi >= 3 && uvi <= 5) return "Moderate";
  if (uvi >= 6 && uvi <= 7) return "High";
  if (uvi >= 8 && uvi <= 10) return "Very High";
  if (uvi >= 11) return "Extreme";
  return null;
}

function Template(args?: Partial<WeatherCardProps>) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem">
        <WeatherCard
          entity="weather.entity"
          {...args}
          details={[
            <WeatherCardDetail
              key="x"
              entity="sensor.openweathermap_uv_index"
              render={(entity: HassEntityWithService<"sensor">) => {
                return <span>UVI - {convertUvIndexToText(Number(entity.state))}</span>;
              }}
            />,
            <WeatherCardDetail entity="sensor.openweathermap_pressure" key="y" />,
          ]}
        />
        <p>Hourly, with 2 separate rows:</p>
        <WeatherCard entity="weather.entity" forecastRows={2} forecastType="hourly" md={6} lg={6} xlg={6} {...args} />
      </Column>
    </HassConnect>
  );
}

function WithSensors(args?: Partial<WeatherCardProps>) {
  return (
    <div>
      <h2>WeatherCard with additional sensor information and different intervals</h2>
      <Template
        entity="weather.openweathermap"
        details={[
          <WeatherCardDetail
            key="a"
            entity="sensor.openweathermap_uv_index"
            render={(entity: HassEntityWithService<"sensor">) => {
              return <span>UVI - {convertUvIndexToText(Number(entity.state))}</span>;
            }}
          />,
          <WeatherCardDetail entity="sensor.openweathermap_pressure" key="b" />,
          <WeatherCardDetail entity="sensor.openweathermap_humidity" icon="mdi:water-percent" key="c" />,
          <WeatherCardDetail entity="sensor.openweathermap_wind_speed" key="d" />,
        ]}
        {...args}
      />
    </div>
  );
}

function WithoutForecast(args?: Partial<WeatherCardProps>) {
  return (
    <div>
      <h2>WeatherCard without the forecast</h2>
      <Template includeForecast={false} {...args} />
    </div>
  );
}

function WithoutCurrent(args?: Partial<WeatherCardProps>) {
  return (
    <div>
      <h2>WeatherCard without the current forecast</h2>
      <Template includeCurrent={false} {...args} />
    </div>
  );
}

export default {
  title: "components/Cards/WeatherCard",
  component: WeatherCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
    fillWidth: true,
  },
  argTypes: {
    title: { control: "text" },
    icon: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof WeatherCard>;
export type WeatherStory = StoryObj<typeof WeatherCard>;
export const Docs: WeatherStory = {
  render: Template,
  args: {},
};

export const WithoutForecastExample: WeatherStory = {
  render: WithoutForecast,
  args: {},
};

export const WithoutCurrentExample: WeatherStory = {
  render: WithoutCurrent,
  args: {},
};
export const WithSensorsExamples: WeatherStory = {
  render: WithSensors,
  args: {},
};
