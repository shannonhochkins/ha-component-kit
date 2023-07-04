import { useMemo } from "react";
import { useHass } from "@hooks";
import {
  SupportedServices,
  DomainService,
  DomainName,
  ServiceData,
  Target,
} from "@typings/supported-services";

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
          return function (target: Target, serviceData?: ServiceData<T, S>) {
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
