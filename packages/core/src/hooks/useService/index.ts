import { useMemo, useCallback } from "react";
import { useHass } from "@core";
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
        return function (args: { target?: Target; serviceData?: ServiceData<T, S>; returnResponse?: boolean }) {
          const { target: _target, serviceData, returnResponse } = args || {};
          // use the rootTarget if provided, ignore the target from the args as typescript has an overload for this
          // flow to disallow a serviceTarget if specified at the hook level.
          let target = rootTarget ?? _target;
          if (Array.isArray(target)) {
            // ensure the target values are a unique array of ids
            target = [...uniq(target)];
          }
          console.info(
            `${localize("perform_action", {
              search: "{name}",
              replace: `${domain}.${service}`,
            })} ${domain}.${service}:`,
            {
              target,
              serviceData,
              returnResponse,
            },
          );
          return callService({
            domain,
            service,
            serviceData,
            target,
            // necessary cast here as the overloads expect true | false | undefined not a boolean
            returnResponse: returnResponse as true,
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
  const { callService } = useHass.getState().helpers;

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
