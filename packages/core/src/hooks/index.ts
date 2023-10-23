// hooks
export { useHass } from "./useHass";
export { useEntity } from "./useEntity";
// Import useService from its location
import { useService as NewUseApi } from "./useService";
/**
 * @deprecated useApi has been renamed to useService. Please use {@link useService} instead.
 */
export const useApi = NewUseApi;
export { useService, createService } from "./useService";
export { useIconByDomain, useIcon, useIconByEntity } from "./useIcon";
export { useHash } from "./useHash";
export { useLightBrightness } from "./useLightBrightness";
export { useLightTemperature } from "./useLightTemperature";
export { useLightColor } from "./useLightColor";
export { useLowDevices } from "./useLowDevices";
export type { LowDevicesOptions } from "./useLowDevices";
export { useHistory } from "./useHistory";
export type { HistoryOptions } from "./useHistory";
export { useSubscribeEntity } from "./useSubscribeEntity";

export { useAreas } from "./useAreas";
export type { Area } from "./useAreas";
// other subscription based models used by useAreas
export { subscribeAreaRegistry } from "./useAreas/subscribe/areas";
export { subscribeEntityRegistry } from "./useAreas/subscribe/entities";
export { subscribeDeviceRegistry } from "./useAreas/subscribe/devices";
export type { AreaRegistryEntry } from "./useAreas/subscribe/areas";
export type { EntityRegistryEntry } from "./useAreas/subscribe/entities";
export type { DeviceRegistryEntry } from "./useAreas/subscribe/devices";
