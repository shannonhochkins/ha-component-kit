import { CameraStream, Row, type CameraStreamProps } from "@components";
import { isUnavailableState, useEntity, type EntityName, type FilterByDomain } from "@hakit/core";
import { useEffect } from "react";
export interface ModalCameraControlsProps extends CameraStreamProps {
  entity: FilterByDomain<EntityName, "camera">;
  onStateChange: (state: string) => void;
}

export function ModalCameraControls({ entity, onStateChange, ...props }: ModalCameraControlsProps) {
  const _entity = useEntity(entity);
  const isUnavailable = isUnavailableState(_entity.state);
  useEffect(() => {
    onStateChange("loading");
  }, [onStateChange]);
  return (
    <Row fullWidth>
      <CameraStream
        entity={entity}
        {...props}
        onStateChange={(value) => {
          let title = "Loading";
          switch (value) {
            case "playing":
            case "play":
              title = "Playing";
              break;
            case "loadeddata":
              title = "Loaded";
              break;
            case "pause":
              title = "Paused";
              break;
            case "stalled":
              title = "Stalled";
              break;
            case "waiting":
              title = "Loading";
              break;
            case "canplaythrough":
            case "canplay":
              title = "Ready";
              break;
          }
          onStateChange(isUnavailable ? "Unavailable" : title);
        }}
      />
    </Row>
  );
}
