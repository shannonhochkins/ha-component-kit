import { EntityName, FilterByDomain, HassEntityWithService, useService } from "@hakit/core";
import { HassEntity } from "home-assistant-js-websocket";
import { Modal, ModalProps } from "../../../Modal";
import { Column } from "../../../Column";
import { ErrorBoundary } from "react-error-boundary";
import { fallback } from "../../../ErrorBoundary";
import styled from "@emotion/styled";
import { CardBase } from "../../../../Cards/CardBase";
import { Row } from "../../../Row";
import { VolumeControls } from "../../../../Cards/MediaPlayerCard/VolumeControls.tsx";
import { DEFAULT_FAB_SIZE, StyledFab } from "../../../../Cards/MediaPlayerCard";
import { capitalize, groupBy } from "lodash";
import { useCallback, useMemo, useState } from "react";

const StyledMediaPlayerCard = styled(CardBase)`
  transform: none;
  will-change: width, height;
  
  svg {
    color: currentColor;
  }
  &:not(.disabled) {
    &:hover,
    &:active {
      svg {
        color: currentColor;
      }
    }
  }
  padding: 1rem;
`;
const Title = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 1);
`;
const State = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const StyledColumn = styled(Column)`
  display: grid;
  grid-template-columns: 1fr auto;
`;
const GroupLine = styled.div`
  height: 50px;
  width: 2px;
  background-color: var(--ha-A400);
  position: absolute;
  top: 30px;
  left: 14px;
  z-index: 1;
`;

export interface MediaPlayerControlsProps extends Omit<ModalProps, "children"> {
  mediaPlayerEntities: HassEntity[];
  onStateChange?: (state: string) => void;
  className?: string;
}

export const MediaPlayerControls = ({ mediaPlayerEntities, className, ...modalProps }: MediaPlayerControlsProps) => {
  const mediaPlayersOrderedByGroup = useMemo(
    () => groupBy(mediaPlayerEntities, (entity) => entity.attributes?.group_members),
    [mediaPlayerEntities],
  );
  const mediaPlayerService = useService("media_player");
  const [lastPlayedMedia, setLastPlayedMedia] = useState<{ media_content_id: string; media_content_type: string }>({
    media_content_id: "",
    media_content_type: "",
  });

  const handleMediaPlayerActionClick = useCallback(
    (entityId: FilterByDomain<EntityName, "media_player">) => {
      const entity = mediaPlayerEntities.find((entity) => entity.entity_id === entityId) as HassEntityWithService<"media_player">;
      const playingSpeakers = mediaPlayerEntities.filter((entity) => entity.state === "playing");

      // no speakers are playing -> play media
      if (playingSpeakers.length === 0) {
        mediaPlayerService.playMedia(entity.attributes?.group_members ?? entity.entity_id, { ...lastPlayedMedia, enqueue: "play" });
        return mediaPlayerService.mediaPlay(entity.attributes?.group_members ?? entity.entity_id);
      }

      // the target speaker is playing and only has one member in the group -> pause media
      if (entity.attributes?.group_members?.length === 1 && entity.state === "playing") {
        setLastPlayedMedia({
          media_content_id: entity.attributes.media_content_id ?? "",
          media_content_type: entity.attributes.media_content_type ?? "",
        });
        return mediaPlayerService.mediaPause(entity.attributes?.group_members ?? entity.entity_id);
      }

      // the target speaker is playing and has more than one member in the group -> unjoin
      if ((entity.attributes?.group_members?.length || 0) > 1 && entity.state === "playing") {
        return mediaPlayerService.unjoin(entityId);
      }

      // the target speaker is not playing, and we have at least one speaker playing -> join
      if (entity.state !== "playing" && playingSpeakers.length > 0) {
        return mediaPlayerService.join({ entity_id: playingSpeakers[0].entity_id }, { group_members: [entityId] });
      }
    },
    [mediaPlayerEntities, mediaPlayerService, lastPlayedMedia],
  );

  const getIcon = useCallback(
    (groupLength: number, entity: HassEntity): string => {
      const hasSomePlayingSpeakers = Object.values(mediaPlayersOrderedByGroup)?.some((groupedMediaPlayers) =>
        groupedMediaPlayers.some((entity) => entity.state === "playing"),
      );

      if (groupLength === 1 && entity.state === "playing") {
        return "mdi:pause";
      }

      if (hasSomePlayingSpeakers) {
        return "mdi:speaker-multiple";
      }

      if (groupLength === 1 && entity.state !== "playing") {
        return "mdi:play";
      }

      return "mdi:speaker-off";
    },
    [mediaPlayersOrderedByGroup],
  );

  const groupedMediaPlayerComponents = useMemo(
    () =>
      Object.values(mediaPlayersOrderedByGroup)?.map((groupedMediaPlayers) => {
        return groupedMediaPlayers.map((entity, index) => {
          const isPlaying = entity.state === "playing";
          const isLastOfGroup = groupedMediaPlayers.length - 1 === index;
          const friendlyName = `${entity.attributes?.friendly_name ?? entity.entity_id}`;

          return (
            <ErrorBoundary key={entity.entity_id} {...fallback({ prefix: "EntityRow" })}>
              <StyledMediaPlayerCard
                disableRipples
                disableScale
                disableActiveState
                className={`entities-card ${className ?? ""}`}
                style={{ overflow: "visible" }}
              >
                <StyledColumn gap={"0.5rem"} justifyContent={"space-between"}>
                  <Title className="title device-name">
                    {friendlyName}
                    <State> - {capitalize(entity.state)}</State>
                  </Title>
                  <Row gap={"0.5rem"}>
                    <VolumeControls
                      entity={entity.entity_id as FilterByDomain<EntityName, "media_player">}
                      volumeLayout={"slider"}
                      hideMute={false}
                      disabled={false}
                      layout={"slim"}
                    />
                    <div style={{ position: "relative" }}>
                      <StyledFab
                        className="speaker-group"
                        iconColor={`var(--ha-S200-contrast)`}
                        active={isPlaying}
                        disabled={false}
                        size={DEFAULT_FAB_SIZE}
                        icon={getIcon(groupedMediaPlayers.length, entity)}
                        onClick={() => handleMediaPlayerActionClick(entity.entity_id as FilterByDomain<EntityName, "media_player">)}
                      />
                      {!isLastOfGroup && <GroupLine />}
                    </div>
                  </Row>
                </StyledColumn>
              </StyledMediaPlayerCard>
            </ErrorBoundary>
          );
        });
      }),
    [mediaPlayersOrderedByGroup, handleMediaPlayerActionClick, className, getIcon],
  );

  return (
    <Modal {...modalProps}>
      <Column fullHeight fullWidth>
        <Column fullWidth fullHeight className={`column`}>
          {groupedMediaPlayerComponents}
        </Column>
      </Column>
    </Modal>
  );
};
