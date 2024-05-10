import type { HassEntity } from "home-assistant-js-websocket";

export const coverIcon = (entity: HassEntity): string => {
  const open = entity.state !== "closed";

  switch (entity.attributes.device_class) {
    case "garage":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-up-box";
        case "closing":
          return "mdi:arrow-down-box";
        case "closed":
          return "mdi:garage";
        default:
          return "mdi:garage-open";
      }
    case "gate":
      switch (entity.state) {
        case "opening":
        case "closing":
          return "mdi:gate-arrow-right";
        case "closed":
          return "mdi:gate";
        default:
          return "mdi:gate-open";
      }
    case "door":
      return open ? "mdi:door-open" : "mdi:door-closed";
    case "damper":
      return open ? "mdi:circle" : "mdi:circle-slice-8";
    case "shutter":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-up-box";
        case "closing":
          return "mdi:arrow-down-box";
        case "closed":
          return "mdi:window-shutter";
        default:
          return "mdi:window-shutter-open";
      }
    case "curtain":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-split-vertical";
        case "closing":
          return "mdi:arrow-collapse-horizontal";
        case "closed":
          return "mdi:curtains-closed";
        default:
          return "mdi:curtains";
      }
    case "blind":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-up-box";
        case "closing":
          return "mdi:arrow-down-box";
        case "closed":
          return "mdi:blinds-horizontal-closed";
        default:
          return "mdi:blinds-horizontal";
      }
    case "shade":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-up-box";
        case "closing":
          return "mdi:arrow-down-box";
        case "closed":
          return "mdi:roller-shade-closed";
        default:
          return "mdi:roller-shade";
      }
    case "window":
      switch (entity.state) {
        case "opening":
          return "mdi:arrow-up-box";
        case "closing":
          return "mdi:arrow-down-box";
        case "closed":
          return "mdi:window-closed";
        default:
          return "mdi:window-open";
      }
  }

  switch (entity.state) {
    case "opening":
      return "mdi:arrow-up-box";
    case "closing":
      return "mdi:arrow-down-box";
    case "closed":
      return "mdi:window-closed";
    default:
      return "mdi:window-open";
  }
};
