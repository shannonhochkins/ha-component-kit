import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDishwasher, useHass, type DishwasherEntities, type EntityHistoryState } from "@hakit/core";
import { Column, ThemeProvider } from "@hakit/components";
import { HassConnect } from "@hass-connect-fake";
import type { Connection, HassEntity, MessageBase } from "home-assistant-js-websocket";
import source from "./basic.code?raw";

const bindings: DishwasherEntities = {
  operationState: "sensor.dishwasher_operation_state",
  door: "sensor.dishwasher_door",
  selectedProgram: "select.dishwasher_selected_program",
  activeProgram: "select.dishwasher_active_program",
  progress: "sensor.dishwasher_program_progress",
  finishTime: "sensor.dishwasher_finish_time",
  remoteStart: "binary_sensor.dishwasher_remote_start",
};
const scenarios = ["running", "awaiting-door-opening", "door-opened", "missing-history", "history-error", "unavailable"] as const;
type Scenario = (typeof scenarios)[number];

function createFixture(scenario: Scenario) {
  const now = Date.now();
  const timestamp = (minutes: number) => now + minutes * 60000;
  const sample = (s: string, minutes: number): EntityHistoryState => ({ s, lu: timestamp(minutes) / 1000, a: {} });
  const entity = (entity_id: string, state: string, attributes = {}): HassEntity => ({
    entity_id,
    state,
    attributes,
    last_changed: new Date(timestamp(-1)).toISOString(),
    last_updated: new Date(timestamp(-1)).toISOString(),
    context: { id: "dishwasher-docs", parent_id: null, user_id: null },
  });
  const running = scenario === "running";
  const entities = Object.fromEntries(
    [
      entity(bindings.operationState, scenario === "unavailable" ? "unavailable" : running ? "run" : "ready"),
      entity(bindings.door!, "closed"),
      entity(bindings.selectedProgram!, "eco", { options: ["eco", "auto"] }),
      entity(bindings.activeProgram!, running ? "eco" : "unknown", { options: ["eco", "auto"] }),
      entity(bindings.progress!, "62", { unit_of_measurement: "%" }),
      entity(bindings.finishTime!, new Date(timestamp(20)).toISOString()),
      entity(bindings.remoteStart!, "on"),
    ].map((value) => [value.entity_id, value]),
  );
  const histories: Record<string, EntityHistoryState[]> = {
    [bindings.operationState]: [
      sample("ready", -120),
      sample("run", -90),
      ...(running ? [] : [sample("finished", -20), sample("ready", -15)]),
    ],
    [bindings.door!]: [sample("closed", -120), ...(scenario === "door-opened" ? [sample("open", -10), sample("closed", -5)] : [])],
  };
  // Story-only transport. It cannot authenticate or send a real Home Assistant action.
  const connection = {
    connected: true,
    async subscribeMessage<Result>(callback: (result: Result) => void, message: MessageBase) {
      if (scenario === "history-error") throw new Error("Recorder history is unavailable in this example.");
      const ids = message.entity_ids as string[];
      callback({
        states: Object.fromEntries(ids.map((id) => [id, scenario === "missing-history" ? [] : (histories[id] ?? [])])),
      } as Result);
      return async () => {};
    },
    async sendMessagePromise() {
      throw new Error("This read-only demo does not send actions.");
    },
  } as unknown as Connection;
  return { entities, connection };
}

function Result() {
  const dishwasher = useDishwasher(bindings);
  return (
    <Column fullWidth alignItems="flex-start" gap="1rem">
      <p>Mock Home Assistant data. Changing the example never operates a dishwasher.</p>
      {dishwasher.history.error && <p role="alert">{dishwasher.history.error.message}</p>}
      <pre style={{ maxWidth: "100%", overflow: "auto" }} aria-label="Dishwasher hook output">
        {JSON.stringify(
          {
            availability: dishwasher.availability,
            operationState: dishwasher.operationState,
            doorState: dishwasher.doorState,
            progressPercent: dishwasher.progressPercent,
            estimatedFinishAt: dishwasher.estimatedFinishAt,
            programs: dishwasher.programs,
            remoteStartEnabled: dishwasher.remoteStartEnabled,
            cycle: dishwasher.cycle,
            history: { ...dishwasher.history, error: dishwasher.history.error?.message ?? null },
            issues: dishwasher.issues,
          },
          null,
          2,
        )}
      </pre>
    </Column>
  );
}

function Fixture({ scenario }: { scenario: Scenario }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { entities, entitiesRegistry, connection, ready, connectionStatus } = useHass.getState();
    const fixture = createFixture(scenario);
    useHass.setState({
      entities: { ...entities, ...fixture.entities },
      entitiesRegistry: {},
      connection: fixture.connection,
      ready: true,
      connectionStatus: "connected",
    });
    setReady(true);
    return () => {
      useHass.setState({ entities, entitiesRegistry, connection, ready, connectionStatus });
    };
  }, [scenario]);
  return ready ? <Result /> : <p>Loading example…</p>;
}

function Example({ scenario }: { scenario: Scenario }) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Fixture key={scenario} scenario={scenario} />
    </HassConnect>
  );
}
const meta = {
  title: "core/hooks/useDishwasher/Examples",
  component: Example,
  args: { scenario: "awaiting-door-opening" },
  argTypes: { scenario: { control: "select", options: scenarios, description: "Read-only mocked entity and Recorder scenarios." } },
  tags: ["!dev", "!autodocs"],
  parameters: { docs: { canvas: { sourceState: "none" }, source: { code: source, language: "tsx" } } },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const PrimaryExample: Story = {};
