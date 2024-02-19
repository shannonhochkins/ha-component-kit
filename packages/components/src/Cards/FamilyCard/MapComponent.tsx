import styled from "@emotion/styled";
import { useIcon } from "@hooks";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapMarker } from "./MapMarker";
import { UserAvatar } from "./UserAvatar";

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
    .user-avatar {
      border-radius: 100%;
      border: 2px solid var(--ha-S900);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      &--icon {
        background: var(--ha-S700);
        border-color: var(--ha-50);
      }
    }
  }
`;

type MapComponentProps = {
  latitude: number;
  longitude: number;
  mapHeight: number;
  userIcon: string;
  userImage?: string;
};

const MapComponent = ({ latitude, longitude, mapHeight, userIcon, userImage }: MapComponentProps) => {
  const position: [number, number] = [latitude, longitude];
  const iconElement = useIcon(userIcon, { width: "30px", height: "30px" });

  return (
    <StyledMapContainer center={position} zoom={14} style={{ height: `${mapHeight}px`, width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapMarker
        marker={{
          position: position,
          // Add any event handlers you need
        }}
        container={{
          tagName: "div",
          className: "custom-marker",
        }}
      >
        {userImage ? <UserAvatar userImage={userImage} /> : <div className="user-avatar user-avatar--icon">{iconElement}</div>}
      </MapMarker>
    </StyledMapContainer>
  );
};

export default MapComponent;
