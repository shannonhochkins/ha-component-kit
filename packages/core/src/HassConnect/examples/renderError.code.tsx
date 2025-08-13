import { HassConnect, useStore } from "@hakit/core";
import { ThemeProvider } from "@hakit/components";
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123" options={{
      renderError: (error) => (
        <div style={{ color: 'red', padding: '1rem', backgroundColor: '#fdd' }}>
          <h2>Error</h2>
          {error}
          <p>Please check your connection or authentication details.</p>
        </div>
      ),
    }}>
      <ThemeProvider />
      <SomeComponent />
    </HassConnect>
  );
}

function SomeComponent() {
  const connection = useStore((state) => state.connection);

  return (
    <div>
      <h1>HassConnect Status</h1>
      <p>Status: {connection ? "Connected" : "Disconnected"}</p>
    </div>
  );
}
