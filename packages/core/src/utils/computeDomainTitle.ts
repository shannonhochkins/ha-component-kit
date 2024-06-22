import { EntityName } from "@typings";
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
      return localize("text_to_speech");
    case "cloud":
      return localize("home_assistant_cloud");
    case "hassio":
      return localize("home_assistant") + " IO";
    case "frontend":
      return localize("home_assistant_frontend");
    case "homeassistant":
      return localize("home_assistant");
    case "lawn_mower":
      return localize("lawn_mower_commands");
    case "rest_command":
      return localize("restful_command");
    case "history_stats":
      return localize("history");
    case "persistent_notification":
      return localize("persistent_notification");
    case "binary_sensor":
      return localize("binary_sensor");
    case "datetime":
      return localize("date_time");
    case "alert":
      return localize("alert_classes");
    case "water_heater":
      return `${localize("water")} ${localize("aux_heat")}`;
    case "stt":
    case "google":
    case "reolink":
    case "notify":
    case "vacuum":
      return startCase(lowerCase(domain));
    default: {
      const localized = localize(domain);
      if (localized === domain) {
        return startCase(lowerCase(domain));
      }
      return localized;
    }
  }
};
