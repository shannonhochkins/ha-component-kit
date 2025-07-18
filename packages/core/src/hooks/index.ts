// hooks
export { useHass } from "./useHass";
export { useEntity, type UseEntityOptions, type UseEntityReturnType } from "./useEntity";
export { useEntities, type UseEntitiesReturn } from "./useEntities";
export { useService, createService } from "./useService";
export { useIconByDomain, useIcon, useIconByEntity, getIconByEntity, batteryIconByLevel } from "./useIcon";
export { useLightBrightness } from "./useLightBrightness";
export { useLightTemperature } from "./useLightTemperature";
export { useLightColor, type UseLightColorReturn } from "./useLightColor";
export { useLowDevices, type LowDevicesOptions } from "./useLowDevices";
export { useDevice, type ExtEntityRegistryEntry } from "./useDevice";
export { useHistory, type HistoryOptions } from "./useHistory";
export { coordinates, type NumericEntityHistoryState, type coordinatesMinimalResponseCompressedState } from "./useHistory/coordinates";
export { useSubscribeEntity } from "./useSubscribeEntity";
export { useLogs, type UseLogOptions } from "./useLogs";
export { useHaStatus } from "./useHaStatus";
export { useConfig } from "./useConfig";
export { useUser } from "./useUser";
export { useStore, type Store, type UseStoreHook } from "./useStore";
export { useUsers, type AuthUser, type FetchUsersArgs, type UsersState } from "./useUsers";
export { useWeather, type UseWeatherOptions, type WeatherEntityWithForecast } from "./useWeather";
export { getSupportedForecastTypes, type ForecastType, type ModernForecastType } from "./useWeather/helpers";
export * from "./useLogs/logbook";
export { useAreas, type Area } from "./useAreas";
export { localize, useLocale, useLocales, updateLocales } from "./useLocale";
export { type Locales, type LocaleKeys } from "./useLocale/locales/types";
// dynamic fetch module for locales
export { default as locales } from "./useLocale/locales";
// other subscription based models used by useAreas
export { subscribeAreaRegistry, type AreaRegistryEntry } from "./useAreas/subscribe/areas";
export { subscribeEntityRegistry, type EntityRegistryEntry } from "./useAreas/subscribe/entities";
export { subscribeDeviceRegistry, type DeviceRegistryEntry } from "./useAreas/subscribe/devices";
export { useTemplate, type TemplateParams } from "./useTemplate";
export { useCamera, type CameraEntityExtended, type UseCameraOptions } from "./useCamera";
export * from "./useCamera/constants";
