import styled from "@emotion/styled";
import { useHass } from "@hakit/core";
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
  const formatter = useHass((store) => store.formatter);
  return (
    <Wrapper>
      <div className="text-content value">{formatter.stateValue(entity)}</div>
    </Wrapper>
  );
}
