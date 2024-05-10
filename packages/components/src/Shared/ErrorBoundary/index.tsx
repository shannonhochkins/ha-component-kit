import { ErrorBoundaryProps } from "react-error-boundary";
import { Alert } from "@components";

interface Fallback {
  prefix?: string;
}

export const fallback = ({ prefix }: Fallback): ErrorBoundaryProps => ({
  fallbackRender({ error, resetErrorBoundary }) {
    return (
      <Alert
        className={`error-boundary-alert`}
        title={`${prefix ? `${prefix} - ` : ""}Something went wrong`}
        description={error.message}
        type="error"
        onClick={() => resetErrorBoundary()}
      />
    );
  },
});
