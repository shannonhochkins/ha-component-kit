// important that these are imported first or the mock won't work.
import {
  TestWrapper,
  onReady,
  mocked,
  connection,
} from "@mocks/mockConnection";
import { SceneCard } from "@components";
import { render, waitFor, fireEvent } from "@testing-library/react";
describe("<SceneCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders SceneCard with title from entity", async () => {
    const mockFunction = jest.fn();
    const { getByTestId } = render(
      <SceneCard
        entity="scene.good_morning"
        onClick={mockFunction}
        data-testid="scene-card"
      />,
      {
        wrapper: TestWrapper,
      }
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("scene-card");
    fireEvent.click(buttonElement);
    expect(mockFunction).toHaveBeenCalled();
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });

  it("renders SceneCard with override title", async () => {
    const mockFunction = jest.fn();
    const { getByTestId } = render(
      <SceneCard
        entity="scene.good_morning"
        title="Good morning San Francisco!"
        onClick={mockFunction}
        data-testid="scene-card"
      />,
      {
        wrapper: TestWrapper,
      }
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("scene-card");
    fireEvent.click(buttonElement);
    expect(mockFunction).toHaveBeenCalled();
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
    expect(mocked.callService).toHaveBeenLastCalledWith(
      connection,
      "scene",
      "turn_on",
      undefined,
      {
        entity_id: "scene.good_morning",
      }
    );
    expect(mockFunction).toHaveBeenCalled();
  });
});
