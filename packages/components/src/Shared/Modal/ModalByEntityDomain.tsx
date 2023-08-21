import { computeDomain } from "@utils/computeDomain";
import type { AllDomains } from "@core";
import type { ModalProps } from "./";
import { ModalLightControls } from "./ModalLightControls";
import { ModalClimateControls } from "./ModalClimateControls";
import type { ModalLightControlsProps } from "./ModalLightControls";
import type { ModalClimateControlsProps } from "./ModalClimateControls";
interface ModalPropsByDomain {
  light: ModalLightControlsProps;
  climate: ModalClimateControlsProps;
}

type EntityDomainProps<E extends `${AllDomains}.${string}`> =
  E extends `${infer Domain}.${string}`
    ? Domain extends keyof ModalPropsByDomain
      ? ModalPropsByDomain[Domain]
      : Omit<ModalProps, "children">
    : never;

export type ModalByEntityDomainProps<E extends `${AllDomains}.${string}`> =
  EntityDomainProps<E> & {
    entity: E;
  };

export function ModalByEntityDomain<E extends `${AllDomains}.${string}`>({
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
    default:
      return null;
  }
}
