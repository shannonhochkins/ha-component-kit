// this is an auto generated file, do not change this manually
import type { HassServiceTarget } from "home-assistant-js-websocket";
import { useHass } from "../useHass";
export function useApi() {
  const { callService } = useHass();
  return {
    persistentNotification: {
      create: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification. [Templates accepted]
          message: string;
          // Optional title for your notification. [Templates accepted]
          title?: string;
          // Target ID of the notification, will replace a notification with the same ID.
          notification_id?: string;
        }
      ) => {
        return callService({
          domain: "persistent_notification",
          service: "create",
          target,
          serviceData,
        });
      },
      dismiss: (
        target: HassServiceTarget,
        serviceData: {
          // Target ID of the notification, which should be removed.
          notification_id: string;
        }
      ) => {
        return callService({
          domain: "persistent_notification",
          service: "dismiss",
          target,
          serviceData,
        });
      },
    },
    homeassistant: {
      savePersistentStates: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "homeassistant",
          service: "save_persistent_states",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "toggle",
          target,
          serviceData,
        });
      },
      stop: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "stop",
          target,
          serviceData,
        });
      },
      restart: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "restart",
          target,
          serviceData,
        });
      },
      checkConfig: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "check_config",
          target,
          serviceData,
        });
      },
      updateEntity: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "update_entity",
          target,
          serviceData,
        });
      },
      reloadCoreConfig: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "reload_core_config",
          target,
          serviceData,
        });
      },
      setLocation: (
        target: HassServiceTarget,
        serviceData: {
          // Latitude of your location.
          latitude: string;
          // Longitude of your location.
          longitude: string;
        }
      ) => {
        return callService({
          domain: "homeassistant",
          service: "set_location",
          target,
          serviceData,
        });
      },
      reloadCustomTemplates: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "homeassistant",
          service: "reload_custom_templates",
          target,
          serviceData,
        });
      },
      reloadConfigEntry: (
        target: HassServiceTarget,
        serviceData: {
          // A configuration entry id
          entry_id?: string;
        }
      ) => {
        return callService({
          domain: "homeassistant",
          service: "reload_config_entry",
          target,
          serviceData,
        });
      },
      reloadAll: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "homeassistant",
          service: "reload_all",
          target,
          serviceData,
        });
      },
    },
    systemLog: {
      clear: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "system_log",
          service: "clear",
          target,
          serviceData,
        });
      },
      write: (
        target: HassServiceTarget,
        serviceData: {
          // Message to log.
          message: string;
          // Log level.
          level?: "debug" | "info" | "warning" | "error" | "critical";
          // Logger name under which to log the message. Defaults to 'system_log.external'.
          logger?: string;
        }
      ) => {
        return callService({
          domain: "system_log",
          service: "write",
          target,
          serviceData,
        });
      },
    },
    logger: {
      setDefaultLevel: (
        target: HassServiceTarget,
        serviceData: {
          // Default severity level for all integrations.
          level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
        }
      ) => {
        return callService({
          domain: "logger",
          service: "set_default_level",
          target,
          serviceData,
        });
      },
      setLevel: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "logger",
          service: "set_level",
          target,
          serviceData,
        });
      },
    },
    person: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "person",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    frontend: {
      setTheme: (
        target: HassServiceTarget,
        serviceData: {
          // Name of a predefined theme
          name: object;
          // The mode the theme is for.
          mode?: "dark" | "light";
        }
      ) => {
        return callService({
          domain: "frontend",
          service: "set_theme",
          target,
          serviceData,
        });
      },
      reloadThemes: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "frontend",
          service: "reload_themes",
          target,
          serviceData,
        });
      },
    },
    recorder: {
      purge: (
        target: HassServiceTarget,
        serviceData: {
          // Number of history days to keep in database after purge.
          keep_days?: number;
          // Attempt to save disk space by rewriting the entire database file.
          repack?: boolean;
          // Apply entity_id and event_type filter in addition to time based purge.
          apply_filter?: boolean;
        }
      ) => {
        return callService({
          domain: "recorder",
          service: "purge",
          target,
          serviceData,
        });
      },
      purgeEntities: (
        target: HassServiceTarget,
        serviceData: {
          // List the domains that need to be removed from the recorder database.
          domains?: object;
          // List the glob patterns to select entities for removal from the recorder database.
          entity_globs?: object;
          // Number of history days to keep in database of matching rows. The default of 0 days will remove all matching rows.
          keep_days?: number;
        }
      ) => {
        return callService({
          domain: "recorder",
          service: "purge_entities",
          target,
          serviceData,
        });
      },
      enable: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "recorder",
          service: "enable",
          target,
          serviceData,
        });
      },
      disable: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "recorder",
          service: "disable",
          target,
          serviceData,
        });
      },
    },
    hassio: {
      addonStart: (
        target: HassServiceTarget,
        serviceData: {
          // The add-on slug.
          addon: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "addon_start",
          target,
          serviceData,
        });
      },
      addonStop: (
        target: HassServiceTarget,
        serviceData: {
          // The add-on slug.
          addon: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "addon_stop",
          target,
          serviceData,
        });
      },
      addonRestart: (
        target: HassServiceTarget,
        serviceData: {
          // The add-on slug.
          addon: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "addon_restart",
          target,
          serviceData,
        });
      },
      addonUpdate: (
        target: HassServiceTarget,
        serviceData: {
          // The add-on slug.
          addon: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "addon_update",
          target,
          serviceData,
        });
      },
      addonStdin: (
        target: HassServiceTarget,
        serviceData: {
          // The add-on slug.
          addon: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "addon_stdin",
          target,
          serviceData,
        });
      },
      hostShutdown: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "hassio",
          service: "host_shutdown",
          target,
          serviceData,
        });
      },
      hostReboot: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "hassio",
          service: "host_reboot",
          target,
          serviceData,
        });
      },
      backupFull: (
        target: HassServiceTarget,
        serviceData: {
          // Optional (default = current date and time).
          name?: string;
          // Optional password.
          password?: string;
          // Use compressed archives
          compressed?: boolean;
          // Name of a backup network storage to put backup (or /backup)
          location?: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "backup_full",
          target,
          serviceData,
        });
      },
      backupPartial: (
        target: HassServiceTarget,
        serviceData: {
          // Backup Home Assistant settings
          homeassistant?: boolean;
          // Optional list of add-on slugs.
          addons?: object;
          // Optional list of directories.
          folders?: object;
          // Optional (default = current date and time).
          name?: string;
          // Optional password.
          password?: string;
          // Use compressed archives
          compressed?: boolean;
          // Name of a backup network storage to put backup (or /backup)
          location?: object;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "backup_partial",
          target,
          serviceData,
        });
      },
      restoreFull: (
        target: HassServiceTarget,
        serviceData: {
          // Slug of backup to restore from.
          slug: string;
          // Optional password.
          password?: string;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "restore_full",
          target,
          serviceData,
        });
      },
      restorePartial: (
        target: HassServiceTarget,
        serviceData: {
          // Slug of backup to restore from.
          slug: string;
          // Restore Home Assistant
          homeassistant?: boolean;
          // Optional list of directories.
          folders?: object;
          // Optional list of add-on slugs.
          addons?: object;
          // Optional password.
          password?: string;
        }
      ) => {
        return callService({
          domain: "hassio",
          service: "restore_partial",
          target,
          serviceData,
        });
      },
    },
    cloud: {
      remoteConnect: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cloud",
          service: "remote_connect",
          target,
          serviceData,
        });
      },
      remoteDisconnect: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cloud",
          service: "remote_disconnect",
          target,
          serviceData,
        });
      },
    },
    tts: {
      googleTranslateSay: (
        target: HassServiceTarget,
        serviceData: {
          // Name(s) of media player entities.
          entity_id: string;
          // Text to speak on devices.
          message: string;
          // Control file cache of this message.
          cache?: boolean;
          // Language to use for speech generation.
          language?: string;
          // A dictionary containing platform-specific options. Optional depending on the platform.
          options?: object;
        }
      ) => {
        return callService({
          domain: "tts",
          service: "google_translate_say",
          target,
          serviceData,
        });
      },
      speak: (
        target: HassServiceTarget,
        serviceData: {
          // Name(s) of media player entities.
          media_player_entity_id: string;
          // Text to speak on devices.
          message: string;
          // Control file cache of this message.
          cache?: boolean;
          // Language to use for speech generation.
          language?: string;
          // A dictionary containing platform-specific options. Optional depending on the platform.
          options?: object;
        }
      ) => {
        return callService({
          domain: "tts",
          service: "speak",
          target,
          serviceData,
        });
      },
      clearCache: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "tts",
          service: "clear_cache",
          target,
          serviceData,
        });
      },
      cloudSay: (
        target: HassServiceTarget,
        serviceData: {
          // Name(s) of media player entities.
          entity_id: string;
          // Text to speak on devices.
          message: string;
          // Control file cache of this message.
          cache?: boolean;
          // Language to use for speech generation.
          language?: string;
          // A dictionary containing platform-specific options. Optional depending on the platform.
          options?: object;
        }
      ) => {
        return callService({
          domain: "tts",
          service: "cloud_say",
          target,
          serviceData,
        });
      },
    },
    update: {
      install: (
        target: HassServiceTarget,
        serviceData: {
          // Version to install, if omitted, the latest version will be installed.
          version?: string;
          // Backup before installing the update, if supported by the integration.
          backup?: boolean;
        }
      ) => {
        return callService({
          domain: "update",
          service: "install",
          target,
          serviceData,
        });
      },
      skip: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "update",
          service: "skip",
          target,
          serviceData,
        });
      },
      clearSkipped: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "update",
          service: "clear_skipped",
          target,
          serviceData,
        });
      },
    },
    localtuya: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "localtuya",
          service: "reload",
          target,
          serviceData,
        });
      },
      setDp: (
        target: HassServiceTarget,
        serviceData: {
          // Device ID of device to change datapoint value for
          device_id?: object;
          // Datapoint index
          dp?: object;
          // New value to set
          value?: object;
        }
      ) => {
        return callService({
          domain: "localtuya",
          service: "set_dp",
          target,
          serviceData,
        });
      },
    },
    restCommand: {
      assistantRelay: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "rest_command",
          service: "assistant_relay",
          target,
          serviceData,
        });
      },
    },
    conversation: {
      process: (
        target: HassServiceTarget,
        serviceData: {
          // Transcribed text
          text?: string;
          // Language of text. Defaults to server language
          language?: string;
          // Assist engine to process your request
          agent_id?: string;
        }
      ) => {
        return callService({
          domain: "conversation",
          service: "process",
          target,
          serviceData,
        });
      },
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "conversation",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    commandLine: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "command_line",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    light: {
      turnOn: (
        target: HassServiceTarget,
        serviceData: {
          // Duration it takes to get to next state.
          transition?: number;
          // The color for the light (based on RGB - red, green, blue).
          rgb_color?: object;
          // A list containing four integers between 0 and 255 representing the RGBW (red, green, blue, white) color for the light.
          rgbw_color?: object;
          // A list containing five integers between 0 and 255 representing the RGBWW (red, green, blue, cold white, warm white) color for the light.
          rgbww_color?: object;
          // A human readable color name.
          color_name?:
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined";
          // Color for the light in hue/sat format. Hue is 0-360 and Sat is 0-100.
          hs_color?: object;
          // Color for the light in XY-format.
          xy_color?: object;
          // Color temperature for the light in mireds.
          color_temp?: object;
          // Color temperature for the light in Kelvin.
          kelvin?: number;
          // Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness and 255 is the maximum brightness supported by the light.
          brightness?: number;
          // Number indicating percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness and 100 is the maximum brightness supported by the light.
          brightness_pct?: number;
          // Change brightness by an amount.
          brightness_step?: number;
          // Change brightness by a percentage.
          brightness_step_pct?: number;
          // Set the light to white mode.
          white?: object;
          // Name of a light profile to use.
          profile?: string;
          // If the light should flash.
          flash?: "long" | "short";
          // Light effect.
          effect?: string;
        }
      ) => {
        return callService({
          domain: "light",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (
        target: HassServiceTarget,
        serviceData: {
          // Duration it takes to get to next state.
          transition?: number;
          // If the light should flash.
          flash?: "long" | "short";
        }
      ) => {
        return callService({
          domain: "light",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (
        target: HassServiceTarget,
        serviceData: {
          // Duration it takes to get to next state.
          transition?: number;
          // Color for the light in RGB-format.
          rgb_color?: object;
          // A human readable color name.
          color_name?:
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined"
            | "undefined";
          // Color for the light in hue/sat format. Hue is 0-360 and Sat is 0-100.
          hs_color?: object;
          // Color for the light in XY-format.
          xy_color?: object;
          // Color temperature for the light in mireds.
          color_temp?: object;
          // Color temperature for the light in Kelvin.
          kelvin?: number;
          // Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness and 255 is the maximum brightness supported by the light.
          brightness?: number;
          // Number indicating percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness and 100 is the maximum brightness supported by the light.
          brightness_pct?: number;
          // Set the light to white mode.
          white?: object;
          // Name of a light profile to use.
          profile?: string;
          // If the light should flash.
          flash?: "long" | "short";
          // Light effect.
          effect?: string;
        }
      ) => {
        return callService({
          domain: "light",
          service: "toggle",
          target,
          serviceData,
        });
      },
    },
    logbook: {
      log: (
        target: HassServiceTarget,
        serviceData: {
          // Custom name for an entity, can be referenced with entity_id.
          name: string;
          // Message of the custom logbook entry.
          message: string;
          // Entity to reference in custom logbook entry.
          entity_id?: string;
          // Icon of domain to display in custom logbook entry.
          domain?: string;
        }
      ) => {
        return callService({
          domain: "logbook",
          service: "log",
          target,
          serviceData,
        });
      },
    },
    zone: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "zone",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    counter: {
      increment: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "counter",
          service: "increment",
          target,
          serviceData,
        });
      },
      decrement: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "counter",
          service: "decrement",
          target,
          serviceData,
        });
      },
      reset: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "counter",
          service: "reset",
          target,
          serviceData,
        });
      },
      setValue: (
        target: HassServiceTarget,
        serviceData: {
          // The new counter value the entity should be set to.
          value: number;
        }
      ) => {
        return callService({
          domain: "counter",
          service: "set_value",
          target,
          serviceData,
        });
      },
      configure: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "counter",
          service: "configure",
          target,
          serviceData,
        });
      },
    },
    cover: {
      openCover: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "open_cover",
          target,
          serviceData,
        });
      },
      closeCover: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "close_cover",
          target,
          serviceData,
        });
      },
      setCoverPosition: (
        target: HassServiceTarget,
        serviceData: {
          // Position of the cover
          position: number;
        }
      ) => {
        return callService({
          domain: "cover",
          service: "set_cover_position",
          target,
          serviceData,
        });
      },
      stopCover: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "stop_cover",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "toggle",
          target,
          serviceData,
        });
      },
      openCoverTilt: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "open_cover_tilt",
          target,
          serviceData,
        });
      },
      closeCoverTilt: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "close_cover_tilt",
          target,
          serviceData,
        });
      },
      stopCoverTilt: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "stop_cover_tilt",
          target,
          serviceData,
        });
      },
      setCoverTiltPosition: (
        target: HassServiceTarget,
        serviceData: {
          // Tilt position of the cover.
          tilt_position: number;
        }
      ) => {
        return callService({
          domain: "cover",
          service: "set_cover_tilt_position",
          target,
          serviceData,
        });
      },
      toggleCoverTilt: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "cover",
          service: "toggle_cover_tilt",
          target,
          serviceData,
        });
      },
    },
    group: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "group",
          service: "reload",
          target,
          serviceData,
        });
      },
      set: (
        target: HassServiceTarget,
        serviceData: {
          // Group id and part of entity id.
          object_id: string;
          // Name of group
          name?: string;
          // Name of icon for the group.
          icon?: object;
          // List of all members in the group. Not compatible with 'delta'.
          entities?: object;
          // List of members that will change on group listening.
          add_entities?: object;
          // List of members that will be removed from group listening.
          remove_entities?: object;
          // Enable this option if the group should only turn on when all entities are on.
          all?: boolean;
        }
      ) => {
        return callService({
          domain: "group",
          service: "set",
          target,
          serviceData,
        });
      },
      remove: (
        target: HassServiceTarget,
        serviceData: {
          // Group id and part of entity id.
          object_id: object;
        }
      ) => {
        return callService({
          domain: "group",
          service: "remove",
          target,
          serviceData,
        });
      },
    },
    scene: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "scene",
          service: "reload",
          target,
          serviceData,
        });
      },
      apply: (
        target: HassServiceTarget,
        serviceData: {
          // The entities and the state that they need to be.
          entities: object;
          // Transition duration it takes to bring devices to the state defined in the scene.
          transition?: number;
        }
      ) => {
        return callService({
          domain: "scene",
          service: "apply",
          target,
          serviceData,
        });
      },
      create: (
        target: HassServiceTarget,
        serviceData: {
          // The entity_id of the new scene.
          scene_id: string;
          // The entities to control with the scene.
          entities?: object;
          // The entities of which a snapshot is to be taken
          snapshot_entities?: object;
        }
      ) => {
        return callService({
          domain: "scene",
          service: "create",
          target,
          serviceData,
        });
      },
      turnOn: (
        target: HassServiceTarget,
        serviceData: {
          // Transition duration it takes to bring devices to the state defined in the scene.
          transition?: number;
        }
      ) => {
        return callService({
          domain: "scene",
          service: "turn_on",
          target,
          serviceData,
        });
      },
    },
    inputSelect: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_select",
          service: "reload",
          target,
          serviceData,
        });
      },
      selectFirst: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_select",
          service: "select_first",
          target,
          serviceData,
        });
      },
      selectLast: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_select",
          service: "select_last",
          target,
          serviceData,
        });
      },
      selectNext: (
        target: HassServiceTarget,
        serviceData: {
          // If the option should cycle from the last to the first.
          cycle?: boolean;
        }
      ) => {
        return callService({
          domain: "input_select",
          service: "select_next",
          target,
          serviceData,
        });
      },
      selectOption: (
        target: HassServiceTarget,
        serviceData: {
          // Option to be selected.
          option: string;
        }
      ) => {
        return callService({
          domain: "input_select",
          service: "select_option",
          target,
          serviceData,
        });
      },
      selectPrevious: (
        target: HassServiceTarget,
        serviceData: {
          // If the option should cycle from the first to the last.
          cycle?: boolean;
        }
      ) => {
        return callService({
          domain: "input_select",
          service: "select_previous",
          target,
          serviceData,
        });
      },
      setOptions: (
        target: HassServiceTarget,
        serviceData: {
          // Options for the input select entity.
          options: object;
        }
      ) => {
        return callService({
          domain: "input_select",
          service: "set_options",
          target,
          serviceData,
        });
      },
    },
    schedule: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "schedule",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    inputNumber: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_number",
          service: "reload",
          target,
          serviceData,
        });
      },
      setValue: (
        target: HassServiceTarget,
        serviceData: {
          // The target value the entity should be set to.
          value: number;
        }
      ) => {
        return callService({
          domain: "input_number",
          service: "set_value",
          target,
          serviceData,
        });
      },
      increment: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_number",
          service: "increment",
          target,
          serviceData,
        });
      },
      decrement: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_number",
          service: "decrement",
          target,
          serviceData,
        });
      },
    },
    inputButton: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_button",
          service: "reload",
          target,
          serviceData,
        });
      },
      press: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_button",
          service: "press",
          target,
          serviceData,
        });
      },
    },
    inputDatetime: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_datetime",
          service: "reload",
          target,
          serviceData,
        });
      },
      setDatetime: (
        target: HassServiceTarget,
        serviceData: {
          // The target date the entity should be set to.
          date?: string;
          // The target time the entity should be set to.
          time?: object;
          // The target date & time the entity should be set to.
          datetime?: string;
          // The target date & time the entity should be set to as expressed by a UNIX timestamp.
          timestamp?: number;
        }
      ) => {
        return callService({
          domain: "input_datetime",
          service: "set_datetime",
          target,
          serviceData,
        });
      },
    },
    timer: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "timer",
          service: "reload",
          target,
          serviceData,
        });
      },
      start: (
        target: HassServiceTarget,
        serviceData: {
          // Duration the timer requires to finish. [optional]
          duration?: string;
        }
      ) => {
        return callService({
          domain: "timer",
          service: "start",
          target,
          serviceData,
        });
      },
      pause: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "timer",
          service: "pause",
          target,
          serviceData,
        });
      },
      cancel: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "timer",
          service: "cancel",
          target,
          serviceData,
        });
      },
      finish: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "timer",
          service: "finish",
          target,
          serviceData,
        });
      },
      change: (
        target: HassServiceTarget,
        serviceData: {
          // Duration to add or subtract to the running timer
          duration: string;
        }
      ) => {
        return callService({
          domain: "timer",
          service: "change",
          target,
          serviceData,
        });
      },
    },
    script: {
      gamingLightColorChanger: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "script",
          service: "gaming_light_color_changer",
          target,
          serviceData,
        });
      },
      randomLightColour: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "script",
          service: "random_light_colour",
          target,
          serviceData,
        });
      },
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "script",
          service: "reload",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "script",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "script",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "script",
          service: "toggle",
          target,
          serviceData,
        });
      },
    },
    inputText: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_text",
          service: "reload",
          target,
          serviceData,
        });
      },
      setValue: (
        target: HassServiceTarget,
        serviceData: {
          // The target value the entity should be set to.
          value: string;
        }
      ) => {
        return callService({
          domain: "input_text",
          service: "set_value",
          target,
          serviceData,
        });
      },
    },
    deconz: {
      configure: (
        target: HassServiceTarget,
        serviceData: {
          // Represents a specific device endpoint in deCONZ.
          entity?: string;
          // String representing a full path to deCONZ endpoint (when entity is not specified) or a subpath of the device path for the entity (when entity is specified).
          field?: string;
          // JSON object with what data you want to alter.
          data: object;
          // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
          bridgeid?: string;
        }
      ) => {
        return callService({
          domain: "deconz",
          service: "configure",
          target,
          serviceData,
        });
      },
      deviceRefresh: (
        target: HassServiceTarget,
        serviceData: {
          // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
          bridgeid?: string;
        }
      ) => {
        return callService({
          domain: "deconz",
          service: "device_refresh",
          target,
          serviceData,
        });
      },
      removeOrphanedEntries: (
        target: HassServiceTarget,
        serviceData: {
          // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
          bridgeid?: string;
        }
      ) => {
        return callService({
          domain: "deconz",
          service: "remove_orphaned_entries",
          target,
          serviceData,
        });
      },
    },
    inputBoolean: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_boolean",
          service: "reload",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_boolean",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_boolean",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "input_boolean",
          service: "toggle",
          target,
          serviceData,
        });
      },
    },
    climate: {
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "climate",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "climate",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      setHvacMode: (
        target: HassServiceTarget,
        serviceData: {
          // New value of operation mode.
          hvac_mode?:
            | "off"
            | "auto"
            | "cool"
            | "dry"
            | "fan_only"
            | "heat_cool"
            | "heat";
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_hvac_mode",
          target,
          serviceData,
        });
      },
      setPresetMode: (
        target: HassServiceTarget,
        serviceData: {
          // New value of preset mode.
          preset_mode: string;
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_preset_mode",
          target,
          serviceData,
        });
      },
      setAuxHeat: (
        target: HassServiceTarget,
        serviceData: {
          // New value of auxiliary heater.
          aux_heat: boolean;
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_aux_heat",
          target,
          serviceData,
        });
      },
      setTemperature: (
        target: HassServiceTarget,
        serviceData: {
          // New target temperature for HVAC.
          temperature?: number;
          // New target high temperature for HVAC.
          target_temp_high?: number;
          // New target low temperature for HVAC.
          target_temp_low?: number;
          // HVAC operation mode to set temperature to.
          hvac_mode?:
            | "off"
            | "auto"
            | "cool"
            | "dry"
            | "fan_only"
            | "heat_cool"
            | "heat";
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_temperature",
          target,
          serviceData,
        });
      },
      setHumidity: (
        target: HassServiceTarget,
        serviceData: {
          // New target humidity for climate device.
          humidity: number;
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_humidity",
          target,
          serviceData,
        });
      },
      setFanMode: (
        target: HassServiceTarget,
        serviceData: {
          // New value of fan mode.
          fan_mode: string;
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_fan_mode",
          target,
          serviceData,
        });
      },
      setSwingMode: (
        target: HassServiceTarget,
        serviceData: {
          // New value of swing mode.
          swing_mode: string;
        }
      ) => {
        return callService({
          domain: "climate",
          service: "set_swing_mode",
          target,
          serviceData,
        });
      },
    },
    mediaPlayer: {
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "toggle",
          target,
          serviceData,
        });
      },
      volumeUp: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "volume_up",
          target,
          serviceData,
        });
      },
      volumeDown: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "volume_down",
          target,
          serviceData,
        });
      },
      mediaPlayPause: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_play_pause",
          target,
          serviceData,
        });
      },
      mediaPlay: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_play",
          target,
          serviceData,
        });
      },
      mediaPause: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_pause",
          target,
          serviceData,
        });
      },
      mediaStop: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_stop",
          target,
          serviceData,
        });
      },
      mediaNextTrack: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_next_track",
          target,
          serviceData,
        });
      },
      mediaPreviousTrack: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "media_previous_track",
          target,
          serviceData,
        });
      },
      clearPlaylist: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "clear_playlist",
          target,
          serviceData,
        });
      },
      volumeSet: (
        target: HassServiceTarget,
        serviceData: {
          // Volume level to set as float.
          volume_level: number;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "volume_set",
          target,
          serviceData,
        });
      },
      volumeMute: (
        target: HassServiceTarget,
        serviceData: {
          // True/false for mute/unmute.
          is_volume_muted: boolean;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "volume_mute",
          target,
          serviceData,
        });
      },
      mediaSeek: (
        target: HassServiceTarget,
        serviceData: {
          // Position to seek to. The format is platform dependent.
          seek_position: number;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "media_seek",
          target,
          serviceData,
        });
      },
      join: (
        target: HassServiceTarget,
        serviceData: {
          // The players which will be synced with the target player.
          group_members: string;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "join",
          target,
          serviceData,
        });
      },
      selectSource: (
        target: HassServiceTarget,
        serviceData: {
          // Name of the source to switch to. Platform dependent.
          source: string;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "select_source",
          target,
          serviceData,
        });
      },
      selectSoundMode: (
        target: HassServiceTarget,
        serviceData: {
          // Name of the sound mode to switch to.
          sound_mode?: string;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "select_sound_mode",
          target,
          serviceData,
        });
      },
      playMedia: (
        target: HassServiceTarget,
        serviceData: {
          // The ID of the content to play. Platform dependent.
          media_content_id: string;
          // The type of the content to play. Like image, music, tvshow, video, episode, channel or playlist.
          media_content_type: string;
          // If the content should be played now or be added to the queue.
          enqueue?: "play" | "next" | "add" | "replace";
          // If the media should be played as an announcement.
          announce?: boolean;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "play_media",
          target,
          serviceData,
        });
      },
      shuffleSet: (
        target: HassServiceTarget,
        serviceData: {
          // True/false for enabling/disabling shuffle.
          shuffle: boolean;
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "shuffle_set",
          target,
          serviceData,
        });
      },
      unjoin: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "media_player",
          service: "unjoin",
          target,
          serviceData,
        });
      },
      repeatSet: (
        target: HassServiceTarget,
        serviceData: {
          // Repeat mode to set.
          repeat: "off" | "all" | "one";
        }
      ) => {
        return callService({
          domain: "media_player",
          service: "repeat_set",
          target,
          serviceData,
        });
      },
    },
    alarmControlPanel: {
      alarmDisarm: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to disarm the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_disarm",
          target,
          serviceData,
        });
      },
      alarmArmHome: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to arm home the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_arm_home",
          target,
          serviceData,
        });
      },
      alarmArmAway: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to arm away the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_arm_away",
          target,
          serviceData,
        });
      },
      alarmArmNight: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to arm night the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_arm_night",
          target,
          serviceData,
        });
      },
      alarmArmVacation: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to arm vacation the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_arm_vacation",
          target,
          serviceData,
        });
      },
      alarmArmCustomBypass: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to arm custom bypass the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_arm_custom_bypass",
          target,
          serviceData,
        });
      },
      alarmTrigger: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to trigger the alarm control panel with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "alarm_control_panel",
          service: "alarm_trigger",
          target,
          serviceData,
        });
      },
    },
    button: {
      press: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "button",
          service: "press",
          target,
          serviceData,
        });
      },
    },
    number: {
      setValue: (
        target: HassServiceTarget,
        serviceData: {
          // The target value the entity should be set to.
          value?: string;
        }
      ) => {
        return callService({
          domain: "number",
          service: "set_value",
          target,
          serviceData,
        });
      },
    },
    lock: {
      unlock: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to unlock the lock with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "lock",
          service: "unlock",
          target,
          serviceData,
        });
      },
      lock: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to lock the lock with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "lock",
          service: "lock",
          target,
          serviceData,
        });
      },
      open: (
        target: HassServiceTarget,
        serviceData: {
          // An optional code to open the lock with.
          code?: string;
        }
      ) => {
        return callService({
          domain: "lock",
          service: "open",
          target,
          serviceData,
        });
      },
    },
    fan: {
      turnOn: (
        target: HassServiceTarget,
        serviceData: {
          // Speed setting.
          speed?: string;
          // Percentage speed setting.
          percentage?: number;
          // Preset mode setting.
          preset_mode?: string;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "fan",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "fan",
          service: "toggle",
          target,
          serviceData,
        });
      },
      increaseSpeed: (
        target: HassServiceTarget,
        serviceData: {
          // Increase speed by a percentage.
          percentage_step?: number;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "increase_speed",
          target,
          serviceData,
        });
      },
      decreaseSpeed: (
        target: HassServiceTarget,
        serviceData: {
          // Decrease speed by a percentage.
          percentage_step?: number;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "decrease_speed",
          target,
          serviceData,
        });
      },
      oscillate: (
        target: HassServiceTarget,
        serviceData: {
          // Flag to turn on/off oscillation.
          oscillating: boolean;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "oscillate",
          target,
          serviceData,
        });
      },
      setDirection: (
        target: HassServiceTarget,
        serviceData: {
          // The direction to rotate.
          direction: "forward" | "reverse";
        }
      ) => {
        return callService({
          domain: "fan",
          service: "set_direction",
          target,
          serviceData,
        });
      },
      setPercentage: (
        target: HassServiceTarget,
        serviceData: {
          // Percentage speed setting.
          percentage: number;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "set_percentage",
          target,
          serviceData,
        });
      },
      setPresetMode: (
        target: HassServiceTarget,
        serviceData: {
          // New value of preset mode.
          preset_mode: string;
        }
      ) => {
        return callService({
          domain: "fan",
          service: "set_preset_mode",
          target,
          serviceData,
        });
      },
    },
    siren: {
      turnOn: (
        target: HassServiceTarget,
        serviceData: {
          // The tone to emit when turning the siren on. When `available_tones` property is a map, either the key or the value can be used. Must be supported by the integration.
          tone?: string;
          // The volume level of the noise to emit when turning the siren on. Must be supported by the integration.
          volume_level?: number;
          // The duration in seconds of the noise to emit when turning the siren on. Must be supported by the integration.
          duration?: string;
        }
      ) => {
        return callService({
          domain: "siren",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "siren",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "siren",
          service: "toggle",
          target,
          serviceData,
        });
      },
    },
    select: {
      selectFirst: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "select",
          service: "select_first",
          target,
          serviceData,
        });
      },
      selectLast: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "select",
          service: "select_last",
          target,
          serviceData,
        });
      },
      selectNext: (
        target: HassServiceTarget,
        serviceData: {
          // If the option should cycle from the last to the first.
          cycle?: boolean;
        }
      ) => {
        return callService({
          domain: "select",
          service: "select_next",
          target,
          serviceData,
        });
      },
      selectOption: (
        target: HassServiceTarget,
        serviceData: {
          // Option to be selected.
          option: string;
        }
      ) => {
        return callService({
          domain: "select",
          service: "select_option",
          target,
          serviceData,
        });
      },
      selectPrevious: (
        target: HassServiceTarget,
        serviceData: {
          // If the option should cycle from the first to the last.
          cycle?: boolean;
        }
      ) => {
        return callService({
          domain: "select",
          service: "select_previous",
          target,
          serviceData,
        });
      },
    },
    remote: {
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "remote",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      turnOn: (
        target: HassServiceTarget,
        serviceData: {
          // Activity ID or Activity Name to start.
          activity?: string;
        }
      ) => {
        return callService({
          domain: "remote",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "remote",
          service: "toggle",
          target,
          serviceData,
        });
      },
      sendCommand: (
        target: HassServiceTarget,
        serviceData: {
          // Device ID to send command to.
          device?: string;
          // A single command or a list of commands to send.
          command: object;
          // The number of times you want to repeat the command(s).
          num_repeats?: number;
          // The time you want to wait in between repeated commands.
          delay_secs?: number;
          // The time you want to have it held before the release is send.
          hold_secs?: number;
        }
      ) => {
        return callService({
          domain: "remote",
          service: "send_command",
          target,
          serviceData,
        });
      },
      learnCommand: (
        target: HassServiceTarget,
        serviceData: {
          // Device ID to learn command from.
          device?: string;
          // A single command or a list of commands to learn.
          command?: object;
          // The type of command to be learned.
          command_type?: "undefined" | "undefined";
          // If code must be stored as alternative (useful for discrete remotes).
          alternative?: boolean;
          // Timeout for the command to be learned.
          timeout?: number;
        }
      ) => {
        return callService({
          domain: "remote",
          service: "learn_command",
          target,
          serviceData,
        });
      },
      deleteCommand: (
        target: HassServiceTarget,
        serviceData: {
          // Name of the device from which commands will be deleted.
          device?: string;
          // A single command or a list of commands to delete.
          command: object;
        }
      ) => {
        return callService({
          domain: "remote",
          service: "delete_command",
          target,
          serviceData,
        });
      },
    },
    ffmpeg: {
      start: (
        target: HassServiceTarget,
        serviceData: {
          // Name of entity that will start. Platform dependent.
          entity_id?: string;
        }
      ) => {
        return callService({
          domain: "ffmpeg",
          service: "start",
          target,
          serviceData,
        });
      },
      stop: (
        target: HassServiceTarget,
        serviceData: {
          // Name of entity that will stop. Platform dependent.
          entity_id?: string;
        }
      ) => {
        return callService({
          domain: "ffmpeg",
          service: "stop",
          target,
          serviceData,
        });
      },
      restart: (
        target: HassServiceTarget,
        serviceData: {
          // Name of entity that will restart. Platform dependent.
          entity_id?: string;
        }
      ) => {
        return callService({
          domain: "ffmpeg",
          service: "restart",
          target,
          serviceData,
        });
      },
    },
    profiler: {
      start: (
        target: HassServiceTarget,
        serviceData: {
          // The number of seconds to run the profiler.
          seconds?: number;
        }
      ) => {
        return callService({
          domain: "profiler",
          service: "start",
          target,
          serviceData,
        });
      },
      memory: (
        target: HassServiceTarget,
        serviceData: {
          // The number of seconds to run the memory profiler.
          seconds?: number;
        }
      ) => {
        return callService({
          domain: "profiler",
          service: "memory",
          target,
          serviceData,
        });
      },
      startLogObjects: (
        target: HassServiceTarget,
        serviceData: {
          // The number of seconds between logging objects.
          scan_interval?: number;
        }
      ) => {
        return callService({
          domain: "profiler",
          service: "start_log_objects",
          target,
          serviceData,
        });
      },
      stopLogObjects: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "profiler",
          service: "stop_log_objects",
          target,
          serviceData,
        });
      },
      startLogObjectSources: (
        target: HassServiceTarget,
        serviceData: {
          // The number of seconds between logging objects.
          scan_interval?: number;
          // The maximum number of objects to log.
          max_objects?: number;
        }
      ) => {
        return callService({
          domain: "profiler",
          service: "start_log_object_sources",
          target,
          serviceData,
        });
      },
      stopLogObjectSources: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "profiler",
          service: "stop_log_object_sources",
          target,
          serviceData,
        });
      },
      dumpLogObjects: (
        target: HassServiceTarget,
        serviceData: {
          // The type of objects to dump to the log.
          type: string;
        }
      ) => {
        return callService({
          domain: "profiler",
          service: "dump_log_objects",
          target,
          serviceData,
        });
      },
      lruStats: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "profiler",
          service: "lru_stats",
          target,
          serviceData,
        });
      },
      logThreadFrames: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "profiler",
          service: "log_thread_frames",
          target,
          serviceData,
        });
      },
      logEventLoopScheduled: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "profiler",
          service: "log_event_loop_scheduled",
          target,
          serviceData,
        });
      },
    },
    wakeOnLan: {
      sendMagicPacket: (
        target: HassServiceTarget,
        serviceData: {
          // MAC address of the device to wake up.
          mac: string;
          // Broadcast IP where to send the magic packet.
          broadcast_address?: string;
          // Port where to send the magic packet.
          broadcast_port?: number;
        }
      ) => {
        return callService({
          domain: "wake_on_lan",
          service: "send_magic_packet",
          target,
          serviceData,
        });
      },
    },
    switch: {
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "switch",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "switch",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "switch",
          service: "toggle",
          target,
          serviceData,
        });
      },
    },
    mqtt: {
      publish: (
        target: HassServiceTarget,
        serviceData: {
          // Topic to publish payload.
          topic: string;
          // Payload to publish.
          payload?: string;
          // Template to render as payload value. Ignored if payload given.
          payload_template?: object;
          // Quality of Service to use.
          qos?: "undefined" | "undefined" | "undefined";
          // If message should have the retain flag set.
          retain?: boolean;
        }
      ) => {
        return callService({
          domain: "mqtt",
          service: "publish",
          target,
          serviceData,
        });
      },
      dump: (
        target: HassServiceTarget,
        serviceData: {
          // topic to listen to
          topic?: string;
          // how long we should listen for messages in seconds
          duration?: number;
        }
      ) => {
        return callService({
          domain: "mqtt",
          service: "dump",
          target,
          serviceData,
        });
      },
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "mqtt",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    samsungtvSmart: {
      selectPictureMode: (
        target: HassServiceTarget,
        serviceData: {
          // Name of the target entity
          entity_id: string;
          // Name of the picture mode to switch to. Possible options can be found in the picture_mode_list state attribute.
          picture_mode: string;
        }
      ) => {
        return callService({
          domain: "samsungtv_smart",
          service: "select_picture_mode",
          target,
          serviceData,
        });
      },
      setArtMode: (
        target: HassServiceTarget,
        serviceData: {
          // Name of the target entity
          entity_id: string;
        }
      ) => {
        return callService({
          domain: "samsungtv_smart",
          service: "set_art_mode",
          target,
          serviceData,
        });
      },
    },
    notify: {
      persistentNotification: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification.
          message: string;
          // Title for your notification.
          title?: string;
        }
      ) => {
        return callService({
          domain: "notify",
          service: "persistent_notification",
          target,
          serviceData,
        });
      },
      mobileAppNatashasIphone: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification.
          message: string;
          // Title for your notification.
          title?: string;
          // An array of targets to send the notification to. Optional depending on the platform.
          target?: object;
          // Extended information for notification. Optional depending on the platform.
          data?: object;
        }
      ) => {
        return callService({
          domain: "notify",
          service: "mobile_app_natashas_iphone",
          target,
          serviceData,
        });
      },
      mobileAppSmT220: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification.
          message: string;
          // Title for your notification.
          title?: string;
          // An array of targets to send the notification to. Optional depending on the platform.
          target?: object;
          // Extended information for notification. Optional depending on the platform.
          data?: object;
        }
      ) => {
        return callService({
          domain: "notify",
          service: "mobile_app_sm_t220",
          target,
          serviceData,
        });
      },
      mobileAppShannonsPhone: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification.
          message: string;
          // Title for your notification.
          title?: string;
          // An array of targets to send the notification to. Optional depending on the platform.
          target?: object;
          // Extended information for notification. Optional depending on the platform.
          data?: object;
        }
      ) => {
        return callService({
          domain: "notify",
          service: "mobile_app_shannons_phone",
          target,
          serviceData,
        });
      },
      notify: (
        target: HassServiceTarget,
        serviceData: {
          // Message body of the notification.
          message: string;
          // Title for your notification.
          title?: string;
          // An array of targets to send the notification to. Optional depending on the platform.
          target?: object;
          // Extended information for notification. Optional depending on the platform.
          data?: object;
        }
      ) => {
        return callService({
          domain: "notify",
          service: "notify",
          target,
          serviceData,
        });
      },
    },
    camera: {
      enableMotionDetection: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "camera",
          service: "enable_motion_detection",
          target,
          serviceData,
        });
      },
      disableMotionDetection: (
        target: HassServiceTarget,
        serviceData: object
      ) => {
        return callService({
          domain: "camera",
          service: "disable_motion_detection",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "camera",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "camera",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      snapshot: (
        target: HassServiceTarget,
        serviceData: {
          // Template of a Filename. Variable is entity_id.
          filename: string;
        }
      ) => {
        return callService({
          domain: "camera",
          service: "snapshot",
          target,
          serviceData,
        });
      },
      playStream: (
        target: HassServiceTarget,
        serviceData: {
          // Name(s) of media player to stream to.
          media_player: string;
          // Stream format supported by media player.
          format?: "undefined";
        }
      ) => {
        return callService({
          domain: "camera",
          service: "play_stream",
          target,
          serviceData,
        });
      },
      record: (
        target: HassServiceTarget,
        serviceData: {
          // Template of a Filename. Variable is entity_id. Must be mp4.
          filename: string;
          // Target recording length.
          duration?: number;
          // Target lookback period to include in addition to duration. Only available if there is currently an active HLS stream.
          lookback?: number;
        }
      ) => {
        return callService({
          domain: "camera",
          service: "record",
          target,
          serviceData,
        });
      },
    },
    deviceTracker: {
      see: (
        target: HassServiceTarget,
        serviceData: {
          // MAC address of device
          mac?: string;
          // Id of device (find id in known_devices.yaml).
          dev_id?: string;
          // Hostname of device
          host_name?: string;
          // Name of location where device is located (not_home is away).
          location_name?: string;
          // GPS coordinates where device is located (latitude, longitude).
          gps?: object;
          // Accuracy of GPS coordinates.
          gps_accuracy?: number;
          // Battery level of device.
          battery?: number;
        }
      ) => {
        return callService({
          domain: "device_tracker",
          service: "see",
          target,
          serviceData,
        });
      },
    },
    text: {
      setValue: (
        target: HassServiceTarget,
        serviceData: {
          // Value to set.
          value: string;
        }
      ) => {
        return callService({
          domain: "text",
          service: "set_value",
          target,
          serviceData,
        });
      },
    },
    vacuum: {
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "toggle",
          target,
          serviceData,
        });
      },
      startPause: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "start_pause",
          target,
          serviceData,
        });
      },
      start: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "start",
          target,
          serviceData,
        });
      },
      pause: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "pause",
          target,
          serviceData,
        });
      },
      returnToBase: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "return_to_base",
          target,
          serviceData,
        });
      },
      cleanSpot: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "clean_spot",
          target,
          serviceData,
        });
      },
      locate: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "locate",
          target,
          serviceData,
        });
      },
      stop: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "vacuum",
          service: "stop",
          target,
          serviceData,
        });
      },
      setFanSpeed: (
        target: HassServiceTarget,
        serviceData: {
          // Platform dependent vacuum cleaner fan speed, with speed steps, like 'medium' or by percentage, between 0 and 100.
          fan_speed: string;
        }
      ) => {
        return callService({
          domain: "vacuum",
          service: "set_fan_speed",
          target,
          serviceData,
        });
      },
      sendCommand: (
        target: HassServiceTarget,
        serviceData: {
          // Command to execute.
          command: string;
          // Parameters for the command.
          params?: object;
        }
      ) => {
        return callService({
          domain: "vacuum",
          service: "send_command",
          target,
          serviceData,
        });
      },
    },
    humidifier: {
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "humidifier",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "humidifier",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "humidifier",
          service: "toggle",
          target,
          serviceData,
        });
      },
      setMode: (
        target: HassServiceTarget,
        serviceData: {
          // New mode
          mode: string;
        }
      ) => {
        return callService({
          domain: "humidifier",
          service: "set_mode",
          target,
          serviceData,
        });
      },
      setHumidity: (
        target: HassServiceTarget,
        serviceData: {
          // New target humidity for humidifier device.
          humidity: number;
        }
      ) => {
        return callService({
          domain: "humidifier",
          service: "set_humidity",
          target,
          serviceData,
        });
      },
    },
    automation: {
      trigger: (
        target: HassServiceTarget,
        serviceData: {
          // Whether or not the conditions will be skipped.
          skip_condition?: boolean;
        }
      ) => {
        return callService({
          domain: "automation",
          service: "trigger",
          target,
          serviceData,
        });
      },
      toggle: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "automation",
          service: "toggle",
          target,
          serviceData,
        });
      },
      turnOn: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "automation",
          service: "turn_on",
          target,
          serviceData,
        });
      },
      turnOff: (
        target: HassServiceTarget,
        serviceData: {
          // Stop currently running actions.
          stop_actions?: boolean;
        }
      ) => {
        return callService({
          domain: "automation",
          service: "turn_off",
          target,
          serviceData,
        });
      },
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "automation",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    cast: {
      showLovelaceView: (
        target: HassServiceTarget,
        serviceData: {
          // Media Player entity to show the Lovelace view on.
          entity_id: string;
          // The URL path of the Lovelace dashboard to show.
          dashboard_path: string;
          // The path of the Lovelace view to show.
          view_path?: string;
        }
      ) => {
        return callService({
          domain: "cast",
          service: "show_lovelace_view",
          target,
          serviceData,
        });
      },
    },
    template: {
      reload: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "template",
          service: "reload",
          target,
          serviceData,
        });
      },
    },
    tplink: {
      randomEffect: (
        target: HassServiceTarget,
        serviceData: {
          // Initial HSV sequence
          init_states: object;
          // List of HSV sequences (Max 16)
          backgrounds?: object;
          // List of segments (0 for all)
          segments?: object;
          // Initial brightness
          brightness?: number;
          // Duration
          duration?: number;
          // Transition
          transition?: number;
          // Fade off
          fadeoff?: number;
          // Range of hue
          hue_range?: object;
          // Range of saturation
          saturation_range?: object;
          // Range of brightness
          brightness_range?: object;
          // Range of transition
          transition_range?: object;
          // Random seed
          random_seed?: number;
        }
      ) => {
        return callService({
          domain: "tplink",
          service: "random_effect",
          target,
          serviceData,
        });
      },
      sequenceEffect: (
        target: HassServiceTarget,
        serviceData: {
          // List of HSV sequences (Max 16)
          sequence: object;
          // List of Segments (0 for all)
          segments?: object;
          // Initial brightness
          brightness?: number;
          // Duration
          duration?: number;
          // Repetitions (0 for continuous)
          repeat_times?: number;
          // Transition
          transition?: number;
          // Speed of spread
          spread?: number;
          // Direction
          direction?: number;
        }
      ) => {
        return callService({
          domain: "tplink",
          service: "sequence_effect",
          target,
          serviceData,
        });
      },
    },
    ring: {
      update: (target: HassServiceTarget, serviceData: object) => {
        return callService({
          domain: "ring",
          service: "update",
          target,
          serviceData,
        });
      },
    },
    nodered: {
      trigger: (
        target: HassServiceTarget,
        serviceData: {
          // Entity Id to trigger the event node with. Only needed if the node is not triggered by a single entity.
          trigger_entity_id?: object;
          // Skip conditions of the node (defaults to false)
          skip_condition?: object;
          // Which output of the node to use (defaults to true, the top output). Only used when skip_condition is set to true.
          output_path?: object;
          // The payload the node will output when triggered. Works only when triggering an entity node, not an event node.
          payload?: object;
        }
      ) => {
        return callService({
          domain: "nodered",
          service: "trigger",
          target,
          serviceData,
        });
      },
    },
  };
}
