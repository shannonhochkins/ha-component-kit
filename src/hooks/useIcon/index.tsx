import { useMemo } from "react";
import styled from "@emotion/styled";
import { Icon, IconProps } from "@iconify/react";
import type { DomainName } from "@typings/supported-services";

// eslint-disable-next-line react-refresh/only-export-components
const StyledIcon = styled(Icon)`
  font-size: 24px;
`;

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${value}`);
}

export function useIconByDomain<D extends DomainName>(
  domain: D,
  iconProps?: IconProps
) {
  const iconName = useMemo(() => {
    switch (domain) {
      case "light":
        return "octicon:light-bulb-24";
      case "automation":
      case "nodered":
        return "fad:automation-4p";
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
      case "localtuya":
        return "radix-icons:button";
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
      case "samsungtvSmart":
      case "ffmpeg":
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
      case "deconz":
      case "profiler":
      case "wakeOnLan":
      case "mqtt":
      case "tplink":
      case "deviceTracker":
        return "octicon:info-24";
      case "ring":
        return "simple-icons:ring";

      // Add more cases for other domains and their respective icons if needed

      default:
        // If the domain does not match any case, we just return an info icon
        return assertNever(domain);
    }
  }, [domain]);
  if (iconName === null) {
    return null;
  }
  return <StyledIcon {...iconProps} icon={iconProps?.icon || iconName} />;
}

export function useIcon(icon: string | null, iconProps?: IconProps) {
  const Icon = useMemo(() => {
    if (icon === null) return null;
    return (
      <StyledIcon
        {...iconProps}
        icon={iconProps?.icon || icon || "octicon:info-24"}
      />
    );
  }, [icon, iconProps]);
  return Icon;
}
