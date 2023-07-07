import type { HassEntity } from "home-assistant-js-websocket";

export interface HassEntityCustom extends HassEntity {
  custom: {
    /** the difference in time between the last updated value and now, eg "1 minute ago, 1 day ago etc, 5 days from now" */
    relativeTime: string;
    /** if the last updated value was considered "now" */
    active: boolean;
    /** the hexColor value if the entity is a light */
    hexColor: string | null;
    /** brightness css value of the light ranging from 0-100 */
    brightness: string | null;
    /** the rgba color with 35% alpha */
    rgbaColor: string | null;
    /** the rgb color */
    rgbColor: string | null;
  };
}

export type * from "./supported-services";
