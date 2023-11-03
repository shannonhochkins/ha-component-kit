import { useMemo, useCallback } from "react";
import { useHass } from "@core";
import type { SupportedServices, DomainService, SnakeOrCamelDomains, ServiceData, SnakeToCamel, Target } from "@typings";
import type { HassContextProps } from "@core";

export function createService<T extends SnakeOrCamelDomains>(
  domain: T,
  callService: HassContextProps["callService"],
  rootTarget?: Target,
): SupportedServices[SnakeToCamel<T>] {
  return new Proxy<SupportedServices[SnakeToCamel<T>]>(
    // @ts-expect-error - purposely not defining the target object here
    {},
    {
      get: <S extends DomainService<T>>(_: unknown, serviceInput: string) => {
        // service is a string here, so we can assert it as S
        const service = serviceInput as S;
        // Skip interception for inherited properties
        if (service === "toJSON") return;
        return function (...args: [Target?, ServiceData<T, S>?]) {
          // if rootTarget is available, use it. otherwise, use the first argument as target
          const target = rootTarget ?? (args[0] as Target);
          const serviceData = rootTarget ? (args[0] as ServiceData<T, S>) : args[1];

          console.log(`Calling ${domain}.${service} with`, {
            target,
            serviceData,
          });
          return callService({
            domain,
            service,
            serviceData,
            target,
          });
        };
      },
    },
  );
}

export function useService<T extends SnakeOrCamelDomains>(domain: T, rootTarget: Target): SupportedServices<"no-target">[SnakeToCamel<T>];
export function useService<T extends SnakeOrCamelDomains>(domain: T): SupportedServices[SnakeToCamel<T>];
export function useService(): <T extends SnakeOrCamelDomains>(domain: T) => SupportedServices[SnakeToCamel<T>];
export function useService<T extends SnakeOrCamelDomains>(domain?: T, rootTarget?: Target) {
  const { callService } = useHass();

  const service = useMemo(() => {
    return domain ? createService(domain, callService, rootTarget) : undefined;
  }, [domain, callService, rootTarget]);

  const apiWithDomain = useCallback(
    (inputDomain: SnakeOrCamelDomains) => {
      return createService(inputDomain, callService, rootTarget);
    },
    [callService, rootTarget],
  );

  return domain ? service : apiWithDomain;
}
