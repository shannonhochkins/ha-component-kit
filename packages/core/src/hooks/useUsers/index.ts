import { type AuthUser } from "@core";
import { useHass } from "../useHass";
import { useMemo } from "react";

export type UseUsersOptions = {
  /** Include system generated users (like internal service accounts). @default false. */
  includeSystemGenerated?: boolean;
  /** Include inactive (disabled) users. @default false. */
  includeInactiveUsers?: boolean;
};

/**
 * useUsers
 * Lightweight selector over the internal user store populated by the provider.
 * Returns a filtered array only; no loading/error states. If users have not
 * been fetched yet it will return an empty array until the store is updated.
 *
 * @example
 * const all = useUsers();
 * const includingInactive = useUsers({ includeInactiveUsers: true });
 *
 * @param options Filtering options.
 */
export function useUsers({ includeSystemGenerated = false, includeInactiveUsers = false }: UseUsersOptions = {}): AuthUser[] {
  const users = useHass((state) => state.users);
  return useMemo(
    () =>
      users.filter((user) => {
        if (!includeSystemGenerated && user.system_generated) return false;
        if (!includeInactiveUsers && !user.is_active) return false;
        return true;
      }),
    [users, includeSystemGenerated, includeInactiveUsers],
  );
}
