import { useCallback } from "react";
import styled from "@emotion/styled";
import type { HassEntity } from "home-assistant-js-websocket";
import type { DomainService, ServiceData } from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  useApi,
} from "@hakit/core";
import { Ripples } from "@components";

const StyledSceneCard = styled.button`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-scene-card-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);
  &:hover,
  &:focus,
  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleMessage = styled.span`
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 6px 0 8px;
`;

const ToggleState = styled.div`
  background-color: white;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 5px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ToggleProps {
  active: boolean;
}
const Gap = styled.div`
  height: 20px;
`;
const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) =>
    props.active ? "var(--ha-primary-active)" : "var(--ha-secondary-inactive)"};
  border-radius: 30px;
  width: 120px;
  height: 40px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 20px;
  overflow: hidden;
  ${ToggleState} {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: left, transform;
    left: ${(props) => (props.active ? "100%" : "0")};
    transform: ${(props) =>
      props.active
        ? "translate3d(calc(-100% - 5px), 0, 0)"
        : "translate3d(calc(0% + 5px), 0, 0)"};
    svg {
      color: ${(props) =>
        props.active
          ? "var(--ha-primary-active)"
          : "var(--ha-primary-inactive)"};
      font-size: 40px;
    }
  }
  ${ToggleMessage} {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: justify-content, color;
    justify-content: ${(props) => (props.active ? `flex-start` : `flex-end`)};
    color: ${(props) =>
      !props.active
        ? "var(--ha-secondary-color)"
        : "var(--ha-primary-inactive)"};
  }
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
`;
const Description = styled.div`
  color: var(--ha-primary-active);
  font-size: 0.9rem;
`;
export interface SceneCardProps
  extends Omit<React.ComponentProps<"button">, "title" | "onClick"> {
  /** An optional override for the title */
  title?: string;
  /** The name of your scene entity */
  entity: `scene.${string}`;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (scene: HassEntity) => void;
  /** The data to pass to the scene service */
  serviceData?: ServiceData<"scene", DomainService<"scene">>;
}

/** The SceneCard is a simple to use component to make it easy to trigger and a scene. */
export function SceneCard({
  entity,
  title,
  onClick,
  serviceData,
  ...rest
}: SceneCardProps): JSX.Element {
  const sceneService = useApi("scene");
  const scene = useEntity(entity);
  const entityIcon = useIconByEntity(entity);
  const domainIcon = useIconByDomain("scene");
  const powerIcon = useIcon("mdi:power");
  const arrowIcon = useIcon("mingcute:arrows-right-line", {
    style: {
      fontSize: "16px",
    },
  });
  console.log("scene", scene);
  const useApiHandler = useCallback(() => {
    // @ts-expect-error we can expect it to throw errors however the parent level ts validation will catch invalid params.
    sceneService.turnOn(entity, serviceData);
    if (typeof onClick === "function") onClick(scene);
  }, [sceneService, entity, onClick, scene, serviceData]);

  return (
    <Ripples borderRadius="1rem">
      <StyledSceneCard {...rest} onClick={useApiHandler}>
        <LayoutBetween>
          <Description>
            {title || scene.attributes.friendly_name || entity}
          </Description>
          {entityIcon || domainIcon}
        </LayoutBetween>
        <Gap />
        <LayoutBetween>
          <Title>{scene.custom.relativeTime}</Title>
          <Toggle active={scene.custom.active}>
            <ToggleState>{powerIcon}</ToggleState>
            <ToggleMessage>
              {scene.custom.active ? "Success..." : `Start scene`}{" "}
              {!scene.custom.active && arrowIcon}
            </ToggleMessage>
          </Toggle>
        </LayoutBetween>
      </StyledSceneCard>
    </Ripples>
  );
}
