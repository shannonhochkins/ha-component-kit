import { useMemo, useCallback } from "react";
import { useHass } from "../useHass";
import { localize } from "../useLocale";
import type { SupportedActions, DomainAction, SnakeOrCamelDomains, ActionData, SnakeToCamel, Target } from "@typings";
import type { HassContextProps } from "@core";
import { uniq } from "lodash";

export function createAction<T extends SnakeOrCamelDomains>(
  domain: T,
  callAction: HassContextProps["callAction"],
  rootTarget?: Target,
): SupportedActions[SnakeToCamel<T>] {
  return new Proxy<SupportedActions[SnakeToCamel<T>]>(
    // @ts-expect-error - purposely not defining the target object here
    {},
    {
      get: <S extends DomainAction<T>>(_: unknown, action: S) => {
        // service is a string here, so we can assert it as S
        // Skip interception for inherited properties
        if (action === "toJSON") return;
        return function (args: {
          target?: Target;
          serviceData?: ActionData<T, S>;
          actionData?: ActionData<T, S>;
          returnResponse?: boolean;
        }) {
          const { target: _target, serviceData, actionData, returnResponse } = args || {};
          // use the rootTarget if provided, ignore the target from the args as typescript has an overload for this
          // flow to disallow a serviceTarget if specified at the hook level.
          let target = rootTarget ?? _target;
          if (Array.isArray(target)) {
            // ensure the target values are a unique array of ids
            target = [...uniq(target)];
          }
          console.info(
            `${localize("perform_action_name", {
              search: "{name}",
              replace: `${domain}.${action}`,
            })} ${domain}.${action}:`,
            {
              target,
              serviceData,
              returnResponse,
            },
          );
          return callAction({
            domain,
            action,
            actionData: actionData || serviceData,
            target,
            // necessary cast here as the overloads expect true | false | undefined not a boolean
            returnResponse: returnResponse as true,
          });
        };
      },
    },
  );
}

export function useAction<T extends SnakeOrCamelDomains>(domain: T, rootTarget: Target): SupportedActions<"no-target">[SnakeToCamel<T>];
export function useAction<T extends SnakeOrCamelDomains>(domain: T): SupportedActions[SnakeToCamel<T>];
export function useAction(): <T extends SnakeOrCamelDomains>(domain: T) => SupportedActions[SnakeToCamel<T>];
export function useAction<T extends SnakeOrCamelDomains>(domain?: T, rootTarget?: Target) {
  const { callAction } = useHass();

  const service = useMemo(() => {
    return domain ? createAction(domain, callAction, rootTarget) : undefined;
  }, [domain, callAction, rootTarget]);

  const apiWithDomain = useCallback(
    (inputDomain: SnakeOrCamelDomains) => {
      return createAction(inputDomain, callAction, rootTarget);
    },
    [callAction, rootTarget],
  );

  return domain ? service : apiWithDomain;
}
