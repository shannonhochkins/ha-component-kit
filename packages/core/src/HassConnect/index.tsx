import type { ReactNode } from "react";
import { useRef } from "react";
import { HassProvider } from "./Provider";
import type { HassProviderProps } from "./Provider";

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
  /** called once the entity subscription is successful, and only once */
  onReady?: () => void;
  /** options for the provider */
  options?: Omit<HassProviderProps, "children" | "hassUrl">;
};
/** This component will show the Home Assistant login form you're used to seeing normally when logging into HA, once logged in you shouldn't see this again unless you clear device storage, once authenticated it will render the child components of HassConnect and provide access to the api. */
export const HassConnect = ({
  children,
  hassUrl,
  fallback = null,
  onReady,
  options = {},
}: HassConnectProps): JSX.Element => {
  const onReadyCalled = useRef(false);
  if (!hassUrl) {
    return (
      <>{`Provide the hassUrl prop with the url to your home assistant instance.`}</>
    );
  }
  return (
    <HassProvider hassUrl={hassUrl} {...options}>
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
