import { useMemo } from "react";
import { Icon as IconElement } from "@iconify/react";
import type { IconProps } from "@iconify/react";
import type { AllDomains, CamelToSnake, SnakeToCamel, EntityName } from "@typings";
import { useEntity } from "@core";
import { camelCase } from "lodash";

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${value}`);
}

export function useIconByDomain<D extends AllDomains | CamelToSnake<AllDomains> | "unknown">(
  domain: D,
  iconProps?: Omit<IconProps, "icon">,
) {
  const iconName = useMemo(() => {
    const convertedDomainName = camelCase(domain) as SnakeToCamel<AllDomains> | "unknown";
    switch (convertedDomainName) {
      case "light":
        return "octicon:light-bulb-24";
      case "automation":
      case "button":
      case "inputButton":
        return "teenyicons:button-outline";
      case "camera":
      case "recorder":
        return "solar:camera-broken";
      case "number":
      case "counter":
      case "inputNumber":
        return "octicon:number-24";
      case "persistentNotification":
        return "ph:notification";
      case "homeassistant":
      case "hassio":
        return "mdi:home-assistant";
      case "script":
      case "restCommand":
      case "commandLine":
        return "carbon:script";
      case "select":
      case "inputSelect":
        return "vaadin:list-select";
      case "systemLog":
      case "logger":
      case "template":
      case "logbook":
        return "icon-park-outline:log";
      case "switch":
      case "text":
      case "schedule":
      case "conversation":
      case "inputText":
        return "mdi:text";
      case "group":
        return "formkit:group";
      case "person":
        return "akar-icons:person";
      case "frontend":
      case "scene":
        return "material-symbols:computer-outline";
      case "cloud":
      case "tts":
        return "solar:cloud-broken";
      case "update":
        return "material-symbols:work-update-outline";
      case "zone":
        return "ps:dzone";
      case "cover":
        return "material-symbols:blinds";
      case "inputDatetime":
      case "timer":
      case "alarmControlPanel":
      case "siren":
      case "notify":
        return "clarity:date-line";
      case "inputBoolean":
        return "radix-icons:component-boolean";
      case "climate":
        return "mdi:home-climate-outline";
      case "mediaPlayer":
      case "cast":
        return "solar:tv-broken";
      case "lock":
        return "material-symbols:lock-outline";
      case "fan":
        return "ph:fan";
      case "remote":
        return "ri:remote-control-line";
      case "vacuum":
        return "solar:smart-vacuum-cleaner-broken";
      case "humidifier":
        return "mdi:air-humidifier";
      // un-categorized
      case "profiler":
      case "deviceTracker":
        return "octicon:info-24";
      case "unknown":
        return "octicon:question-24";
      case "sun":
        return "ph:sun-light";
      case "sensor":
        return "icons8:sensor";
      case "weather":
        return "gis:weather-map";
      case "binarySensor":
      case "stt":
        return "mdi:radar";
      case "waterHeater":
        return "mdi:water-boiler";
      case "lawnMower":
        return "mdi:robot-mower";
      case "calendar":
        return "mdi:calendar";
      case "google":
        return "mdi:google";

      // Add more cases for other domains and their respective icons if needed

      default:
        // If the domain does not match any case, we just return an info icon
        return assertNever(convertedDomainName);
    }
  }, [domain]);
  if (iconName === null) {
    return null;
  }
  return (
    <IconElement
      style={{
        fontSize: iconProps?.fontSize ?? "24px",
      }}
      icon={iconName}
      {...iconProps}
    />
  );
}

export function useIcon(icon: string | null, iconProps?: Omit<IconProps, "icon">) {
  const Icon = useMemo(() => {
    if (icon === null) return null;
    return (
      <IconElement
        style={{
          fontSize: iconProps?.fontSize ?? "24px",
        }}
        icon={icon || "octicon:info-24"}
        {...iconProps}
      />
    );
  }, [icon, iconProps]);
  return Icon;
}

export function useIconByEntity<E extends EntityName>(_entity: E, iconProps?: Omit<IconProps, "icon">) {
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const Icon = useMemo(() => {
    if (entity === null) return null;
    const icon = entity.attributes.icon;
    if (!icon) {
      return null;
    }
    return (
      <IconElement
        style={{
          fontSize: iconProps?.fontSize ?? "24px",
        }}
        icon={icon}
        {...iconProps}
      />
    );
  }, [iconProps, entity]);
  return Icon;
}
