import { useMemo } from "react";
import type { HassServiceTarget } from "home-assistant-js-websocket";
import { useHass } from "../useHass";
import {
  SupportedServices,
  DomainService,
  DomainName,
  ServiceData,
} from "../../types/supported-services";

export function useApi<T extends DomainName>(domain: T) {
  const { callService } = useHass();
  const service = useMemo(() => {
    return new Proxy<object, SupportedServices[T]>(
      {},
      {
        get: <S extends DomainService<T>>(_: unknown, serviceInput: string) => {
          if (typeof serviceInput !== "string") {
            throw new Error("Service must be a string");
          }
          // service is a string here, so we can assert it as S
          const service = serviceInput as S;
          return function (
            target: HassServiceTarget,
            serviceData?: ServiceData<T, S>
          ) {
            callService({
              domain,
              service,
              serviceData,
              target,
            });
            console.log(`Calling ${domain}.${service} with`, {
              target,
              serviceData,
            });
          };
        },
      }
    );
  }, [callService, domain]);
  return service;
}
