import { EntityName, LocaleKeys } from "@typings";
import { computeDomain } from "./computeDomain";
import { lowerCase, startCase } from "lodash";
import { localize } from "../hooks/useLocale";

/**
 * @description - Compute a localized title for a given entity domain, with special handling for certain domains and device classes.
 * @param entityId - The entity ID to compute the domain title for.
 * @param deviceClass - A device class if needed to compute outlet vs switch titles.
 * @returns
 */
export const computeDomainTitle = <E extends EntityName | "unknown">(entityId: E, deviceClass?: string): string => {
  const domain = computeDomain(entityId);
  // add in switches for different domains
  switch (domain) {
    case "plant":
      return localize("plant_status");
    case "switch": {
      if (deviceClass && deviceClass === "outlet") {
        return localize("outlet");
      }
      return localize("switch");
    }
    case "alarm_control_panel":
      return localize("alarm_panel");
    case "lawn_mower":
      return localize("lawn_mower_commands");
    case "datetime":
      return localize("date_time");
    case "alert":
      return localize("alert_classes");
    case "water_heater":
      return `${localize("water")} ${localize("heat")}`;
    case "logbook":
      return localize("activity");
    case "homeassistant":
      return localize("home_assistant");
    // exact matches
    case "weather":
    case "sun":
    case "binary_sensor":
    case "timer":
    case "counter":
    case "automation":
    case "input_select":
    case "device_tracker":
    case "media_player":
    case "input_number":
      return localize(domain);
    case "stt":
    case "google":
    case "reolink":
    case "notify":
    case "zha":
    case "vacuum":
      return startCase(lowerCase(domain));
    case "frontend":
    case "conversation":
    case "hassio":
    case "command_line":
    case "onvif":
    case "rest_command":
    case "system_log":
    case "media_extractor":
    case "file":
    case "persistent_notification":
    case "cloud":
    case "profiler":
    case "recorder":
    case "logger":
    case "tts":
    case "backup":
    case "climate":
      return localize(`${domain}.title`);
    default: {
      const localized = localize(domain, {
        // just try to process with the title suffix
        fallback: localize(`${domain}.title` as LocaleKeys, {
          fallback: domain,
        }),
      });
      if (localized === domain) {
        return startCase(lowerCase(domain));
      }
      return localized;
    }
  }
};
