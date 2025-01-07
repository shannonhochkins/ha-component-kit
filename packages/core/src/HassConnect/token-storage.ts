import { AuthData } from "home-assistant-js-websocket";

const storage = typeof window !== "undefined" ? window.localStorage : null;
const supportsStorage = storage !== null;

export function clearTokens() {
  if (supportsStorage) {
    storage.removeItem("hassTokens");
  } else {
    console.error("Local storage not supported on this device.");
  }
}

export function saveTokens(tokens: AuthData | null) {
  if (supportsStorage) {
    try {
      storage.setItem("hassTokens", JSON.stringify(tokens));
    } catch (err: unknown) {
      // write failed, ignore it. Happens if storage is full or private mode.
      console.error("Failed to save tokens, probably due to private mode or storage full", err);
    }
  } else {
    console.error("Local storage not supported on this device.");
  }
}

export function loadTokens(hassUrl: string): AuthData | null {
  if (!supportsStorage) {
    console.error("Local storage not supported on this device.");
    return null;
  }
  const tokens = storage.getItem("hassTokens");
  if (tokens) {
    try {
      const storedTokens = JSON.parse(tokens) as AuthData;
      // only return the tokens if the urls match
      if (storedTokens.hassUrl === hassUrl) {
        // return the saved tokens
        return storedTokens;
      } else {
        // Delete the old token cache.
        clearTokens();
        // will force the auth method to retry
        return null;
      }
    } catch (err: unknown) {
      console.error("Error parsing stored tokens.", (err as Error)?.message || "");
      // Delete the old token cache.
      clearTokens();
      // will force the auth method to retry
      return null;
    }
  }
  // at this point, the provider might be fetching / authenticating
  return null;
}
