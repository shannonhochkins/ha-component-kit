// important that these are imported first or the mock won't work.
import {
  TestWrapper,
  onReady,
  mocked,
  connection,
} from "@mocks/mockConnection";
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
    const { getByTestId } = render(
      <ButtonCard
        entity="light.fake_light"
        service="turnOn"
        data-testid="button-card"
      />,
      {
        wrapper: TestWrapper,
      }
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("button-card");
    expect(buttonElement).toBeInTheDocument();
  });

  // Tests for all valid combinations of entity and service props
  const entities = ["light.fake_light", "switch.fake_gaming_switch"] as const;
  const services = ["turnOn", "toggle", "turnOff"] as const;

  entities.forEach((entity) => {
    services.forEach((service) => {
      it(`renders correctly with entity ${entity} and service ${service}`, async () => {
        const { getByTestId } = render(
          <ButtonCard entity={entity} service={service} data-testid="button-card" />,
          {
            wrapper: TestWrapper,
          }
        );
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("button-card");
        expect(buttonElement).toBeInTheDocument();
      });

      it(`triggers service ${service} when clicked with entity ${entity}`, async () => {
        const mockFunction = jest.fn();
        const { getByTestId } = render(
          <ButtonCard
            entity={entity}
            service={service}
            onClick={mockFunction}
            data-testid="button-card"
          />,
          {
            wrapper: TestWrapper,
          }
        );
        await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
        const buttonElement = getByTestId("button-card");
        fireEvent.click(buttonElement);
        expect(mocked.callService).toHaveBeenLastCalledWith(
          connection,
          computeDomain(entity),
          snakeCase(service),
          undefined,
          {
            entity_id: entity,
          }
        );
        expect(mockFunction).toHaveBeenCalled();
      });
    });
  });


  it("should render without an entity", async () => {
    const { getByTestId } = render(<ButtonCard title="something" description="somethingelse" icon="mdi:cross" data-testid="button-card" />, {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("button-card");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });
});
