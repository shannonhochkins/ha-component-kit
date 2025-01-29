import { useHass, HassConnect } from "@hakit/core";

function UseHassExample() {
  const hass = useHass();
  const { useStore, logout, getStates, getServices, getConfig, getUser, callService, getAllEntities, joinHassUrl, callApi } = hass;
  const entities = getAllEntities();
  const light = entities["light.something"];
  console.log(callService, "is the internal function used by the `useService` hook.");
  console.log(callApi, "is the provided function to trigger api requests programmatically to your instance.");
  console.log(getStates, "Retrieve all information about the current state of your entities.");
  console.log(getServices, "Retrieve all available services on your instance.");
  console.log(getUser, "Retrieve the current user.");
  console.log(getConfig, "Retrieve the current configuration.");
  console.log(logout, "Logout the current authenticated instance");
  console.log(joinHassUrl, "Join a provided url with the current authenticated hass instance url.");
  console.log("entities", entities);
  console.log("light", light);
  console.log(useStore, "All information stored in the store is available.");
  // can now access all properties relating to the light
  return light.state;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <UseHassExample />
    </HassConnect>
  );
}
