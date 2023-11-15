import { EntityName, FilterByDomain, useService } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import type { HassEntity } from "home-assistant-js-websocket";
import { CardBase, Row, Column, VolumeControls, fallback, ColumnProps } from "@components";
import { StyledFab } from "../../../../Cards/MediaPlayerCard";
import { capitalize, groupBy } from "lodash";
import { useCallback, useMemo, useState, useEffect } from "react";

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
  cursor: default;
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
  grid-template-columns: auto auto;
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

export interface MediaPlayerControlsProps extends ColumnProps {
  groupedEntities: HassEntity[];
  onStateChange?: (state: string) => void;
}

export const MediaPlayerControls = ({ groupedEntities, onStateChange, ...rest }: MediaPlayerControlsProps) => {
  
  const mediaPlayersOrderedByGroup = useMemo(
    () => groupBy(groupedEntities, (entity) => entity.attributes?.group_members),
    [groupedEntities],
  );
  const mediaPlayerService = useService("media_player");
  const [lastPlayedMedia, setLastPlayedMedia] = useState<{ media_content_id: string; media_content_type: string }>({
    media_content_id: "",
    media_content_type: "",
  });

  const handleMediaPlayerActionClick = useCallback(
    (entityId: FilterByDomain<EntityName, "media_player">) => {
      const entity = groupedEntities.find((entity) => entity.entity_id === entityId);
      if (!entity) {
        // TODO - handle the case where it's not found?
        return;
      }
      const playingSpeakers = groupedEntities.filter((entity) => entity.state === "playing");

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
    [groupedEntities, mediaPlayerService, lastPlayedMedia],
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
                className={`entities-card entities-card-media-controls`}
                style={{ overflow: "visible" }}
              >
                <StyledColumn gap={"0.5rem"} justifyContent={"space-between"}>
                  <Title className="title device-name">
                    {friendlyName}
                    <State> - {capitalize(entity.state)}</State>
                  </Title>
                  <Row gap={"0.5rem"} justifyContent={"end"}>
                    <VolumeControls
                      entity={entity.entity_id as FilterByDomain<EntityName, "media_player">}
                      volumeLayout={"slider"}
                      hideMute={false}
                      disabled={false}
                      layout={"slim"}
                    />
                    <div style={{ position: "relative" }}>
                      <StyledFab
                        rippleProps={{
                          preventPropagation: true
                        }}
                        className="speaker-group"
                        iconColor={`var(--ha-S200-contrast)`}
                        active={isPlaying}
                        disabled={false}
                        size={30}
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
    [mediaPlayersOrderedByGroup, handleMediaPlayerActionClick, getIcon],
  );

  useEffect(() => {
    if (groupedEntities[0] && onStateChange) {
      onStateChange(groupedEntities[0].state);
    }
  }, [groupedEntities, onStateChange]);

  return <Column fullHeight fullWidth {...rest}>
    <Column fullWidth fullHeight className={`column`} gap="0.5rem">
      {groupedMediaPlayerComponents}
    </Column>
  </Column>
};
