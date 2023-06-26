import { useEffect, useCallback, ReactNode, ReactElement, useRef } from "react";
import {
  getAuth,
  createConnection,
  subscribeEntities,
  ERR_HASS_HOST_REQUIRED,
  Auth,
  getAuthOptions as AuthOptions,
  UnsubscribeFunc,
} from "home-assistant-js-websocket";
import { useHass } from "@hooks";

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
}

export const HassConnect = ({
  children,
  hassUrl,
  fallback = null,
}: HassConnectProps): ReactElement => {
  const { setEntities, setConnection, ready } = useHass();
  const auth = useRef<Auth | null>(null);
  const unsubscribe = useRef<UnsubscribeFunc | null>(null);

  const getAuthOptions = useCallback(
    (hassUrl: string): AuthOptions => ({
      hassUrl,
      async loadTokens() {
        try {
          return JSON.parse(localStorage.hassTokens);
        } catch (err) {
          return undefined;
        }
      },
      saveTokens: (tokens) => {
        localStorage.hassTokens = JSON.stringify(tokens);
      },
    }),
    []
  );

  useEffect(() => {
    async function authenticate() {
      if (typeof hassUrl !== 'string') return;
      try {
        auth.current = await getAuth(getAuthOptions(hassUrl));
        if (auth.current.expired) {
          auth.current.refreshAccessToken();
        }
      } catch (err) {
        if (err === ERR_HASS_HOST_REQUIRED) {
          auth.current = await getAuth(getAuthOptions(hassUrl));
        } else {
          console.error(`Unknown error: ${err}`);
          return;
        }
      }
      const connection = await createConnection({ auth: auth.current });
      unsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntities($entities);
      });
      if (location.search.includes("auth_callback=1")) {
        history.replaceState(null, "", location.pathname);
      }
      setConnection(connection);
    }
    if (!ready) {
      try {
        authenticate();
      } catch (err) {
        console.error(`Unknown error: ${err}`);
      }
    }
    return () => {
      // on unmount, unsubscribe
      if (unsubscribe.current) {
        unsubscribe.current();
        unsubscribe.current = null;
      }
    };
  }, [getAuthOptions, hassUrl, ready, setConnection, setEntities]);
  if (!hassUrl) {
    return <>{`Provide the hassUrl prop with the url to your home assistant instance.`}</>;
  }
  return <>{ready ? children : fallback}</>;
};
