export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

import type { Connection } from "home-assistant-js-websocket";
import { getCollection, getUser } from "home-assistant-js-websocket";

// -----------------------------
// Users list subscription (one-shot fetch)
// -----------------------------
// Home Assistant currently exposes a one-time fetch for the full users list via
// the websocket command `config/auth/list`. There is no push event for user list
// changes, so we implement a simple helper that fetches once and invokes the
// callback. The returned function is a no-op unsubscribe for symmetry with other
// subscribe* utilities.

export interface AuthUser {
  id: string;
  name: string;
  is_active: boolean;
  is_owner: boolean;
  credentials: { type: string }[];
  group_ids: string[];
  system_generated?: boolean;
  username?: string;
}

export interface FetchUsersArgs {
  includeSystemGenerated?: boolean; // default false
  includeInactiveUsers?: boolean; // default false
}

/** Fetch all users then apply optional filtering. */
const fetchUsers = async (
  conn: Connection,
  { includeSystemGenerated = false, includeInactiveUsers = false }: FetchUsersArgs = {},
): Promise<AuthUser[]> => {
  const users = await conn.sendMessagePromise<AuthUser[]>({ type: "config/auth/list" });
  return users.filter((user) => {
    if (!includeSystemGenerated && user.system_generated) return false;
    if (!includeInactiveUsers && !user.is_active) return false;
    return true;
  });
};

/**
 * Subscribe to (fetch once) the list of users. Returns an unsubscribe no-op.
 * If you need periodic refresh, wrap this in a polling interval externally.
 */
export const subscribeUsers = (conn: Connection, onChange: (users: AuthUser[]) => void, args?: FetchUsersArgs): (() => void) => {
  fetchUsers(conn, args)
    .then(onChange)
    .catch((e) => {
      console.warn("subscribeUsers: failed to fetch users", e);
      onChange([]);
    });
  return () => {
    // No persistent subscription to clean up.
  };
};

export const userCollection = (conn: Connection) => getCollection(conn, "_usr", () => getUser(conn) as Promise<CurrentUser>, undefined);

export const subscribeUser = (conn: Connection, onChange: (user: CurrentUser) => void) => userCollection(conn).subscribe(onChange);
