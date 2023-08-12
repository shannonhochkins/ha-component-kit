import { computeDomain } from "@utils/computeDomain";
import type { AllDomains } from "@core";
import type { ModalProps } from "./";
import { ModalLightControls } from "./ModalLightControls";

export interface ModalByEntityDomainProps extends Omit<ModalProps, "children"> {
  entity: `${AllDomains}.${string}`;
}

export function ModalByEntityDomain({
  entity,
  ...rest
}: ModalByEntityDomainProps) {
  const domain = computeDomain(entity);
  switch (domain) {
    case "light":
      return (
        <ModalLightControls entity={entity as `light.${string}`} {...rest} />
      );
    default:
      return null;
  }
}
