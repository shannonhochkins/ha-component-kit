// important that these are imported first or the mock won't work.
import { TestWrapper, onReady, mocked, connection } from "@hass-connect-fake/mocks/mockConnection";
import { FabCard } from "./";
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
  const actions = ["turnOn", "toggle", "turnOff"] as const;

  entities.forEach((entity) => {
    actions.forEach((action) => {
      it(`renders correctly with entity ${entity} and action ${action}`, async () => {
        const { getByTestId } = render(<FabCard entity={entity} service={action} data-testid="fab-card" />, {
          wrapper: TestWrapper,
        });
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("fab-card");
        expect(buttonElement).toBeInTheDocument();
      });

      it(`triggers service ${action} when clicked with entity ${entity}`, async () => {
        const mockFunction = jest.fn();
        const { getByTestId } = render(<FabCard entity={entity} service={action} onClick={mockFunction} data-testid="fab-card" />, {
          wrapper: TestWrapper,
        });
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("fab-card");
        fireEvent.click(buttonElement);
        expect(mocked.callAction).toHaveBeenLastCalledWith(connection, computeDomain(entity), snakeCase(action), undefined, {
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
