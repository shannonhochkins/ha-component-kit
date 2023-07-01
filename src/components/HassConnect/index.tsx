import { ReactNode, ReactElement } from "react";
import { HassProvider } from "./Provider";

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
};

export const HassConnect = ({
  children,
  hassUrl,
  fallback = null,
}: HassConnectProps): ReactElement => {
  if (!hassUrl) {
    return (
      <>{`Provide the hassUrl prop with the url to your home assistant instance.`}</>
    );
  }
  console.log('hassUrl', hassUrl);
  return (
    <HassProvider hassUrl={hassUrl}>
      {(ready) => (ready ? children : fallback)}
    </HassProvider>
  );
};
