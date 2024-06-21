import styled from "@emotion/styled";
import { EntityName, computeDomain, computeStateDisplay, isUnavailableState, ON, OFF, useHass } from "@hakit/core";
import { HassConfig, Connection } from "home-assistant-js-websocket";
import { useCallback, useState, useEffect, useRef } from "react";
import Switch from "react-switch";
import { StateProps } from "./types";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
`;

const StyledSwitch = styled(Switch)`
  color: var(--ha-100);
  .react-switch-bg {
    background: var(--ha-S100) !important;
  }
  &.checked {
    .react-switch-bg {
      background: var(--ha-A400) !important;
    }
  }
`;

export default function ToggleState({ entity, className, ...rest }: StateProps) {
  const { useStore } = useHass();
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const isUnavailable = isUnavailableState(entity.state);
  const computeState = useCallback(
    () => computeStateDisplay(entity, connection as Connection, config as HassConfig, entities, entity.state),
    [config, connection, entities, entity],
  );

  const showToggle = entity.state === ON || entity.state === OFF || isUnavailable;
  const [isOn, setIsOn] = useState(entity.state === ON);

  const _callService = async (turnOn: boolean): Promise<void> => {
    const stateDomain = computeDomain(entity.entity_id as EntityName);
    let service;

    if (stateDomain === "lock") {
      service = turnOn ? "unlock" : "lock";
    } else if (stateDomain === "cover") {
      service = turnOn ? "open_cover" : "close_cover";
    } else if (stateDomain === "valve") {
      service = turnOn ? "open_valve" : "close_valve";
    } else if (stateDomain === "group") {
      service = turnOn ? "turn_on" : "turn_off";
    } else {
      service = turnOn ? "turn_on" : "turn_off";
    }
    const previousIsOn = isOn;
    setIsOn(turnOn);
    if (timeout.current) clearTimeout(timeout.current);
    // wait 2 seconds, if the state hasn't updated, revert the switch
    timeout.current = setTimeout(() => {
      setIsOn(previousIsOn);
    }, 2000);

    try {
      // @ts-expect-error - this is fine, types are wrong
      await entity.service[service]();
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
    } catch (err) {
      console.error("Error calling service", err);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
      setIsOn(previousIsOn);
    }
  };

  useEffect(() => {
    if (timeout.current || isOn === (entity.state === ON)) return;
    setIsOn(entity.state === ON);
  }, [entity.state, isOn]);

  return (
    <Wrapper className={`action-type-toggle ${className}`} {...rest}>
      {showToggle ? (
        <StyledSwitch
          disabled={isUnavailable}
          checked={isOn}
          className={`${isOn ? "checked" : ""}`}
          // These will not be used, i've only included these so it's clear that they are not used
          onColor="#fff"
          offColor="#fff"
          checkedIcon={false}
          uncheckedIcon={false}
          height={20}
          width={37}
          onChange={() => _callService(isOn ? false : true)}
        />
      ) : (
        <div className="text-content">{computeState()}</div>
      )}
    </Wrapper>
  );
}
