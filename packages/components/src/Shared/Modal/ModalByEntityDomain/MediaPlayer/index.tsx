import type { EntityName, FilterByDomain } from "@hakit/core";
import { MediaPlayerControls, MediaPlayerControlsProps } from "../../../Entity/MediaPlayer/MediaPlayerControls";
export interface ModalMediaPlayerControlsProps extends MediaPlayerControlsProps {
  entity: FilterByDomain<EntityName, "media_player">;
}

export function ModalMediaPlayerControls(props: ModalMediaPlayerControlsProps) {
  return <MediaPlayerControls {...props} />;
}
export default ModalMediaPlayerControls;
