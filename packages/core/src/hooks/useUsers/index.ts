import { useHass } from "../useHass";
import { useCallback, useEffect, useRef, useState } from "react";

type UsersState = {
  loading: boolean;
  error: string | null;
  users: AuthUser[];
};

export type AuthUser = {
  id: string;
  name: string;
  /** If the user is active or not */
  is_active: boolean;
  /** Whether this user is the owner of the Home Assistant instance */
  is_owner: boolean;
  /** The credentials this user has access to */
  credentials: {
    type: string;
  }[];
  /** The group ids the user belongs to */
  group_ids: string[];
  /** Whether this user is system generated */
  system_generated?: boolean;
  /** The username of the current user */
  username?: string;
};

export type FetchUsersArgs = {
  /** include system generated users in the user list @default false */
  includeSystemGenerated?: boolean;
  /** include inactive users in the user list @default false */
  includeInactiveUsers?: boolean;
};

export function useUsers(args?: FetchUsersArgs): UsersState & {
  /** Manually trigger a refresh.
   *  Resolves with the same shape it returns from the hook. */
  refetch: (args?: FetchUsersArgs) => Promise<UsersState>;
} {
  const { useStore } = useHass();
  const hasFetchedOnce = useRef(false);
  const connection = useStore((state) => state.connection);

  const [state, setState] = useState<UsersState>({
    loading: true,
    error: null,
    users: [],
  });

  /** Shared fetcher used both on-mount and by `refetch` */
  const fetchUsers = useCallback(
    async ({ includeSystemGenerated = false, includeInactiveUsers = false }: FetchUsersArgs = {}): Promise<UsersState> => {
      if (!connection) {
        // nothing to do – return current state so the Promise always resolves
        return state;
      }
      hasFetchedOnce.current = true;

      // Flip the spinner on – keep previous users around so lists don’t flash empty
      setState((prev) => ({ ...prev, error: null, loading: true }));

      try {
        const users = await connection.sendMessagePromise<AuthUser[]>({
          type: "config/auth/list",
        });

        const filteredUser = users.filter((user) => {
          if (!includeSystemGenerated && user.system_generated) {
            return false;
          }
          if (!includeInactiveUsers && !user.is_active) {
            return false;
          }
          return true;
        });

        const nextState = { loading: false, error: null, users: filteredUser };
        setState(nextState);
        return nextState;
      } catch (e) {
        // Could add toast / logger here if you like
        const nextState = { loading: false, error: e instanceof Error ? e.message : "Unknown error", users: [] };
        setState(nextState);
        return nextState;
      }
    },
    [connection, state],
  );

  /* Initial load – runs only when a usable connection appears */
  useEffect(() => {
    if (connection && !hasFetchedOnce.current) fetchUsers(args);
  }, [connection, fetchUsers, args]);

  return {
    ...state,
    refetch: fetchUsers,
  };
}
