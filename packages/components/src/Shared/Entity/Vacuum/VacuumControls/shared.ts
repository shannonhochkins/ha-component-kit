import { localize, type EntityName, type DomainService, type HassEntityWithService, type VacuumEntityState } from "@hakit/core";
import { ButtonBarButtonProps, VacuumControlsProps } from "@components";

type VacuumData<T> = {
  [key in VacuumEntityState | DomainService<"vacuum">]: T;
};
export const icons: VacuumData<string> = {
  start: "mdi:play",
  pause: "mdi:pause",
  stop: "mdi:stop",
  on: "mdi:play",
  off: "mdi:stop",
  paused: "mdi:pause",
  returning: "mdi:home-map-marker",
  returnToBase: "mdi:home-map-marker",
  cleanSpot: "mdi:map-marker",
  locate: "mdi:map-marker",
  cleaning: "mdi:play",
  docked: "mdi:home-map-marker",
  idle: "mdi:play",
  error: "mdi:alert",
  unknown: "mdi:alert",
};

export const getToolbarActions = ({
  entity: entity,
  shortcuts = [],
  onLocate,
}: {
  entity: HassEntityWithService<"vacuum">;
  shortcuts: VacuumControlsProps["shortcuts"];
  onLocate?: () => void;
}): Partial<ButtonBarButtonProps<EntityName>>[] => {
  const _shortcuts = shortcuts as Partial<ButtonBarButtonProps<EntityName>>[];

  switch (entity.state) {
    case "on":
    case "auto":
    case "spot":
    case "edge":
    case "single_room":
    case "mowing":
    case "edgecut":
    case "cleaning": {
      return [
        {
          title: localize("pause"),
          icon: icons["pause"],
          onClick: () => entity.service.pause(),
        },
        {
          title: localize("stop"),
          icon: icons["stop"],
          onClick: () => entity.service.stop(),
        },
        {
          title: localize("return_home"),
          icon: icons["returning"],
          onClick: () => entity.service.returnToBase(),
        },
        ..._shortcuts,
      ];
    }

    case "paused": {
      return [
        {
          title: localize("start"),
          icon: icons["on"],
          onClick: () => entity.service.start(),
        },
        {
          title: localize("stop"),
          icon: icons["stop"],
          onClick: () => entity.service.stop(),
        },
        {
          title: localize("return_home"),
          icon: icons["returning"],
          onClick: () => entity.service.returnToBase(),
        },
        ..._shortcuts,
      ];
    }

    case "returning": {
      return [
        {
          title: localize("start"),
          icon: icons["on"],
          onClick: () => entity.service.start(),
        },
        {
          title: localize("pause"),
          icon: icons["pause"],
          onClick: () => entity.service.pause(),
        },
        ..._shortcuts,
      ];
    }
    case "docked":
    case "idle":
    default: {
      const actions = [
        {
          title: localize("start"),
          icon: icons["on"],
          onClick: () => entity.service.start(),
        },
        {
          title: localize("locate"),
          icon: icons["cleanSpot"],
          onClick: () => {
            entity.service.locate();
            if (typeof onLocate === "function") {
              onLocate();
            }
          },
        },
      ];
      if (entity.state === "idle") {
        actions.push({
          title: localize("return_home"),
          icon: icons["returning"],
          onClick: () => entity.service.returnToBase(),
        });
      }
      return [...actions, ..._shortcuts];
    }
  }
};
