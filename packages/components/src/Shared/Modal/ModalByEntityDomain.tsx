import { computeDomain } from "@utils/computeDomain";
import type { EntityName, FilterByDomain } from "@hakit/core";
import type { ModalProps } from "./";
import { ModalLightControls } from "./ModalLightControls";
import { ModalClimateControls } from "./ModalClimateControls";
import type { ModalLightControlsProps } from "./ModalLightControls";
import type { ModalClimateControlsProps } from "./ModalClimateControls";
interface ModalPropsByDomain {
  light: ModalLightControlsProps;
  climate: ModalClimateControlsProps;
}

type EntityDomainProps<E extends EntityName> =
  E extends `${infer Domain}.${string}`
    ? Domain extends keyof ModalPropsByDomain
      ? ModalPropsByDomain[Domain]
      : Omit<ModalProps, "children">
    : never;

export type ModalByEntityDomainProps<E extends EntityName> =
  EntityDomainProps<E> & {
    entity: E;
  };

export function ModalByEntityDomain<E extends EntityName>({
  entity,
  ...rest
}: ModalByEntityDomainProps<E>) {
  const domain = computeDomain(entity);
  switch (domain) {
    case "light":
      return (
        <ModalLightControls
          entity={entity as FilterByDomain<EntityName, "light">}
          {...rest}
        />
      );
    case "climate":
      return (
        <ModalClimateControls
          entity={entity as FilterByDomain<EntityName, "climate">}
          {...rest}
        />
      );
    default:
      return null;
  }
}
