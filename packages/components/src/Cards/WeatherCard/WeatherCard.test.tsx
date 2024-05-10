// important that these are imported first or the mock won't work.
import { TestWrapper, onReady } from "@hass-connect-fake/mocks/mockConnection";
import { WeatherCard } from "@components";
import { render, waitFor } from "@testing-library/react";

describe("<WeatherCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders WeatherCard with title from entity", async () => {
    const { getByTestId } = render(<WeatherCard entity="weather.entity" data-testid="weather-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("weather-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });

  it("should show without forecast and custom icon", async () => {
    const { getByTestId } = render(
      <WeatherCard entity="weather.entity" icon="mdi:cross" includeForecast={false} data-testid="weather-card" />,
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("weather-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });

  it("should show without current & custom temperature suffix", async () => {
    const { getByTestId } = render(
      <WeatherCard entity="weather.entity" includeCurrent={false} temperatureSuffix={"XXX"} data-testid="weather-card" />,
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("weather-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });
});
