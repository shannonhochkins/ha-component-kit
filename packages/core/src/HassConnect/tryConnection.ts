// types
import type { Connection, getAuthOptions as AuthOptions, Auth } from "home-assistant-js-websocket";
// methods
import {
  getAuth,
  createLongLivedTokenAuth,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  ERR_CONNECTION_LOST,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  ERR_INVALID_HTTPS_TO_HTTP,
} from "home-assistant-js-websocket";
import { saveTokens, loadTokens, clearTokens } from "./token-storage";

export function handleError(err: number | string | Error | unknown, hassToken?: string): string {
  const getMessage = () => {
    switch (err) {
      case ERR_INVALID_AUTH:
        return `ERR_INVALID_AUTH: Invalid authentication. ${hassToken ? 'Check your "Long-Lived Access Token".' : ""}`;
      case ERR_CANNOT_CONNECT:
        return "ERR_CANNOT_CONNECT: Unable to connect";
      case ERR_CONNECTION_LOST:
        return "ERR_CONNECTION_LOST: Lost connection to home assistant.";
      case ERR_HASS_HOST_REQUIRED:
        return "ERR_HASS_HOST_REQUIRED: Please enter a Home Assistant URL.";
      case ERR_INVALID_HTTPS_TO_HTTP:
        return 'ERR_INVALID_HTTPS_TO_HTTP: Cannot connect to Home Assistant instances over "http://".';
      default:
        return null;
    }
  };
  const message = getMessage();
  if (message !== null) return message;
  return (
    (
      err as {
        error: string;
      }
    )?.error ||
    (err as Error)?.message ||
    `Unknown Error (${err})`
  );
}
type ConnectionResponse =
  | {
      type: "success";
      connection: Connection;
      auth: Auth;
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "failed";
      cannotConnect: true;
    };

type ConnectionType = "auth-callback" | "user-request" | "saved-tokens" | "inherited-auth" | "provided-token";

function getInheritedConnection(): typeof window.hassConnection | undefined {
  try {
    return typeof window !== "undefined" ? window.top?.hassConnection : undefined;
  } catch (e) {
    console.error("Error getting inherited connection", e);
    return undefined;
  }
}

function determineConnectionType(hassUrl: string, hassToken?: string): ConnectionType {
  const isAuthCallback = location && location.search.includes("auth_callback=1");
  const hasHassConnection = !!getInheritedConnection();
  const providedToken = !!hassToken;
  // when we have a hass connection, we don't need to validate the tokens
  // so removing the tokens if values are different and we have a connection are not needed.
  const savedTokens = !!loadTokens(hassUrl, false);

  switch (true) {
    case isAuthCallback:
      return "auth-callback";
    case hasHassConnection:
      return "inherited-auth";
    case providedToken:
      return "provided-token";
    case savedTokens:
      return "saved-tokens";
    default:
      return "user-request";
  }
}

export const tryConnection = async (hassUrl: string, hassToken?: string): Promise<ConnectionResponse> => {
  const connectionType = determineConnectionType(hassUrl, hassToken);

  if (connectionType === "inherited-auth") {
    try {
      // if we've hit this connect type, the connection will be available
      const { auth, conn } = (await getInheritedConnection()) as { conn: Connection; auth: Auth };
      return {
        type: "success",
        connection: conn,
        auth: auth,
      };
    } catch (e) {
      const message = handleError(e, hassToken);
      return {
        type: "error",
        error: message,
      };
    }
  }
  if (connectionType === "provided-token" && hassToken) {
    try {
      const auth = await createLongLivedTokenAuth(hassUrl, hassToken);
      const connection = await createConnection({ auth });
      return {
        type: "success",
        connection,
        auth,
      };
    } catch (e) {
      const message = handleError(e, hassToken);
      return {
        type: "error",
        error: message,
      };
    }
  }

  const options: AuthOptions = {
    saveTokens,
    loadTokens: () => Promise.resolve(loadTokens(hassUrl)),
  };

  if (hassUrl && connectionType === "user-request") {
    options.hassUrl = hassUrl;
    if (options.hassUrl === "") {
      return {
        type: "error",
        error: "Please enter a Home Assistant URL.",
      };
    }
    if (options.hassUrl.indexOf("://") === -1) {
      return {
        type: "error",
        error: "Please enter your full URL, including the protocol part (https://).",
      };
    }
    try {
      new URL(options.hassUrl);
    } catch (err: unknown) {
      console.error("Error:", err);
      return {
        type: "error",
        error: "Invalid URL",
      };
    }
  }
  let auth: Auth;

  try {
    auth = await getAuth(options);
  } catch (err: unknown) {
    if (
      (
        err as {
          error: string;
        }
      )?.error === "invalid_grant"
    ) {
      // the refresh token is incorrect and most likely from another browser / instance
      clearTokens();
      return tryConnection(hassUrl, hassToken);
    }
    if (connectionType === "saved-tokens" && err === ERR_CANNOT_CONNECT) {
      return {
        type: "failed",
        cannotConnect: true,
      };
    }
    return {
      type: "error",
      error: handleError(err, hassToken),
    };
  } finally {
    // Clear url if we have a auth callback in url.
    if (typeof window !== "undefined" && location && location.search.includes("auth_callback=1")) {
      history.replaceState(null, "", location.pathname);
    }
  }
  let connection: Connection;
  try {
    // create the connection to the websockets
    connection = await createConnection({ auth });
  } catch (err) {
    // In case of saved tokens, silently solve problems.
    if (connectionType === "saved-tokens") {
      if (err === ERR_CANNOT_CONNECT) {
        return {
          type: "failed",
          cannotConnect: true,
        };
      } else if (err === ERR_INVALID_AUTH) {
        saveTokens(null);
      }
    }
    return {
      type: "error",
      error: handleError(err, hassToken),
    };
  }
  return {
    type: "success",
    connection,
    auth,
  };
};
