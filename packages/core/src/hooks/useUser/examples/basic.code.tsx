import { HassConnect, useUser } from "@hakit/core";

export function Component() {
  const user = useUser();
  return <div>Howdy, {user?.name}</div>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
