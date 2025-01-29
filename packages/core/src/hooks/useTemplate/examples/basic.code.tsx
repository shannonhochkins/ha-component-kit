import { useTemplate, HassConnect } from "@hakit/core";
import { templateCodeToProcess } from "./constants";

function RenderCustomTemplate() {
  const template = useTemplate({
    template: templateCodeToProcess,
    variables: { entity_id: "light.fake_light_1" },
  });

  return <>Template result: {template ?? "loading"}</>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <RenderCustomTemplate />
    </HassConnect>
  );
}
