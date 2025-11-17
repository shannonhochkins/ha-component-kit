import { HassConnect, useHass } from "@hakit/core";
import { ThemeProvider } from "@hakit/components";
export function App() {
  return (
    <HassConnect
      hassUrl="http://homeassistant.local:8123"
      options={{
        locale: "en", // Specify the desired locale
      }}
    >
      <ThemeProvider />
      <SomeComponent />
    </HassConnect>
  );
}

function SomeComponent() {
  const connection = useHass((state) => state.connection);

  return (
    <div>
      <h1>HassConnect Status</h1>
      <p>Status: {connection ? "Connected" : "Disconnected"}</p>
    </div>
  );
}
