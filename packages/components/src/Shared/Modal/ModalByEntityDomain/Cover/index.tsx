import { CoverControls, Row, type CoverControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
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
