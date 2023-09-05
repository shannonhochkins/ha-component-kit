import { computeDomain } from "@utils/computeDomain";
import type { EntityName } from "@hakit/core";
import type { ModalProps } from "./";
import { ModalLightControls } from "./ModalLightControls";
import { ModalClimateControls } from "./ModalClimateControls";
import { ModalVacuumControls } from "./ModalVacuumControls";
import type { ModalLightControlsProps } from "./ModalLightControls";
import type { ModalClimateControlsProps } from "./ModalClimateControls";
import type { ModalVacuumControlsProps } from "./ModalVacuumControls";
interface ModalPropsByDomain {
  light: ModalLightControlsProps;
  climate: ModalClimateControlsProps;
  vacuum: ModalVacuumControlsProps;
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
        <ModalLightControls entity={entity as `light.${string}`} {...rest} />
      );
    case "climate":
      return (
        <ModalClimateControls
          entity={entity as `climate.${string}`}
          {...rest}
        />
      );
    case "vacuum":
      return (
        <ModalVacuumControls
          entity={entity as `vacuum.${string}`}
          {...rest}
        />
      );
    default:
      return null;
  }
}
