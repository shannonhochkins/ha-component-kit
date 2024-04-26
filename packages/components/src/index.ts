import "./.d.ts";
/// <reference path=".d.ts" />
export {
  getBreakpoints,
  mq,
  getColumnSizeCSS,
  generateColumnBreakpoints,
  type AvailableQueries,
  type BreakPoint,
  type BreakPoints,
  type GridSpan,
} from "./ThemeProvider/breakpoints";
// media query helpers
export { useBreakpoint } from "./hooks/useBreakpoint";
// the base card component
export { CardBase, type CardBaseProps } from "./Cards/CardBase";
// tooltip
export { Tooltip, type TooltipProps } from "./Shared/Tooltip";
// tooltip
export { RangeSlider, type RangeSliderProps } from "./Shared/RangeSlider";
// Ripples
export { Ripples, type RipplesProps } from "./Shared/Ripples";
// Row
export { Row, type RowProps } from "./Shared/Row";
// column
export { Column, type ColumnProps } from "./Shared/Column";
// ErrorBoundary fallback
export { fallback } from "./Shared/ErrorBoundary";
// ButtonCard
export { ButtonCard, type ButtonCardProps } from "./Cards/ButtonCard";
// TriggerCard
export { TriggerCard, type TriggerCardProps } from "./Cards/TriggerCard";
// svg graph
export { SvgGraph, type SvgGraphProps } from "./Shared/SvgGraph";
// SensorCard
export { SensorCard, type SensorCardProps } from "./Cards/SensorCard";
// Group
export { Group, type GroupProps } from "./Group";
// WeatherCard
export { WeatherCard, type WeatherCardProps } from "./Cards/WeatherCard";
// WeatherCardHelpers
export { getAdditionalWeatherInformation } from "./Cards/WeatherCard/helpers";
// WeatherCardDetail
export { WeatherCardDetail, type WeatherCardDetailProps } from "./Cards/WeatherCard/WeatherCardDetail";
// GarbageCollectionCard
export { GarbageCollectionCard, type GarbageCollectionCardProps, type GarbageCollectionCardTypes } from "./Cards/GarbageCollectionCard";
// TimeCard
export { TimeCard, type TimeCardProps } from "./Cards/TimeCard";
// AreaCard
export { AreaCard, type AreaCardProps } from "./Cards/AreaCard";
// ts-ignore
import { AreaCard as ActualAreaCard, type AreaCardProps as ActualAreaCardProps } from "./Cards/AreaCard";

/**
 * @deprecated RoomCard has been renamed to AreaCard. Please use {@link AreaCard} instead.
 */
export const RoomCard = ActualAreaCard;
/**
 * @deprecated RoomCardProps has been renamed to AreaCardProps. Please use {@link AreaCardProps} instead.
 */
