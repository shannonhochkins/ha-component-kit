import { useTemplate, HassConnect } from "@hakit/core";
import { templateCodeToProcess } from "./constants";

function RenderCustomTemplate() {
  const template = useTemplate({
    enabled: false,
    template: templateCodeToProcess,
    variables: { entity_id: "light.fake_light_1" },
  });

  return <>Template result: {template ?? "not-enabled"}</>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <RenderCustomTemplate />
    </HassConnect>
  );
}
