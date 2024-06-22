import type { EntityName, FilterByDomain } from "@hakit/core";
import { CoverControls, CoverControlsProps } from "../../../Entity/Cover/CoverControls";
import { Row } from "../../../Row";
export interface ModalCoverControlsProps extends CoverControlsProps {
  entity: FilterByDomain<EntityName, "cover">;
}

export function ModalCoverControls(props: ModalCoverControlsProps) {
  return (
    <Row fullWidth>
      <CoverControls {...props} />
    </Row>
  );
}

export default ModalCoverControls;
