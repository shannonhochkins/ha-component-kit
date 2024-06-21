import { MediaPlayerControls, type MediaPlayerControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
export interface ModalMediaPlayerControlsProps extends MediaPlayerControlsProps {
  entity: FilterByDomain<EntityName, "media_player">;
}

export function ModalMediaPlayerControls(props: ModalMediaPlayerControlsProps) {
  return <MediaPlayerControls {...props} />;
}
export default ModalMediaPlayerControls;
