import { useTemplate, HassConnect } from "@hakit/core";
import { templateCodeToProcess } from "./constants";
import { useState } from "react";

function RenderCustomTemplate() {

  const [enabled, setEnabled] = useState(false);
  const template = useTemplate({
    enabled,
    template: templateCodeToProcess,
    variables: { entity_id: "light.fake_light_1" },
  });

  return <>
    Template result: {template ?? "not-enabled"}
    <button onClick={() => setEnabled(!enabled)}>{enabled ? "Disable" : "Enable"}</button>
  </>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <RenderCustomTemplate />
    </HassConnect>
  );
}
