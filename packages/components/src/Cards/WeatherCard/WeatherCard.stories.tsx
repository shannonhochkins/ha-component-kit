import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, WeatherCard } from "@components";
import type { WeatherCardProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(args?: Partial<WeatherCardProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <WeatherCard {...args} entity="weather.entity" />
    </HassConnect>
  );
}

function WithoutForecast(args?: Partial<WeatherCardProps>) {
  return (
    <div>
      <h2>WeatherCard without the forecast</h2>
      <Template includeForecast={true} {...args} />
    </div>
  );
}

function WithoutCurrent(args?: Partial<WeatherCardProps>) {
  return (
    <div>
      <h2>WeatherCard without the current forecast</h2>
      <Template includeCurrent={true} {...args} />
    </div>
  );
}

export default {
  title: "COMPONENTS/Cards/WeatherCard",
  component: WeatherCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
  argTypes: {
    title: { control: "text" },
    icon: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof WeatherCard>;
export type WeatherStory = StoryObj<typeof WeatherCard>;
export const WeatherExample: WeatherStory = {
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
