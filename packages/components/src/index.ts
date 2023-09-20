// media query helpers
export { useDevice } from "./hooks/useDevice";
export { mq } from "./hooks/mq";
// tooltip
export { Tooltip } from "./Shared/Tooltip";
export type { TooltipProps } from "./Shared/Tooltip";
// tooltip
export { RangeSlider } from "./Shared/RangeSlider";
export type { RangeSliderProps } from "./Shared/RangeSlider";
// Ripples
export { Ripples } from "./Shared/Ripples";
export type { RipplesProps } from "./Shared/Ripples";
// Row
export { Row } from "./Shared/Row";
export type { RowProps } from "./Shared/Row";
// column
export { Column } from "./Shared/Column";
export type { ColumnProps } from "./Shared/Column";
// these imports can be removed when we drop support for SceneCard
import { TriggerCard } from "./Cards/TriggerCard";
import type { TriggerCardProps } from "./Cards/TriggerCard";
import type { EntityName } from "@hakit/core";
// ErorrBoundary fallback
export { fallback } from "./Shared/ErrorBoundary";
// ButtonCard
export { ButtonCard } from "./Cards/ButtonCard";
export type { ButtonCardProps } from "./Cards/ButtonCard";
// TriggerCard
export { TriggerCard } from "./Cards/TriggerCard";
export type { TriggerCardProps } from "./Cards/TriggerCard";
/**
 * @deprecated SceneCardProps is deprecated and will be removed in future versions. Use TriggerCardProps instead.
 */
export type SceneCardProps<E extends EntityName> = TriggerCardProps<E>;

/**
 * @deprecated SceneCard is deprecated and will be removed in future versions. Use TriggerCard instead.
 */
export const SceneCard = TriggerCard;
// Group
export { Group } from "./Group";
export type { GroupProps } from "./Group";
// WeatherCard
export { WeatherCard } from "./Cards/WeatherCard";
export type { WeatherCardProps } from "./Cards/WeatherCard";
export { GarbageCollectionCard } from "./Cards/GarbageCollectionCard";
export type { GarbageCollectionCardProps } from "./Cards/GarbageCollectionCard";
// TimeCard
export { TimeCard } from "./Cards/TimeCard";
export type { TimeCardProps } from "./Cards/TimeCard";
// RoomCard
export { RoomCard } from "./Cards/RoomCard";
export type { RoomCardProps } from "./Cards/RoomCard";
// picture card
export { PictureCard } from "./Cards/PictureCard";
export type { PictureCardProps } from "./Cards/PictureCard";
// FabCard
export { FabCard } from "./Cards/FabCard";
export type { FabCardProps } from "./Cards/FabCard";
// SidebarCard
export { SidebarCard } from "./Cards/SidebarCard";
export type { SidebarCardProps } from "./Cards/SidebarCard";
// ClimateControls
export { ClimateControls } from "./Shared/ClimateControls";
export type { ClimateControlsProps } from "./Shared/ClimateControls";
// ClimateCard
export { ClimateCard } from "./Cards/ClimateCard";
export type { ClimateCardProps } from "./Cards/ClimateCard";
// EntitiesCard
export { EntitiesCard } from "./Cards/EntitiesCard";
export type { EntitiesCardProps } from "./Cards/EntitiesCard";
// MediaPlayerCard
export { MediaPlayerCard } from "./Cards/MediaPlayerCard";
export type { MediaPlayerCardProps } from "./Cards/MediaPlayerCard";
// Modal
export { Modal } from "./Shared/Modal";
export type { ModalProps } from "./Shared/Modal";
export { ModalLightControls } from "./Shared/Modal/ModalLightControls";
export type { ModalLightControlsProps } from "./Shared/Modal/ModalLightControls";
export { ModalClimateControls } from "./Shared/Modal/ModalClimateControls";
export type { ModalClimateControlsProps } from "./Shared/Modal/ModalClimateControls";
export { ModalByEntityDomain } from "./Shared/Modal/ModalByEntityDomain";
export type { ModalByEntityDomainProps } from "./Shared/Modal/ModalByEntityDomain";
// ControlSlider
export { ControlSlider } from "./Shared/ControlSlider";
export type { ControlSliderProps } from "./Shared/ControlSlider";
// ColorTempPicker
export { ColorTempPicker } from "./Shared/ColorTempPicker";
export type { ColorTempPickerProps } from "./Shared/ColorTempPicker";
// ColorPicker
export { ColorPicker } from "./Shared/ColorPicker";
export type {
  ColorPickerProps,
  ColorPickerOutputColors,
} from "./Shared/ColorPicker";
// Alert
export { Alert } from "./Shared/Alert";
export type { AlertProps } from "./Shared/Alert";

// ThemeProvider
export { ThemeProvider } from "./ThemeProvider";
export { theme } from "./ThemeProvider/theme";
export type { ThemeProviderProps } from "./ThemeProvider";
