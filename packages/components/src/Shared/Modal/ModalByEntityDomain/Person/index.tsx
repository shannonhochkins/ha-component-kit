import type { PersonControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { lazy } from "react";

export interface ModalPersonControlsProps extends PersonControlsProps {
  entity: FilterByDomain<EntityName, "person">;
  mapHeight: number;
}

const PersonControls = lazy(() => import("@components").then((module) => ({ default: module.PersonControls })));

export function ModalPersonControls({ entity, mapHeight, ...props }: ModalPersonControlsProps) {
  return <PersonControls entity={entity} mapHeight={mapHeight} {...props} />;
}
