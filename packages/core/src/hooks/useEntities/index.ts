import type { EntityName } from "@typings";
import { type UseEntityReturnType, type  UseEntityOptions, useEntity } from "@core";

// ---------- types ----------
export type UseEntitiesReturn<T extends readonly EntityName[]> =
  { [K in keyof T]: UseEntityReturnType<T[K], UseEntityOptions> };

// ---------- hook ----------
export function useEntities<
  T extends readonly EntityName[],
  O extends UseEntityOptions = UseEntityOptions,
>(
  entities: [...T],          // tuple keeps order & length stable
  options?: O,
): UseEntitiesReturn<T> {
  // SAFE because `entities` has the same length/order on every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return entities.map((id) => useEntity(id, options)) as UseEntitiesReturn<T>;
}