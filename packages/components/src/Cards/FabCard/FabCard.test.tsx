// important that these are imported first or the mock won't work.
import { TestWrapper, onReady, mocked, connection } from "@hass-connect-fake/mocks/mockConnection";
import { FabCard } from "@components";
import { computeDomain } from "@utils/computeDomain";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { snakeCase } from "lodash";
describe("<FabCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders FabCard", async () => {
    const { getByTestId } = render(<FabCard entity="light.fake_light_1" service="turnOn" data-testid="fab-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("fab-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });

  // Tests for all valid combinations of entity and service props
  const entities = ["light.fake_light_1", "switch.fake_switch"] as const;
  const services = ["turnOn", "toggle", "turnOff"] as const;

  entities.forEach((entity) => {
    services.forEach((service) => {
      it(`renders correctly with entity ${entity} and service ${service}`, async () => {
        const { getByTestId } = render(<FabCard entity={entity} service={service} data-testid="fab-card" />, {
          wrapper: TestWrapper,
        });
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("fab-card");
        expect(buttonElement).toBeInTheDocument();
      });

      it(`triggers service ${service} when clicked with entity ${entity}`, async () => {
        const mockFunction = jest.fn();
        const { getByTestId } = render(<FabCard entity={entity} service={service} onClick={mockFunction} data-testid="fab-card" />, {
          wrapper: TestWrapper,
        });
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("fab-card");
        fireEvent.click(buttonElement);
        expect(mocked.callService).toHaveBeenLastCalledWith(connection, computeDomain(entity), snakeCase(service), undefined, {
          entity_id: entity,
        });
        expect(mockFunction).toHaveBeenCalled();
      });
    });
  });

  it("renders FabCard with a size default of 48", async () => {
    const { getByTestId } = render(<FabCard entity="light.fake_light_1" service="turnOn" data-testid="fab-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("fab-card");
    expect(buttonElement.getAttribute("size")).toEqual("48");
  });

  it("should render without an entity", async () => {
    const { getByTestId } = render(<FabCard icon="mdi:cross" data-testid="fab-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("fab-card");
    expect(buttonElement).toBeInTheDocument();
  });
});
