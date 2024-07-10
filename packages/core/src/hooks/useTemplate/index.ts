import { useRef, useEffect, useMemo, useState } from "react";
import { EntityName, useHass } from "@core";
import { MessageBase, UnsubscribeFunc } from "home-assistant-js-websocket";

type RenderTemplateResult = {
  result: string;
} & MessageBase;

type RenderTemplateError = {
  error: string;
  code: string;
};

export type TemplateParams = {
  /** The template expression to process */
  template: string;
  /** The entity ids or id to watch for changes, this has been marked as @deprecated and may not be needed to use this */
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
};

export const useTemplate = (params: TemplateParams) => {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const [template, setTemplate] = useState<string | null>(null);
  const unsubscribeRef = useRef<UnsubscribeFunc | null>(null);
  const _params = useMemo(() => params, [params]);

  useEffect(() => {
    return () => {
      try {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      } catch (e) {
        // may have already unsubscribed
        unsubscribeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!connection) return;
    const handleResponse = (response: RenderTemplateResult) => {
      if (response?.result) {
        setTemplate((previous) => (previous === response.result ? previous : response.result));
      }
    };

    const handleError = (err: RenderTemplateError) => {
      if (err?.code === "template_error") {
        setTemplate(err.error);
      } else {
        setTemplate(err?.error || "Could not process template request.");
      }
    };

    connection
      .subscribeMessage(handleResponse, {
        type: "render_template",
        ..._params,
      })
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe;
      })
      .catch((e: RenderTemplateError) => {
        handleError(e);
      });
  }, [connection, _params]);

  return useMemo(() => template, [template]);
};
