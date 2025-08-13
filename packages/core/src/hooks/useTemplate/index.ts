import { useRef, useEffect, useMemo, useState } from "react";
import { EntityName, useStore } from "@core";
import { MessageBase, UnsubscribeFunc } from "home-assistant-js-websocket";

type RenderTemplateResult = {
  result: string;
} & MessageBase;

type RenderTemplateError = {
  error: string;
  label: string;
};

export type TemplateParams = {
  /** The template expression to process */
  template: string;
  /** The entity ids or id to watch for changes, @deprecated This may not be needed as variables should handle this case */
  entity_ids?: EntityName | EntityName[];
  /** variables to define to use within the template
   * @example
   * variables: { entity_id: 'climate.air_conditioner' }
   * you can now use entity_id in your template expression
   */
  variables?: Record<string, unknown>;
  /** amount of time that should pass before aborting the template request @default undefined */
  timeout?: number;
  /** should the template renderer be strict, raise on undefined variables etc @default false */
  strict?: boolean;
  /** should the template renderer report any errors @default false */
  report_errors?: boolean;
  /** Determines if the subscription should be active. @default true */
  enabled?: boolean;
};

export const useTemplate = (params: TemplateParams) => {
  const connection = useStore((state) => state.connection);
  const [template, setTemplate] = useState<string | null>(null);
  const unsubscribeRef = useRef<UnsubscribeFunc | null>(null);
  const memoizedParams = useMemo(() => params, [params]);

  useEffect(() => {
    const unsubscribe = () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch {
          // May have already unsubscribed
        } finally {
          unsubscribeRef.current = null;
        }
      }
    };
    const { enabled = true, ...restParams } = memoizedParams;

    if (!enabled || !connection) {
      unsubscribe();
      if (!enabled) {
        setTemplate(null);
      }
      return;
    }

    const handleResponse = (response: RenderTemplateResult | RenderTemplateError) => {
      if ("error" in response) {
        // We show the latest error, or a warning if there are no errors
        setTemplate(response.error);
        return;
      }
      if (typeof response.result === "string") {
        setTemplate((previous) => (previous === response.result ? previous : response.result));
      }
    };

    const handleError = (err: RenderTemplateError) => {
      setTemplate(err?.error || "Could not process template request.");
    };

    connection
      .subscribeMessage(handleResponse, {
        type: "render_template",
        ...restParams,
      })
      .then((unsub) => {
        unsubscribeRef.current = unsub;
      })
      .catch((e: RenderTemplateError) => {
        handleError(e);
      });

    return unsubscribe;
  }, [connection, memoizedParams]);

  return template;
};
