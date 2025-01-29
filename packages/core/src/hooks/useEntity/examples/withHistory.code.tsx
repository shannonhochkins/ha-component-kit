import { HassConnect, useEntity } from "@hakit/core";

function Office() {
  const lightStrip = useEntity("light.office_striplight", {
    returnNullIfNotFound: true,
    history: {
      disable: false,
      hoursToShow: 96, // defaults to 24
    },
  });
  console.info("light history", lightStrip?.history);
  // can now access all properties relating to the light
  return lightStrip?.state ?? "unknown";
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
