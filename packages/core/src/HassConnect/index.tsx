import type { ReactNode } from "react";
import { useRef } from "react";
import { HassProvider } from "./Provider";

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
  /** called once the connection is successful, and only once */
  onReady?: () => void;
};
/** This component will show the Home Assistant login form you're used to seeing normally when logging into HA, once logged in you shouldn't see this again unless you clear device storage, once authenticated it will render the child components of HassConnect and provide access to the api. */
export const HassConnect = ({
  children,
  hassUrl,
  fallback = null,
  onReady,
}: HassConnectProps): JSX.Element => {
  const onReadyCalled = useRef(false);
  if (!hassUrl) {
    return (
      <>{`Provide the hassUrl prop with the url to your home assistant instance.`}</>
    );
  }
  return (
    <HassProvider hassUrl={hassUrl}>
      {(ready) => {
        if (ready && onReady && !onReadyCalled.current) {
          onReady();
          onReadyCalled.current = true;
        }
        return ready ? children : fallback;
      }}
    </HassProvider>
  );
};
