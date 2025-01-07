import { UserAvatar, fallback } from "@components";
import styled from "@emotion/styled";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { useEntity } from "@hakit/core";
import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { MapContainer, Marker, MarkerProps, TileLayer } from "react-leaflet";

const StyledMapContainer = styled(MapContainer)`
  .leaflet-layer,
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out,
  .leaflet-control-attribution {
    filter: brightness(0.6) invert(1) contrast(4) hue-rotate(300deg) saturate(0.3) brightness(1) grayscale(40%);
  }
  .leaflet-div-icon {
    background: none;
    border: none;
  }
`;

type ReactProps = { children: React.ReactNode };

type ContainerProps = {
  tagName: string;
  className?: string;
  container?: HTMLElement;
};

type DivIconMarkerProps = ReactProps & { marker: MarkerProps } & {
  container: ContainerProps;
};
export const MapMarker = ({ children, marker, container }: DivIconMarkerProps) => {
  const { tagName, className } = container;
  const element = L.DomUtil.create(tagName, className);
  const divIcon = new DivIcon({ html: element });
  const portal = createPortal(children, element);
  const { position, eventHandlers } = marker;

  useEffect(() => {
    return () => {
      L.DomUtil.remove(element);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Cleanup runs on unmount

  return (
    <>
      {portal}
      <Marker position={position} icon={divIcon} eventHandlers={eventHandlers} />
    </>
  );
};

export interface PersonControlsProps {
  entity: FilterByDomain<EntityName, "person">;
  mapHeight: number;
}

function InternalPersonControls({ entity: _entity, mapHeight }: PersonControlsProps) {
  const entity = useEntity(_entity);
  const position = new L.LatLng(entity.attributes.latitude, entity.attributes.longitude);

  return (
    <StyledMapContainer center={position} zoom={14} style={{ height: `${mapHeight}px`, width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapMarker
        marker={{
          position: position,
        }}
        container={{
          tagName: "div",
          className: "custom-marker",
        }}
      >
        <UserAvatar
          entity={_entity}
          iconSize={{ width: "30px", height: "30px" }}
          avatarSize={{ width: "48px", height: "48px" }}
          withBorder
        />
      </MapMarker>
    </StyledMapContainer>
  );
}

/**
 * The PersonControls component renders a map with a user avatar marker of the persons location.
 * */
export function PersonControls(props: PersonControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "PersonControls" })}>
      <InternalPersonControls {...props} />
    </ErrorBoundary>
  );
}
