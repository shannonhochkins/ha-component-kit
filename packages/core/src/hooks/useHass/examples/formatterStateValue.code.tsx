import { useEntity, useHass } from "@hakit/core";

/**
 * Formatter State & Attribute Helpers
 *
 * The `formatter` object converts raw entity state & attributes into localized, human friendly strings.
 *
 * Methods:
 * - `stateValue(entity)` → string | ''
 *   - Applies unit localization, numeric formatting, domain heuristics (e.g. lights brightness, climate temperature, binary sensors, etc).
 *   - Returns an empty string if locale/config not loaded yet.
 * - `attributeValue(entity, attribute)` → string | ''
 *   - Same pipeline but for a specific attribute; auto-appends units (°C, kWh, %, etc.) where appropriate.
 *   - Returns an empty string if locale/config not loaded yet.
 *
 * Fallback behavior:
 * - Until `locale` & `config` load, formatter methods return an empty string.
 * - Date helpers (see formatterDates.code.tsx) fall back to browser Intl if not ready.
 *
 * See also: formatterDates.code.tsx for date/time helpers.
 */
// Display a formatted state and a couple of formatted attributes.
export function FormatterStateValueExample() {
  const entity = useEntity("light.living_room");
  const formatter = useHass.getState().formatter;
  const stateText = formatter.stateValue(entity);
  const battery = formatter.attributeValue(entity, "battery_level");
  const lastChanged = formatter.formatShortDateTime(entity.last_changed);
  return (
    <div>
      <h4>{entity.entity_id}</h4>
      <p>State: {stateText}</p>
      <p>Battery: {battery}</p>
      <p>Last Changed: {lastChanged}</p>
    </div>
  );
}
