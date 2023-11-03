import { AuthData } from "home-assistant-js-websocket";

const storage = typeof window !== "undefined" ? window.localStorage : ({} as Storage);

type TokenCache = {
  tokens?: AuthData | null;
  writeEnabled: boolean;
};

const tokenCache: TokenCache = {
  tokens: undefined,
  writeEnabled: true,
};

const extractSearchParam = (param: string): string | null => {
  if (typeof location === "undefined") return null; // Protect against server-side execution
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(param);
};

export function saveTokens(tokens: AuthData | null) {
  tokenCache.tokens = tokens;

  if (!tokenCache.writeEnabled && extractSearchParam("storeToken") === "true") {
    tokenCache.writeEnabled = true;
  }

  if (tokenCache.writeEnabled && typeof storage !== "undefined") {
    try {
      storage.hassTokens = JSON.stringify(tokens);
    } catch (err: unknown) {
      // write failed, ignore it. Happens if storage is full or private mode.
    }
  }
}

export function loadTokens() {
  if (tokenCache.tokens === undefined && typeof storage !== "undefined") {
    try {
      // Delete the old token cache.
      delete storage.tokens;
      const tokens = storage.hassTokens;
      if (tokens) {
        tokenCache.tokens = JSON.parse(tokens);
        tokenCache.writeEnabled = true;
      } else {
        tokenCache.tokens = null;
      }
    } catch (err: unknown) {
      tokenCache.tokens = null;
    }
  }
  return tokenCache.tokens;
}
