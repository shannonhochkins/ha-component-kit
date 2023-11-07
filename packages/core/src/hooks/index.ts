// hooks
export { useHass } from "./useHass";
export { useEntity } from "./useEntity";
// Import useService from its location
import { useService as useServiceActual } from "./useService";
/**
 * @deprecated useApi has been renamed to useService. Please use {@link useService} instead.
 */
export const useApi = useServiceActual;
export { useService, createService } from "./useService";
export { useIconByDomain, useIcon, useIconByEntity } from "./useIcon";
export { useLightBrightness } from "./useLightBrightness";
export { useLightTemperature } from "./useLightTemperature";
export { useLightColor } from "./useLightColor";
export { useLowDevices, type LowDevicesOptions } from "./useLowDevices";
export { useHistory, type HistoryOptions } from "./useHistory";
export { useSubscribeEntity } from "./useSubscribeEntity";
export { useLogs, type UseLogOptions } from "./useLogs";
export { useWeather, type UseWeatherOptions } from "./useWeather";
export { getSupportedForecastTypes, type ForecastType, type ModernForecastType } from "./useWeather/helpers";
export * from "./useLogs/logbook";
export { useAreas, type Area } from "./useAreas";
// other subscription based models used by useAreas
export { subscribeAreaRegistry, type AreaRegistryEntry } from "./useAreas/subscribe/areas";
export { subscribeEntityRegistry, type EntityRegistryEntry } from "./useAreas/subscribe/entities";
export { subscribeDeviceRegistry, type DeviceRegistryEntry } from "./useAreas/subscribe/devices";
export { useCamera, type CameraEntityExtended, type UseCameraOptions } from "./useCamera";
export * from "./useCamera/constants";
