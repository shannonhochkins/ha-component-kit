// important that these are imported first or the mock won't work.
import { TestWrapper, onReady } from "@hass-connect-fake/mocks/mockConnection";
import { PictureCard } from "@components";
import { render, waitFor, fireEvent } from "@testing-library/react";
describe("<PictureCard />", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  // Test to check if the component renders correctly
  it("renders PictureCard", async () => {
    const mockFunction = jest.fn();
    const { getByTestId } = render(
      <PictureCard title="Office" image="FAKE" id="test" icon="mdi:cross" onClick={mockFunction} data-testid="picture-card" />,
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const buttonElement = getByTestId("picture-card");
    fireEvent.click(buttonElement);
    expect(mockFunction).toHaveBeenCalled();
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toMatchSnapshot();
  });
});
