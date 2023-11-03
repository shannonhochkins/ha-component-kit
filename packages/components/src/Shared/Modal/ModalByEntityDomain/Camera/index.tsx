import { CameraStream, Row, type CameraStreamProps } from "@components";
import { isUnavailableState, useEntity, type EntityName, type FilterByDomain } from "@hakit/core";
export interface ModalCameraControlsProps extends CameraStreamProps {
  entity: FilterByDomain<EntityName, "camera">;
  onStateChange: (state: string) => void;
}

export function ModalCameraControls({ entity, onStateChange, ...props }: ModalCameraControlsProps) {
  const _entity = useEntity(entity);
  const isUnavailable = isUnavailableState(_entity.state);
  return (
    <Row fullWidth>
      <CameraStream
        entity={entity}
        {...props}
        onStateChange={(value) => {
          onStateChange(isUnavailable ? "Unavailable" : value);
        }}
      />
    </Row>
  );
}
