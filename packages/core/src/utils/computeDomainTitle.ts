import { EntityName, LocaleKeys } from "@typings";
import { computeDomain } from "./computeDomain";
import { lowerCase, startCase } from "lodash";
import { localize } from "../hooks/useLocale";

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
    case "tts":
      return localize("tts");
    case "homeassistant":
      return localize("homeassistant");
    case "lawn_mower":
      return localize("lawn_mower_commands.label");
    case "datetime":
      return localize("datetime.name");
    case "alert":
      return localize("alert_classes");
    case "water_heater":
      return `${localize("water")} ${localize("heat")}`;
    case "logbook":
      return localize("activity");
    case "stt":
    case "google":
    case "reolink":
    case "notify":
    case "zha":
    case "vacuum":
      return startCase(lowerCase(domain));
    case "input_select":
    case "recorder":
    case "conversation":
    case "rest_command":
    case "cloud":
    case "hassio":
    case "frontend":
    case "file":
    case "profiler":
    case "onvif":
    case "system_log":
    case "media_extractor":
    case "command_line":
    case "device_tracker":
    case "sun":
    case "weather":
    case "timer":
    case "counter":
    case "automation":
    case "media_player":
    case "input_number":
    case "binary_sensor":
    case "persistent_notification":
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
