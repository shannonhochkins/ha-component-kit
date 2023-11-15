import { useMemo } from "react";
import { Icon as IconElement } from "@iconify/react";
import type { IconProps } from "@iconify/react";
import { useEntity, computeDomain, AllDomains, CamelToSnake, EntityName } from "@core";
import { snakeCase } from "lodash";
import { HassEntity } from "home-assistant-js-websocket";

import { binarySensorIcon } from "./domains/binary_sensor";
import { sensorIcon } from "./domains/sensor";
import { numberIcon } from "./domains/number";
import { coverIcon } from "./domains/cover";
import { alarmPanelIcon } from "./domains/alarm";
import { weatherIcon } from "./domains/weather";
import { FIXED_DOMAIN_ICONS } from "./domains/constants";

export function useIconByDomain<D extends AllDomains | CamelToSnake<AllDomains> | "unknown">(
  domain: D,
  iconProps?: Omit<IconProps, "icon">,
) {
  const iconName = useMemo(() => {
    const convertedDomainName = snakeCase(domain) as keyof typeof FIXED_DOMAIN_ICONS;
    if (FIXED_DOMAIN_ICONS[convertedDomainName]) {
      return FIXED_DOMAIN_ICONS[convertedDomainName];
    }
    // If the domain does not match any case, we just return an info icon
    return "mdi:information-outline";
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

export function getIconByEntity(domain: string, entity: HassEntity): string | undefined {
  const compareState = entity.state;

  switch (domain) {
    case "alarm_control_panel":
      return alarmPanelIcon(compareState);

    case "automation":
      return compareState === "unavailable" ? "mdi:robot-confused" : compareState === "off" ? "mdi:robot-off" : "mdi:robot";

    case "binary_sensor":
      return binarySensorIcon(entity);

    case "button":
      switch (entity.attributes.device_class) {
        case "identify":
          return "mdi:crosshairs-question";
        case "restart":
          return "mdi:restart";
        case "update":
          return "mdi:package-up";
        default:
          return "mdi:button-pointer";
      }

    case "camera":
      return compareState === "off" ? "mdi:video-off" : "mdi:video";

    case "cover":
      return coverIcon(entity);

    case "device_tracker":
      if (entity.attributes.source_type === "router") {
        return compareState === "home" ? "mdi:lan-connect" : "mdi:lan-disconnect";
      }
      if (["bluetooth", "bluetooth_le"].includes(entity.attributes.source_type)) {
        return compareState === "home" ? "mdi:bluetooth-connect" : "mdi:bluetooth";
      }
      return compareState === "not_home" ? "mdi:account-arrow-right" : "mdi:account";

    case "event":
      switch (entity.attributes.device_class) {
        case "doorbell":
          return "mdi:doorbell";
        case "button":
          return "mdi:gesture-tap-button";
        case "motion":
          return "mdi:motion-sensor";
        default:
          return "mdi:eye-check";
      }

    case "fan":
      return compareState === "off" ? "mdi:fan-off" : "mdi:fan";

    case "humidifier":
      return compareState === "off" ? "mdi:air-humidifier-off" : "mdi:air-humidifier";

    case "input_boolean":
      return compareState === "on" ? "mdi:check-circle-outline" : "mdi:close-circle-outline";

    case "input_datetime":
      if (!entity.attributes.has_date) {
        return "mdi:clock";
      }
      if (!entity.attributes.has_time) {
        return "mdi:calendar";
      }
      break;

    case "lock":
      switch (compareState) {
        case "unlocked":
          return "mdi:lock-open";
        case "jammed":
          return "mdi:lock-alert";
        case "locking":
        case "unlocking":
          return "mdi:lock-clock";
        default:
          return "mdi:lock";
      }

    case "media_player":
      switch (entity.attributes.device_class) {
        case "speaker":
          switch (compareState) {
            case "playing":
              return "mdi:speaker-play";
            case "paused":
              return "mdi:speaker-pause";
            case "off":
              return "mdi:speaker-off";
            default:
              return "mdi:speaker";
          }
        case "tv":
          switch (compareState) {
            case "playing":
              return "mdi:television-play";
            case "paused":
              return "mdi:television-pause";
            case "off":
              return "mdi:television-off";
            default:
              return "mdi:television";
          }
        case "receiver":
          switch (compareState) {
            case "off":
              return "mdi:audio-video-off";
            default:
              return "mdi:audio-video";
          }
        default:
          switch (compareState) {
            case "playing":
            case "paused":
              return "mdi:cast-connected";
            case "off":
              return "mdi:cast-off";
            default:
              return "mdi:cast";
          }
      }

    case "number": {
      const icon = numberIcon(entity);
      if (icon) {
        return icon;
      }

      break;
    }

    case "person":
      return compareState === "not_home" ? "mdi:account-arrow-right" : "mdi:account";

    case "switch":
      switch (entity.attributes.device_class) {
        case "outlet":
          return compareState === "on" ? "mdi:power-plug" : "mdi:power-plug-off";
        case "switch":
          return compareState === "on" ? "mdi:toggle-switch-variant" : "mdi:toggle-switch-variant-off";
        default:
          return "mdi:toggle-switch-variant";
      }

    case "sensor": {
      const icon = sensorIcon(entity);
      if (icon) {
        return icon;
      }
      break;
    }

    case "sun":
      return entity.state === "above_horizon" ? "mdi:white-balance-sunny" : "mdi:weather-night";

    case "switch_as_x":
      return "mdi:swap-horizontal";

    case "threshold":
      return "mdi:chart-sankey";

    case "update":
      return "mdi:package";
    case "water_heater":
      return compareState === "off" ? "mdi:water-boiler-off" : "mdi:water-boiler";

    case "weather":
      return weatherIcon(entity.state);
  }

  if (domain in FIXED_DOMAIN_ICONS) {
    return FIXED_DOMAIN_ICONS[domain as keyof typeof FIXED_DOMAIN_ICONS];
  }

  return undefined;
}

export function useIconByEntity<E extends EntityName>(_entity: E, iconProps?: Omit<IconProps, "icon">) {
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const Icon = useMemo(() => {
    if (entity === null) return null;
    const icon = entity.attributes.icon ?? getIconByEntity(computeDomain(_entity), entity);
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
  }, [entity, _entity, iconProps]);
  return Icon;
}
