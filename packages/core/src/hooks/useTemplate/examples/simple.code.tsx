import { useTemplate } from "@hakit/core";

export function Component() {
  // use within HassConnect context!
  const template = useTemplate({
    template: '{{ is_state_attr("climate.air_conditioner", "state", "heat") }}',
  });
  return template;
}
