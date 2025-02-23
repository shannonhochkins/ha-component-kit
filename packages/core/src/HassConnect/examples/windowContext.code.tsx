import { HassConnect } from "@hakit/core";
import { ThemeProvider } from "@hakit/components";
export function App() {
  return (
    <HassConnect
      hassUrl="http://homeassistant.local:8123"
      options={{
        windowContext: window, // this could be an iframe window context
      }}
    >
      {/* By default, this will use the body of the window context to insert styles, calculate ripple effects, modal position and more */}
      <ThemeProvider />
    </HassConnect>
  );
}
