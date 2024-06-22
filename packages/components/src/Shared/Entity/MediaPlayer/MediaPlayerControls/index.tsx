import {
  EntityName,
  FilterByDomain,
  useEntity,
  useService,
  isUnavailableState,
  OFF,
  supportsFeatureFromAttributes,
  type MediaPlayerEntity,
  localize,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { MediaPlayerCard, CardBase, Row, Column, Group, VolumeControls, fallback, ColumnProps } from "@components";
import { Fab } from "../../../../Cards/MediaPlayerCard/Fab";
import { capitalize, flatten, groupBy } from "lodash";
import { useCallback, useMemo, useState, useEffect } from "react";
import { spring } from "framer-motion";

const StyledMediaPlayerCard = styled(CardBase)`
  transform: none;
  will-change: width, height;
  svg {
    color: currentColor;
  }
  &:not(.disabled) {
    &:hover,
    &:active {
      background-color: var(--ha-S300);
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
  entity: FilterByDomain<EntityName, "media_player">;
  groupedEntities: MediaPlayerEntity[];
  allEntityIds: string[];
  onStateChange?: (state: string) => void;
}

export const MediaPlayerControls = ({
  groupedEntities = [],
  allEntityIds = [],
  onStateChange,
  entity,
  ...rest
}: MediaPlayerControlsProps) => {
  const primaryEntity = useEntity(entity);
  const supportsGrouping = supportsFeatureFromAttributes(primaryEntity.attributes, 524288);
  // To get proper ordering of speakers, we need to flatten the groupedEntities array while keeping the order of the groups
  const mediaPlayersOrderedByGroup = useMemo(
    () => flatten(Object.values(groupBy(groupedEntities, (entity) => entity.attributes?.group_members))),
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
    (entity: MediaPlayerEntity): string => {
      const hasSomePlayingSpeakers = mediaPlayersOrderedByGroup?.some((mediaPlayer) => mediaPlayer.state === "playing");

      if (entity.attributes.group_members?.length === 1 && entity.state === "playing") {
        return "mdi:pause";
      }

      if (hasSomePlayingSpeakers) {
        return "mdi:speaker-multiple";
      }

      if (entity.attributes.group_members?.length === 1 && entity.state !== "playing") {
        return "mdi:play";
      }

      return "mdi:speaker-off";
    },
    [mediaPlayersOrderedByGroup],
  );

  useEffect(() => {
    if (primaryEntity && onStateChange) {
      onStateChange(primaryEntity.state);
    }
  }, [primaryEntity, onStateChange]);

  return (
    <Column fullHeight fullWidth {...rest}>
      <Column fullWidth fullHeight className={`column`} gap="1rem">
        {primaryEntity && (
          <MediaPlayerCard
            layout="slim"
            groupMembers={allEntityIds.length > 1 ? (allEntityIds as FilterByDomain<EntityName, "media_player">[]) : undefined}
            disableColumns
            entity={primaryEntity.entity_id as FilterByDomain<EntityName, "media_player">}
            hideGrouping={true}
          />
        )}
        {allEntityIds.length > 1 && (
          <Group
            title={localize("related_entities")}
            disableColumns
            cssStyles={`
            &.group {
              background-color: rgba(0,0,0,0.1);
            }
          `}
          >
            {mediaPlayersOrderedByGroup.map((entity, index) => {
              const isPlaying = entity.state === "playing";
              const isLastOfGroup = index === mediaPlayersOrderedByGroup.length - 1;
              const friendlyName = `${entity.attributes?.friendly_name ?? entity.entity_id}`;
              const isOff = entity.state === OFF;
              const isUnavailable = isUnavailableState(entity.state);
              const supportsTurnOn = supportsFeatureFromAttributes(entity.attributes, 128);
              const supportsTurnOff = supportsFeatureFromAttributes(entity.attributes, 256);

              return (
                <StyledMediaPlayerCard
                  key={entity.entity_id}
                  layout
                  transition={spring}
                  disableRipples
                  disableScale
                  disableActiveState
                  className={`entities-card entities-card-media-controls`}
                  style={{ overflow: "visible" }}
                >
                  <ErrorBoundary {...fallback({ prefix: "EntityRow" })}>
                    <StyledColumn gap={"0.5rem"} justifyContent={"space-between"}>
                      <Title className="title device-name">
                        {friendlyName}
                        <State> - {capitalize(entity.state)}</State>
                      </Title>
                      <Row gap={"0.5rem"} justifyContent={"end"}>
                        {!supportsGrouping && (
                          <Fab
                            className="media-player-power"
                            iconProps={{
                              color: `var(--ha-S200-contrast)`,
                            }}
                            active={!isOff && !isUnavailable}
                            disabled={!supportsTurnOn || !supportsTurnOff}
                            size={30}
                            icon="mdi:power"
                            rippleProps={{
                              preventPropagation: true,
                            }}
                            onClick={() => {
                              if (isOff) {
                                mediaPlayerService.turnOn(entity.entity_id);
                              } else {
                                mediaPlayerService.turnOff(entity.entity_id);
                              }
                            }}
                          />
                        )}
                        {!isOff && (
                          <VolumeControls
                            entity={entity.entity_id as FilterByDomain<EntityName, "media_player">}
                            volumeLayout={"slider"}
                            hideMute={false}
                            disabled={false}
                            layout={"slim"}
                          />
                        )}
                        {supportsGrouping && !isOff && (
                          <div style={{ position: "relative" }}>
                            <Fab
                              rippleProps={{
                                preventPropagation: true,
                              }}
                              className="speaker-group"
                              iconProps={{
                                color: `var(--ha-S200-contrast)`,
                              }}
                              active={isPlaying}
                              disabled={false}
                              size={30}
                              icon={getIcon(entity)}
                              onClick={() => handleMediaPlayerActionClick(entity.entity_id as FilterByDomain<EntityName, "media_player">)}
                            />
                            {!isLastOfGroup && <GroupLine />}
                          </div>
                        )}
                      </Row>
                    </StyledColumn>
                  </ErrorBoundary>
                </StyledMediaPlayerCard>
              );
            })}
          </Group>
        )}
      </Column>
    </Column>
  );
};
