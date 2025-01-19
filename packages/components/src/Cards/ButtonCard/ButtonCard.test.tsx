// important that these are imported first or the mock won't work.
import { TestWrapper, onReady, mocked, connection } from "@hass-connect-fake/mocks/mockConnection";
import { ButtonCard } from "@components";
import { computeDomain } from "@utils/computeDomain";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { snakeCase } from "lodash";
describe("<ButtonCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders ButtonCard", async () => {
    const { getByTestId } = render(<ButtonCard entity="light.fake_light_1" service="turnOn" data-testid="button-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("button-card");
    expect(buttonElement).toBeInTheDocument();
  });

  // Tests for all valid combinations of entity and service props
  const entities = ["light.fake_light_1", "switch.fake_gaming_switch"] as const;
  const actions = ["turnOn", "toggle", "turnOff"] as const;

  entities.forEach((entity) => {
    actions.forEach((action) => {
      it(`renders correctly with entity ${entity} and action ${action}`, async () => {
        const { getByTestId } = render(<ButtonCard entity={entity} service={action} data-testid="button-card" />, {
          wrapper: TestWrapper,
        });
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("button-card");
        expect(buttonElement).toBeInTheDocument();
      });

      it(`triggers service ${action} when clicked with entity ${entity}`, async () => {
        const mockFunction = jest.fn();
        const { getByTestId } = render(
          <ButtonCard
            entity={entity as "light.fake_light_1"}
            service={action}
            onClick={(entity) => {
              entity.service.turnOff();
              mockFunction();
            }}
            data-testid="button-card"
          />,
          {
            wrapper: TestWrapper,
          },
        );
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("button-card");
        fireEvent.click(buttonElement);
        expect(mocked.callAction).toHaveBeenLastCalledWith(connection, computeDomain(entity), snakeCase(action), undefined, {
          entity_id: entity,
        });
        expect(mockFunction).toHaveBeenCalled();
      });
    });
  });

  it("should render without an entity", async () => {
    const { getByTestId } = render(
      <ButtonCard
        title="something"
        description="somethingelse"
        icon="mdi:cross"
        onClick={() => {
          console.info("entity");
        }}
        data-testid="button-card"
      />,
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("button-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });
});
