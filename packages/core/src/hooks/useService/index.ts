import { useMemo, useCallback } from "react";
import { useHass } from "../useHass";
import { localize } from "../useLocale";
import type { SupportedServices, DomainService, SnakeOrCamelDomains, ServiceData, SnakeToCamel, Target } from "@typings";
import type { HassContextProps } from "@core";
import { uniq } from "lodash";

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
        return function (...args: [Target?, ServiceData<T, S>?, boolean?]) {
          // if rootTarget is available, use it. otherwise, use the first argument as target
          let target = rootTarget ?? (args[0] as Target);
          const serviceData = rootTarget ? (args[0] as ServiceData<T, S>) : args[1];
          const returnResponse = rootTarget ? (args[1] as boolean) : args[2];
          if (Array.isArray(target)) {
            // ensure the target values are a unique array of ids
            target = [...uniq(target)];
          }

          console.info(
            `${localize("perform_action_name", {
              search: "{name}",
              replace: `${domain}.${service}`,
            })} ${domain}.${service}:`,
            {
              target,
              serviceData,
            },
          );
          return callService({
            domain,
            service,
            serviceData,
            target,
            returnResponse,
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
