import { type CameraStreamProps, CameraStream } from "../../../../Cards/CameraCard/stream";
import { Row } from "../../../Row";
import { isUnavailableState, localize, useEntity, type EntityName, type FilterByDomain } from "@hakit/core";
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
          let title = localize("loading");
          switch (value) {
            case "playing":
            case "play":
              title = localize("play");
              break;
            case "loadeddata":
            case "waiting":
              title = localize("loading");
              break;
            case "pause":
              title = localize("pause");
              break;
            case "stalled":
              title = localize("buffering");
              break;
            case "canplaythrough":
            case "canplay":
              title = localize("nothing_playing");
              break;
          }
          onStateChange(isUnavailable ? localize("unavailable") : title);
        }}
      />
    </Row>
  );
}
export default ModalCameraControls;