export type RoomCardProps = ActualAreaCardProps;
// picture card
export { PictureCard, type PictureCardProps } from "./Cards/PictureCard";
// FabCard
export { FabCard, type FabCardProps } from "./Cards/FabCard";
// FamilyCard
export { FamilyCard, type FamilyCardProps } from "./Cards/FamilyCard";
// PersonCard
export { PersonCard, UserAvatar, type PersonCardProps, type UserAvatarProps } from "./Cards/FamilyCard/PersonCard";
// SidebarCard
export { SidebarCard, type SidebarCardProps } from "./Cards/SidebarCard";
// ClimateControls
export { ClimateControls, type ClimateControlsProps } from "./Shared/Entity/Climate/ClimateControls";
export { ClimateControlSlider, type ClimateControlSliderProps } from "./Shared/Entity/Climate/ClimateControls/ClimateControlSlider";
export { ClimateHumiditySlider, type ClimateHumiditySliderProps } from "./Shared/Entity/Climate/ClimateControls/ClimateHumiditySlider";
export * from "./Shared/Entity/Climate/ClimateControls/data";
// LightControls
export { LightControls, type LightControlsProps } from "./Shared/Entity/Light/LightControls";
// CoverControls
export { CoverControls, type CoverControlsProps } from "./Shared/Entity/Cover/CoverControls";
// SwitchControls
export { SwitchControls, type SwitchControlsProps } from "./Shared/Entity/Switch/SwitchControls";
// MediaPlayerControls
export { MediaPlayerControls, type MediaPlayerControlsProps } from "./Shared/Entity/MediaPlayer/MediaPlayerControls";
// PersonControls
export { PersonControls, type PersonControlsProps } from "./Shared/Entity/Person/PersonControls";
// ClimateCard
export { ClimateCard, type ClimateCardProps } from "./Cards/ClimateCard";
// EntitiesCard
export { EntitiesCard, type EntitiesCardProps } from "./Cards/EntitiesCard";
// EntitiesCardRow
export { EntitiesCardRow, type EntitiesCardRowProps } from "./Cards/EntitiesCard/EntitiesCardRow";
// MediaPlayerCard
export { MediaPlayerCard, type MediaPlayerCardProps } from "./Cards/MediaPlayerCard";
// MediaPlayerShared
export { PlaybackControls, type PlaybackControlsProps } from "./Cards/MediaPlayerCard/PlaybackControls";
export { VolumeControls, type VolumeControlsProps } from "./Cards/MediaPlayerCard/VolumeControls";
// CalendarCard
export { CalendarCard, type CalendarCardProps } from "./Cards/CalendarCard";
// ButtonBar
export { ButtonBar, type ButtonBarProps } from "./Shared/Entity/Miscellaneous/ButtonBar";
// ButtonBarButton
export { ButtonBarButton, type ButtonBarButtonProps } from "./Shared/Entity/Miscellaneous/ButtonBar/ButtonBarButton";
// ButtonGroup
export { ButtonGroup, type ButtonGroupProps } from "./Shared/Entity/Miscellaneous/ButtonGroup";
// ButtonGroupButton
export { ButtonGroupButton, type ButtonGroupButtonProps } from "./Shared/Entity/Miscellaneous/ButtonGroup/ButtonGroupButton";
// CameraCard
export { CameraCard, type CameraCardProps } from "./Cards/CameraCard";
export type { VideoState } from "./Cards/CameraCard/players";
export { CameraStream, type CameraStreamProps } from "./Cards/CameraCard/stream";
// Modal
export { LogBookRenderer, type LogBookRendererProps } from "./Shared/Entity/Miscellaneous/LogBookRenderer";
export { Modal, type ModalProps } from "./Shared/Modal";
export { ModalByEntityDomain, type ModalByEntityDomainProps, type ModalPropsHelper } from "./Shared/Modal/ModalByEntityDomain";
export { ModalCameraControls, type ModalCameraControlsProps } from "./Shared/Modal/ModalByEntityDomain/Camera";
export { ModalClimateControls, type ModalClimateControlsProps } from "./Shared/Modal/ModalByEntityDomain/Climate";
export { ModalCoverControls, type ModalCoverControlsProps } from "./Shared/Modal/ModalByEntityDomain/Cover";
export { ModalLightControls, type ModalLightControlsProps } from "./Shared/Modal/ModalByEntityDomain/Light";
export { ModalMediaPlayerControls, type ModalMediaPlayerControlsProps } from "./Shared/Modal/ModalByEntityDomain/MediaPlayer";
export { ModalPersonControls, type ModalPersonControlsProps } from "./Shared/Modal/ModalByEntityDomain/Person";
export { ModalSwitchControls, type ModalSwitchControlsProps } from "./Shared/Modal/ModalByEntityDomain/Switch";
export { ModalWeatherControls, type ModalWeatherControlsProps } from "./Shared/Modal/ModalByEntityDomain/Weather";
// ControlSlider
export { ControlSlider, type ControlSliderProps } from "./Shared/ControlSlider";
// ControlToggle
export { ControlToggle, type ControlToggleProps } from "./Shared/ControlToggle";
// ControlSliderCircular
export { ControlSliderCircular, type ControlCircularSliderMode, type ControlSliderCircularProps } from "./Shared/ControlSliderCircular";
// Menu
export { Menu, type MenuProps } from "./Shared/Menu";
// ColorTempPicker
export { ColorTempPicker, type ColorTempPickerProps } from "./Shared/Entity/Light/ColorTempPicker";
// ColorPicker
export { ColorPicker, type ColorPickerOutputColors, type ColorPickerProps } from "./Shared/Entity/Light/ColorPicker";
// EntityAttributes
export { EntityAttributes, type EntityAttributesProps } from "./Shared/Entity/Miscellaneous/EntityAttributes";
// ImagePreloader
export { PreloadImage, type PreloadImageProps } from "./Shared/PreloadImage";
// Alert
export { Alert, type AlertProps } from "./Shared/Alert";

// ThemeProvider
export { ThemeProvider, type ThemeProviderProps } from "./ThemeProvider";
export * from "./ThemeProvider/constants";
export { theme } from "./ThemeProvider/theme";
