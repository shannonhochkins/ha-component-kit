import { HassConnect, useDishwasher } from "@hakit/core";

export function Dishwasher() {
  const dishwasher = useDishwasher(
    {
      operationState: "sensor.dishwasher_operation_state",
      door: "sensor.dishwasher_door",
      selectedProgram: "select.dishwasher_selected_program",
      activeProgram: "select.dishwasher_active_program",
      progress: "sensor.dishwasher_program_progress",
      finishTime: "sensor.dishwasher_finish_time",
      remoteStart: "binary_sensor.dishwasher_remote_start",
    },
    {
      history: { hoursToShow: 168 },
    },
  );

  if (dishwasher.availability !== "available") return <p>Dishwasher {dishwasher.availability}</p>;
  if (dishwasher.history.error) return <p role="alert">{dishwasher.history.error.message}</p>;
  if (dishwasher.history.loading) return <p>Loading cycle history…</p>;

  return (
    <dl>
      <dt>Operation</dt>
      <dd>{dishwasher.state}</dd>
      <dt>Door</dt>
      <dd>{dishwasher.doorState}</dd>
      <dt>Cycle access</dt>
      <dd>{dishwasher.cycle.unloadStatus}</dd>
      {dishwasher.progressPercent !== null && (
        <>
          <dt>Progress</dt>
          <dd>{dishwasher.progressPercent}%</dd>
        </>
      )}
    </dl>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Dishwasher />
    </HassConnect>
  );
}
