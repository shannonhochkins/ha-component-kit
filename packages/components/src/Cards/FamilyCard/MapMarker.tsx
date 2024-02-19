import L, { DivIcon } from "leaflet";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Marker, MarkerProps } from "react-leaflet";

type ReactProps = { children: JSX.Element };

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

  useEffect(() => {
    return () => {
      L.DomUtil.remove(element);
    };
  });
  const { position, eventHandlers } = marker;
  return (
    <>
      {portal}
      <Marker position={position} icon={divIcon} eventHandlers={eventHandlers}></Marker>
    </>
  );
};
