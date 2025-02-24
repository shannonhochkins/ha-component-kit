import { HassConnect } from "@hakit/core";
import { ThemeProvider } from "@hakit/components";
export function App() {
  return (
    <HassConnect
      hassUrl="http://homeassistant.local:8123"
      options={{
        // will now insert things for tooltips, modals etc inside this element
        portalRoot: document.getElementById("root") as HTMLElement,
      }}
    >
      <ThemeProvider />
    </HassConnect>
  );
}
