import {
  AlarmControlPanelEntity,
  AutomationEntity,
  CameraEntity,
  ClimateEntity,
  CoverEntity,
  FanEntity,
  GroupEntity,
  HumidifierEntity,
  ImageEntity,
  InputSelectEntity,
  LawnMowerEntity,
  LightEntity,
  LockEntity,
  RemoteEntity,
  SceneEntity,
  ScriptEntity,
  SelectEntity,
  TextEntity,
  TimerEntity,
  UpdateEntity,
  WaterHeaterEntity,
  WeatherEntity,
} from "@core";
// custom overrides for the VacuumEntity
import { VacuumEntity } from "../entities/vacuum";
import { MediaPlayerEntity } from "../entities/mediaPlayer";

export interface DefinedPropertiesByDomain {
  ["alarm_control_panel"]: AlarmControlPanelEntity;
  ["automation"]: AutomationEntity;
  ["camera"]: CameraEntity;
  ["climate"]: ClimateEntity;
  ["cover"]: CoverEntity;
  ["fan"]: FanEntity;
  ["group"]: GroupEntity;
  ["humidifier"]: HumidifierEntity;
  ["image"]: ImageEntity;
  ["input_select"]: InputSelectEntity;
  ["lawn_mower"]: LawnMowerEntity;
  ["light"]: LightEntity;
  ["lock"]: LockEntity;
  ["media_player"]: MediaPlayerEntity;
  ["remote"]: RemoteEntity;
  ["scene"]: SceneEntity;
  ["script"]: ScriptEntity;
  ["select"]: SelectEntity;
  ["text"]: TextEntity;
  ["timer"]: TimerEntity;
  ["update"]: UpdateEntity;
  ["vacuum"]: VacuumEntity;
  ["water_heater"]: WaterHeaterEntity;
  ["weather"]: WeatherEntity;
}
