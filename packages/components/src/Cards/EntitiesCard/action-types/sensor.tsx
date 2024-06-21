import styled from "@emotion/styled";
import { computeStateDisplay, useHass } from "@hakit/core";
import { HassConfig, Connection } from "home-assistant-js-websocket";
import { useCallback } from "react";
import { StateProps } from "./types";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  div {
    text-align: right;
  }
  .value {
    direction: ltr;
  }
`;

export default function SensorState({ entity }: StateProps) {
  const { useStore } = useHass();
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const computeState = useCallback(
    () => computeStateDisplay(entity, connection as Connection, config as HassConfig, entities, entity.state),
    [config, connection, entities, entity],
  );
  return (
    <Wrapper>
      <div className="text-content value">{computeState()}</div>
    </Wrapper>
  );
}
