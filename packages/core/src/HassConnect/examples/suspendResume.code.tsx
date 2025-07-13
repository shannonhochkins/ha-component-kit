import { HassConnect } from "@hakit/core";
import { ThemeProvider } from "@hakit/components";
export function App() {
  return (
    <HassConnect
      hassUrl="http://homeassistant.local:8123"
      options={{
        handleResumeOptions: {
          debug: false, // change to true to enable debugging logs
          onStatusChange(status) {
            console.log("Connection Status changed:", status);
          },
          suspendWhenHidden: true, // suspend connection when the tab is hidden/frozen
          hiddenDelayMs: 1000 * 60 * 5, // 5 minutes
        },
      }}
    >
      <ThemeProvider />
    </HassConnect>
  );
}
