import { type ErrorBoundaryProps } from "react-error-boundary";
import { Alert } from "@components";
import { localize } from "@hakit/core";

interface Fallback {
  prefix?: string;
}

export const fallback = ({ prefix }: Fallback): ErrorBoundaryProps => ({
  fallbackRender({ error, resetErrorBoundary }) {
    return (
      <Alert
        className={`error-boundary-alert`}
        title={`${prefix ? `${prefix} - ` : ""}${localize("unknown_error")}`}
        description={error.message}
        type="error"
        onClick={() => resetErrorBoundary()}
      />
    );
  },
});
