import { useHass } from "@hakit/core";

// Demonstrates accessing callService via selector and snapshot.
export function CallServiceDefinitionExample() {
  // Subscription (selector) usage – only re-renders if helpers object reference changes (rare):
  const { callService } = useHass((s) => s.helpers);
  callService({ domain: "climate", service: "turn_on", target: { entity_id: "climate.air_conditioner" } });

  // Snapshot (programmatic) variant – preferred for one-off fire & forget outside render logic.
  const { helpers } = useHass.getState();
  helpers.callService({ domain: "light", service: "toggle", target: "light.lamp" });
  return null;
}

// Generic signature (reference only):
// callService<ResponseType, Domain extends string, Service extends string>({ ... })
