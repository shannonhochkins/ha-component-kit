import { useState } from "react";
import { useEntity } from "@hakit/core";

export function AcknowledgedAction() {
  const light = useEntity("light.some_light_entity");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function toggle() {
    setPending(true);
    setMessage("");
    try {
      await light.service.toggle(); // Promise<void>; no service response requested.
      setMessage("Request acknowledged."); // Actual state still comes from HA.
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <button disabled={pending} onClick={toggle}>
        Toggle light
      </button>
      <p role="status">{message}</p>
    </>
  );
}
