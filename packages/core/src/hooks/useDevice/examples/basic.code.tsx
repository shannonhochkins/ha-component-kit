import { useDevice } from "@hakit/core";

export function Component() {
  const device = useDevice('camera.demo_camera');
  return (
    <div>
      <h1>Device Information</h1>
      <p>Name: {device?.name}</p>
      <p>Entity id: {device?.entity_id}</p>
      <p>Id: {device?.id}</p>
      <p>Area: {device?.area_id || "No area assigned"}</p>
    </div>
  );
}