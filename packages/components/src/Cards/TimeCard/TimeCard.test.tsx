// important that these are imported first or the mock won't work.
import { TestWrapper, onReady } from "@hass-connect-fake/mocks/mockConnection";
import { TimeCard } from "@components";
import { render, waitFor } from "@testing-library/react";

describe("<TimeCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders TimeCard with title from entity", async () => {
    const { getByTestId } = render(<TimeCard data-testid="time-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("time-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });

  it("should render without the icon", async () => {
    const { getByTestId } = render(<TimeCard data-testid="time-card" hideIcon />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("time-card");
    expect(buttonElement).toMatchSnapshot();
  });

  it("should render with the icon", async () => {
    const { getByTestId } = render(<TimeCard icon="mdi:cross" data-testid="time-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("time-card");
    expect(buttonElement).toMatchSnapshot();
  });

  it("should render without the date", async () => {
    const { getByTestId } = render(<TimeCard data-testid="time-card" hideDate />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("time-card");
    expect(buttonElement).toMatchSnapshot();
  });
});
