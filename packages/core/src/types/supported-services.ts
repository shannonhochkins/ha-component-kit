// this is an auto generated file, do not change this manually

import type { ServiceFunctionTypes, ServiceFunction } from "./";
export interface DefaultServices<T extends ServiceFunctionTypes = "target"> {
  persistentNotification: {
    // Shows a notification on the **Notifications** panel.
    create: ServiceFunction<
      T,
      {
        // Message body of the notification. @example Please check your configuration.yaml.
        message: string;
        // Optional title of the notification. @example Test notification
        title?: string;
        // ID of the notification. This new notification will overwrite an existing notification with the same ID. @example 1234
        notification_id?: string;
      }
    >;
    // Removes a notification from the **Notifications** panel.
    dismiss: ServiceFunction<
      T,
      {
        // ID of the notification to be removed. @example 1234
        notification_id: string;
      }
    >;
    // Removes all notifications from the **Notifications** panel.
    dismissAll: ServiceFunction<T, object>;
  };
  homeassistant: {
    // Saves the persistent states immediately. Maintains the normal periodic saving interval.
    savePersistentStates: ServiceFunction<T, object>;
    // Generic service to turn devices off under any domain.
    turnOff: ServiceFunction<T, object>;
    // Generic service to turn devices on under any domain.
    turnOn: ServiceFunction<T, object>;
    // Generic service to toggle devices on/off under any domain.
    toggle: ServiceFunction<T, object>;
    // Stops Home Assistant.
    stop: ServiceFunction<T, object>;
    // Restarts Home Assistant.
    restart: ServiceFunction<T, object>;
    // Checks the Home Assistant YAML-configuration files for errors. Errors will be shown in the Home Assistant logs.
    checkConfig: ServiceFunction<T, object>;
    // Forces one or more entities to update its data.
    updateEntity: ServiceFunction<T, object>;
    // Reloads the core configuration from the YAML-configuration.
    reloadCoreConfig: ServiceFunction<T, object>;
    // Updates the Home Assistant location.
    setLocation: ServiceFunction<
      T,
      {
        // Latitude of your location. @example 32.87336
        latitude: number;
        // Longitude of your location. @example 117.22743
        longitude: number;
        // Elevation of your location. @example 120
        elevation?: number;
      }
    >;
    // Reloads Jinja2 templates found in the `custom_templates` folder in your config. New values will be applied on the next render of the template.
    reloadCustomTemplates: ServiceFunction<T, object>;
    // Reloads the specified config entry.
    reloadConfigEntry: ServiceFunction<
      T,
      {
        // The configuration entry ID of the entry to be reloaded. @example 8955375327824e14ba89e4b29cc3ec9a
        entry_id?: string;
      }
    >;
    // Reload all YAML configuration that can be reloaded without restarting Home Assistant.
    reloadAll: ServiceFunction<T, object>;
  };
  systemLog: {
    // Clears all log entries.
    clear: ServiceFunction<T, object>;
    // Write log entry.
    write: ServiceFunction<
      T,
      {
        // Message to log. @example Something went wrong
        message: string;
        // Log level.
        level?: "debug" | "info" | "warning" | "error" | "critical";
        // Logger name under which to log the message. Defaults to `system_log.external`. @example mycomponent.myplatform
        logger?: string;
      }
    >;
  };
  logger: {
    // Sets the default log level for integrations.
    setDefaultLevel: ServiceFunction<
      T,
      {
        // Default severity level for all integrations.
        level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
      }
    >;
    // Sets the log level for one or more integrations.
    setLevel: ServiceFunction<T, object>;
  };
  person: {
    // Reloads persons from the YAML-configuration.
    reload: ServiceFunction<T, object>;
  };
  frontend: {
    // Sets the default theme Home Assistant uses. Can be overridden by a user.
    setTheme: ServiceFunction<
      T,
      {
        // Name of a theme. @example default
        name: object;
        // Theme mode.
        mode?: "dark" | "light";
      }
    >;
    // Reloads themes from the YAML-configuration.
    reloadThemes: ServiceFunction<T, object>;
  };
  recorder: {
    // Starts purge task - to clean up old data from your database.
    purge: ServiceFunction<
      T,
      {
        // Number of days to keep the data in the database. Starting today, counting backward. A value of `7` means that everything older than a week will be purged.
        keep_days?: number;
        // Attempt to save disk space by rewriting the entire database file.
        repack?: boolean;
        // Applys `entity_id` and `event_type` filters in addition to time-based purge.
        apply_filter?: boolean;
      }
    >;
    // Starts a purge task to remove the data related to specific entities from your database.
    purgeEntities: ServiceFunction<
      T,
      {
        // List of domains for which the data needs to be removed from the recorder database. @example sun
        domains?: object;
        // List of glob patterns used to select the entities for which the data is to be removed from the recorder database. @example domain*.object_id*
        entity_globs?: object;
        // Number of days to keep the data for rows matching the filter. Starting today, counting backward. A value of `7` means that everything older than a week will be purged. The default of 0 days will remove all matching rows immediately.
        keep_days?: number;
      }
    >;
    // Starts the recording of events and state changes.
    enable: ServiceFunction<T, object>;
    // Stops the recording of events and state changes.
    disable: ServiceFunction<T, object>;
  };
  hassio: {
    // Starts an add-on.
    addonStart: ServiceFunction<
      T,
      {
        // The add-on slug. @example core_ssh
        addon: object;
      }
    >;
    // Stops an add-on.
    addonStop: ServiceFunction<
      T,
      {
        // The add-on slug. @example core_ssh
        addon: object;
      }
    >;
    // Restarts an add-on.
    addonRestart: ServiceFunction<
      T,
      {
        // The add-on slug. @example core_ssh
        addon: object;
      }
    >;
    // Updates an add-on. This service should be used with caution since add-on updates can contain breaking changes. It is highly recommended that you review release notes/change logs before updating an add-on.
    addonUpdate: ServiceFunction<
      T,
      {
        // The add-on slug. @example core_ssh
        addon: object;
      }
    >;
    // Writes data to add-on stdin.
    addonStdin: ServiceFunction<
      T,
      {
        // The add-on slug. @example core_ssh
        addon: object;
      }
    >;
    // Powers off the host system.
    hostShutdown: ServiceFunction<T, object>;
    // Reboots the host system.
    hostReboot: ServiceFunction<T, object>;
    // Creates a full backup.
    backupFull: ServiceFunction<
      T,
      {
        // Optional (default = current date and time). @example Backup 1
        name?: string;
        // Password to protect the backup with. @example password
        password?: string;
        // Compresses the backup files.
        compressed?: boolean;
        // Name of a backup network storage to host backups. @example my_backup_mount
        location?: object;
        // Exclude the Home Assistant database file from backup
        homeassistant_exclude_database?: boolean;
      }
    >;
    // Creates a partial backup.
    backupPartial: ServiceFunction<
      T,
      {
        // Includes Home Assistant settings in the backup.
        homeassistant?: boolean;
        // Exclude the Home Assistant database file from backup
        homeassistant_exclude_database?: boolean;
        // List of add-ons to include in the backup. Use the name slug of the add-on. @example core_ssh,core_samba,core_mosquitto
        addons?: object;
        // List of directories to include in the backup. @example homeassistant,share
        folders?: object;
        // Optional (default = current date and time). @example Partial backup 1
        name?: string;
        // Password to protect the backup with. @example password
        password?: string;
        // Compresses the backup files.
        compressed?: boolean;
        // Name of a backup network storage to host backups. @example my_backup_mount
        location?: object;
      }
    >;
    // Restores from full backup.
    restoreFull: ServiceFunction<
      T,
      {
        // Slug of backup to restore from.
        slug: string;
        // Optional password. @example password
        password?: string;
      }
    >;
    // Restores from a partial backup.
    restorePartial: ServiceFunction<
      T,
      {
        // Slug of backup to restore from.
        slug: string;
        // Restores Home Assistant.
        homeassistant?: boolean;
        // List of directories to include in the backup. @example homeassistant,share
        folders?: object;
        // List of add-ons to include in the backup. Use the name slug of the add-on. @example core_ssh,core_samba,core_mosquitto
        addons?: object;
        // Optional password. @example password
        password?: string;
      }
    >;
  };
  cloud: {
    // Makes the instance UI accessible from outside of the local network by using Home Assistant Cloud.
    remoteConnect: ServiceFunction<T, object>;
    // Disconnects the Home Assistant UI from the Home Assistant Cloud. You will no longer be able to access your Home Assistant instance from outside your local network.
    remoteDisconnect: ServiceFunction<T, object>;
  };
  tts: {
    // Say something using text-to-speech on a media player with google_translate.
    googleTranslateSay: ServiceFunction<
      T,
      {
        // undefined
        entity_id: string;
        // undefined @example My name is hanna
        message: string;
        // undefined
        cache?: boolean;
        // undefined @example ru
        language?: string;
        // undefined @example platform specific
        options?: object;
      }
    >;
    // Speaks something using text-to-speech on a media player.
    speak: ServiceFunction<
      T,
      {
        // Media players to play the message.
        media_player_entity_id: string;
        // The text you want to convert into speech so that you can listen to it on your device. @example My name is hanna
        message: string;
        // Stores this message locally so that when the text is requested again, the output can be produced more quickly.
        cache?: boolean;
        // Language to use for speech generation. @example ru
        language?: string;
        // A dictionary containing integration-specific options. @example platform specific
        options?: object;
      }
    >;
    // Removes all cached text-to-speech files and purges the memory.
    clearCache: ServiceFunction<T, object>;
    // Say something using text-to-speech on a media player with cloud.
    cloudSay: ServiceFunction<
      T,
      {
        // undefined
        entity_id: string;
        // undefined @example My name is hanna
        message: string;
        // undefined
        cache?: boolean;
        // undefined @example ru
        language?: string;
        // undefined @example platform specific
        options?: object;
      }
    >;
  };
  update: {
    // Installs an update for this device or service.
    install: ServiceFunction<
      T,
      {
        // The version to install. If omitted, the latest version will be installed. @example 1.0.0
        version?: string;
        // If supported by the integration, this creates a backup before starting the update .
        backup?: boolean;
      }
    >;
    // Marks currently available update as skipped.
    skip: ServiceFunction<T, object>;
    // Removes the skipped version marker from an update.
    clearSkipped: ServiceFunction<T, object>;
  };
  commandLine: {
    // Reloads command line configuration from the YAML-configuration.
    reload: ServiceFunction<T, object>;
  };
  conversation: {
    // Launches a conversation from a transcribed text.
    process: ServiceFunction<
      T,
      {
        // Transcribed text input. @example Turn all lights on
        text: string;
        // Language of text. Defaults to server language. @example NL
        language?: string;
        // Conversation agent to process your request. The conversation agent is the brains of your assistant. It processes the incoming text commands. @example homeassistant
        agent_id?: object;
      }
    >;
    // Reloads the intent configuration.
    reload: ServiceFunction<
      T,
      {
        // Language to clear cached intents for. Defaults to server language. @example NL
        language?: string;
        // Conversation agent to reload. @example homeassistant
        agent_id?: object;
      }
    >;
  };
  restCommand: {
    //
    assistantRelay: ServiceFunction<T, object>;
    //
    reload: ServiceFunction<T, object>;
  };
  light: {
    // Turn on one or more lights and adjust properties of the light, even when they are turned on already.
    turnOn: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue.
        rgb_color?: [number, number, number];
        // The color in RGBW format. A list of four integers between 0 and 255 representing the values of red, green, blue, and white. @example [255, 100, 100, 50]
        rgbw_color?: [number, number, number, number];
        // The color in RGBWW format. A list of five integers between 0 and 255 representing the values of red, green, blue, cold white, and warm white. @example [255, 100, 100, 50, 70]
        rgbww_color?: [number, number, number, number, number];
        // A human-readable color name.
        color_name?:
          | "homeassistant"
          | "aliceblue"
          | "antiquewhite"
          | "aqua"
          | "aquamarine"
          | "azure"
          | "beige"
          | "bisque"
          | "blanchedalmond"
          | "blue"
          | "blueviolet"
          | "brown"
          | "burlywood"
          | "cadetblue"
          | "chartreuse"
          | "chocolate"
          | "coral"
          | "cornflowerblue"
          | "cornsilk"
          | "crimson"
          | "cyan"
          | "darkblue"
          | "darkcyan"
          | "darkgoldenrod"
          | "darkgray"
          | "darkgreen"
          | "darkgrey"
          | "darkkhaki"
          | "darkmagenta"
          | "darkolivegreen"
          | "darkorange"
          | "darkorchid"
          | "darkred"
          | "darksalmon"
          | "darkseagreen"
          | "darkslateblue"
          | "darkslategray"
          | "darkslategrey"
          | "darkturquoise"
          | "darkviolet"
          | "deeppink"
          | "deepskyblue"
          | "dimgray"
          | "dimgrey"
          | "dodgerblue"
          | "firebrick"
          | "floralwhite"
          | "forestgreen"
          | "fuchsia"
          | "gainsboro"
          | "ghostwhite"
          | "gold"
          | "goldenrod"
          | "gray"
          | "green"
          | "greenyellow"
          | "grey"
          | "honeydew"
          | "hotpink"
          | "indianred"
          | "indigo"
          | "ivory"
          | "khaki"
          | "lavender"
          | "lavenderblush"
          | "lawngreen"
          | "lemonchiffon"
          | "lightblue"
          | "lightcoral"
          | "lightcyan"
          | "lightgoldenrodyellow"
          | "lightgray"
          | "lightgreen"
          | "lightgrey"
          | "lightpink"
          | "lightsalmon"
          | "lightseagreen"
          | "lightskyblue"
          | "lightslategray"
          | "lightslategrey"
          | "lightsteelblue"
          | "lightyellow"
          | "lime"
          | "limegreen"
          | "linen"
          | "magenta"
          | "maroon"
          | "mediumaquamarine"
          | "mediumblue"
          | "mediumorchid"
          | "mediumpurple"
          | "mediumseagreen"
          | "mediumslateblue"
          | "mediumspringgreen"
          | "mediumturquoise"
          | "mediumvioletred"
          | "midnightblue"
          | "mintcream"
          | "mistyrose"
          | "moccasin"
          | "navajowhite"
          | "navy"
          | "navyblue"
          | "oldlace"
          | "olive"
          | "olivedrab"
          | "orange"
          | "orangered"
          | "orchid"
          | "palegoldenrod"
          | "palegreen"
          | "paleturquoise"
          | "palevioletred"
          | "papayawhip"
          | "peachpuff"
          | "peru"
          | "pink"
          | "plum"
          | "powderblue"
          | "purple"
          | "red"
          | "rosybrown"
          | "royalblue"
          | "saddlebrown"
          | "salmon"
          | "sandybrown"
          | "seagreen"
          | "seashell"
          | "sienna"
          | "silver"
          | "skyblue"
          | "slateblue"
          | "slategray"
          | "slategrey"
          | "snow"
          | "springgreen"
          | "steelblue"
          | "tan"
          | "teal"
          | "thistle"
          | "tomato"
          | "turquoise"
          | "violet"
          | "wheat"
          | "white"
          | "whitesmoke"
          | "yellow"
          | "yellowgreen";
        // Color in hue/sat format. A list of two integers. Hue is 0-360 and Sat is 0-100. @example [300, 70]
        hs_color?: [number, number];
        // Color in XY-format. A list of two decimal numbers between 0 and 1. @example [0.52, 0.43]
        xy_color?: object;
        // Color temperature in mireds.
        color_temp?: object;
        // Color temperature in Kelvin.
        kelvin?: number;
        // Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness, and 255 is the maximum brightness.
        brightness?: number;
        // Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness.
        brightness_pct?: number;
        // Change brightness by an amount.
        brightness_step?: number;
        // Change brightness by a percentage.
        brightness_step_pct?: number;
        // Set the light to white mode.
        white?: object;
        // Name of a light profile to use. @example relax
        profile?: string;
        // Tell light to flash, can be either value short or long.
        flash?: "long" | "short";
        // Light effect.
        effect?: string;
      }
    >;
    // Turn off one or more lights.
    turnOff: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // Tell light to flash, can be either value short or long.
        flash?: "long" | "short";
      }
    >;
    // Toggles one or more lights, from on to off, or, off to on, based on their current state.
    toggle: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue. @example [255, 100, 100]
        rgb_color?: [number, number, number];
        // A human-readable color name.
        color_name?:
          | "homeassistant"
          | "aliceblue"
          | "antiquewhite"
          | "aqua"
          | "aquamarine"
          | "azure"
          | "beige"
          | "bisque"
          | "blanchedalmond"
          | "blue"
          | "blueviolet"
          | "brown"
          | "burlywood"
          | "cadetblue"
          | "chartreuse"
          | "chocolate"
          | "coral"
          | "cornflowerblue"
          | "cornsilk"
          | "crimson"
          | "cyan"
          | "darkblue"
          | "darkcyan"
          | "darkgoldenrod"
          | "darkgray"
          | "darkgreen"
          | "darkgrey"
          | "darkkhaki"
          | "darkmagenta"
          | "darkolivegreen"
          | "darkorange"
          | "darkorchid"
          | "darkred"
          | "darksalmon"
          | "darkseagreen"
          | "darkslateblue"
          | "darkslategray"
          | "darkslategrey"
          | "darkturquoise"
          | "darkviolet"
          | "deeppink"
          | "deepskyblue"
          | "dimgray"
          | "dimgrey"
          | "dodgerblue"
          | "firebrick"
          | "floralwhite"
          | "forestgreen"
          | "fuchsia"
          | "gainsboro"
          | "ghostwhite"
          | "gold"
          | "goldenrod"
          | "gray"
          | "green"
          | "greenyellow"
          | "grey"
          | "honeydew"
          | "hotpink"
          | "indianred"
          | "indigo"
          | "ivory"
          | "khaki"
          | "lavender"
          | "lavenderblush"
          | "lawngreen"
          | "lemonchiffon"
          | "lightblue"
          | "lightcoral"
          | "lightcyan"
          | "lightgoldenrodyellow"
          | "lightgray"
          | "lightgreen"
          | "lightgrey"
          | "lightpink"
          | "lightsalmon"
          | "lightseagreen"
          | "lightskyblue"
          | "lightslategray"
          | "lightslategrey"
          | "lightsteelblue"
          | "lightyellow"
          | "lime"
          | "limegreen"
          | "linen"
          | "magenta"
          | "maroon"
          | "mediumaquamarine"
          | "mediumblue"
          | "mediumorchid"
          | "mediumpurple"
          | "mediumseagreen"
          | "mediumslateblue"
          | "mediumspringgreen"
          | "mediumturquoise"
          | "mediumvioletred"
          | "midnightblue"
          | "mintcream"
          | "mistyrose"
          | "moccasin"
          | "navajowhite"
          | "navy"
          | "navyblue"
          | "oldlace"
          | "olive"
          | "olivedrab"
          | "orange"
          | "orangered"
          | "orchid"
          | "palegoldenrod"
          | "palegreen"
          | "paleturquoise"
          | "palevioletred"
          | "papayawhip"
          | "peachpuff"
          | "peru"
          | "pink"
          | "plum"
          | "powderblue"
          | "purple"
          | "red"
          | "rosybrown"
          | "royalblue"
          | "saddlebrown"
          | "salmon"
          | "sandybrown"
          | "seagreen"
          | "seashell"
          | "sienna"
          | "silver"
          | "skyblue"
          | "slateblue"
          | "slategray"
          | "slategrey"
          | "snow"
          | "springgreen"
          | "steelblue"
          | "tan"
          | "teal"
          | "thistle"
          | "tomato"
          | "turquoise"
          | "violet"
          | "wheat"
          | "white"
          | "whitesmoke"
          | "yellow"
          | "yellowgreen";
        // Color in hue/sat format. A list of two integers. Hue is 0-360 and Sat is 0-100. @example [300, 70]
        hs_color?: [number, number];
        // Color in XY-format. A list of two decimal numbers between 0 and 1. @example [0.52, 0.43]
        xy_color?: object;
        // Color temperature in mireds.
        color_temp?: object;
        // Color temperature in Kelvin.
        kelvin?: number;
        // Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness, and 255 is the maximum brightness.
        brightness?: number;
        // Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness.
        brightness_pct?: number;
        // Set the light to white mode.
        white?: object;
        // Name of a light profile to use. @example relax
        profile?: string;
        // Tell light to flash, can be either value short or long.
        flash?: "long" | "short";
        // Light effect.
        effect?: string;
      }
    >;
  };
  logbook: {
    // Creates a custom entry in the logbook.
    log: ServiceFunction<
      T,
      {
        // Custom name for an entity, can be referenced using an `entity_id`. @example Kitchen
        name: string;
        // Message of the logbook entry. @example is being used
        message: string;
        // Entity to reference in the logbook entry.
        entity_id?: string;
        // Determines which icon is used in the logbook entry. The icon illustrates the integration domain related to this logbook entry. @example light
        domain?: string;
      }
    >;
  };
  cover: {
    // Opens a cover.
    openCover: ServiceFunction<T, object>;
    // Closes a cover.
    closeCover: ServiceFunction<T, object>;
    // Moves a cover to a specific position.
    setCoverPosition: ServiceFunction<
      T,
      {
        // Target position.
        position: number;
      }
    >;
    // Stops the cover movement.
    stopCover: ServiceFunction<T, object>;
    // Toggles a cover open/closed.
    toggle: ServiceFunction<T, object>;
    // Tilts a cover open.
    openCoverTilt: ServiceFunction<T, object>;
    // Tilts a cover to close.
    closeCoverTilt: ServiceFunction<T, object>;
    // Stops a tilting cover movement.
    stopCoverTilt: ServiceFunction<T, object>;
    // Moves a cover tilt to a specific position.
    setCoverTiltPosition: ServiceFunction<
      T,
      {
        // Target tilt positition.
        tilt_position: number;
      }
    >;
    // Toggles a cover tilt open/closed.
    toggleCoverTilt: ServiceFunction<T, object>;
  };
  group: {
    // Reloads group configuration, entities, and notify services from YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Creates/Updates a user group.
    set: ServiceFunction<
      T,
      {
        // Object ID of this group. This object ID is used as part of the entity ID. Entity ID format: [domain].[object_id]. @example test_group
        object_id: string;
        // Name of the group. @example My test group
        name?: string;
        // Name of the icon for the group. @example mdi:camera
        icon?: object;
        // List of all members in the group. Cannot be used in combination with `Add entities` or `Remove entities`. @example domain.entity_id1, domain.entity_id2
        entities?: string;
        // List of members to be added to the group. Cannot be used in combination with `Entities` or `Remove entities`. @example domain.entity_id1, domain.entity_id2
        add_entities?: string;
        // List of members to be removed from a group. Cannot be used in combination with `Entities` or `Add entities`. @example domain.entity_id1, domain.entity_id2
        remove_entities?: string;
        // Enable this option if the group should only be used when all entities are in state `on`.
        all?: boolean;
      }
    >;
    // Removes a group.
    remove: ServiceFunction<
      T,
      {
        // Object ID of this group. This object ID is used as part of the entity ID. Entity ID format: [domain].[object_id]. @example test_group
        object_id: object;
      }
    >;
  };
  inputNumber: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Sets the value.
    setValue: ServiceFunction<
      T,
      {
        // The target value.
        value: number;
      }
    >;
    // Increments the value by 1 step.
    increment: ServiceFunction<T, object>;
    // Decrements the current value by 1 step.
    decrement: ServiceFunction<T, object>;
  };
  inputButton: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Mimics the physical button press on the device.
    press: ServiceFunction<T, object>;
  };
  zone: {
    // Reloads zones from the YAML-configuration.
    reload: ServiceFunction<T, object>;
  };
  mediaPlayer: {
    // Turns on the power of the media player.
    turnOn: ServiceFunction<T, object>;
    // Turns off the power of the media player.
    turnOff: ServiceFunction<T, object>;
    // Toggles a media player on/off.
    toggle: ServiceFunction<T, object>;
    // Turns up the volume.
    volumeUp: ServiceFunction<T, object>;
    // Turns down the volume.
    volumeDown: ServiceFunction<T, object>;
    // Toggles play/pause.
    mediaPlayPause: ServiceFunction<T, object>;
    // Starts playing.
    mediaPlay: ServiceFunction<T, object>;
    // Pauses.
    mediaPause: ServiceFunction<T, object>;
    // Stops playing.
    mediaStop: ServiceFunction<T, object>;
    // Selects the next track.
    mediaNextTrack: ServiceFunction<T, object>;
    // Selects the previous track.
    mediaPreviousTrack: ServiceFunction<T, object>;
    // Clears the playlist.
    clearPlaylist: ServiceFunction<T, object>;
    // Sets the volume level.
    volumeSet: ServiceFunction<
      T,
      {
        // The volume. 0 is inaudible, 1 is the maximum volume.
        volume_level: number;
      }
    >;
    // Mutes or unmutes the media player.
    volumeMute: ServiceFunction<
      T,
      {
        // Defines whether or not it is muted.
        is_volume_muted: boolean;
      }
    >;
    // Allows you to go to a different part of the media that is currently playing.
    mediaSeek: ServiceFunction<
      T,
      {
        // Target position in the currently playing media. The format is platform dependent.
        seek_position: number;
      }
    >;
    // Groups media players together for synchronous playback. Only works on supported multiroom audio systems.
    join: ServiceFunction<
      T,
      {
        // The players which will be synced with the playback specified in `target`. @example - media_player.multiroom_player2 - media_player.multiroom_player3
        group_members: string[];
      }
    >;
    // Sends the media player the command to change input source.
    selectSource: ServiceFunction<
      T,
      {
        // Name of the source to switch to. Platform dependent. @example video1
        source: string;
      }
    >;
    // Selects a specific sound mode.
    selectSoundMode: ServiceFunction<
      T,
      {
        // Name of the sound mode to switch to. @example Music
        sound_mode?: string;
      }
    >;
    // Starts playing specified media.
    playMedia: ServiceFunction<
      T,
      {
        // The ID of the content to play. Platform dependent. @example https://home-assistant.io/images/cast/splash.png
        media_content_id: string;
        // The type of the content to play. Such as image, music, tv show, video, episode, channel, or playlist. @example music
        media_content_type: string;
        // If the content should be played now or be added to the queue.
        enqueue?: "play" | "next" | "add" | "replace";
        // If the media should be played as an announcement. @example true
        announce?: boolean;
      }
    >;
    // Playback mode that selects the media in randomized order.
    shuffleSet: ServiceFunction<
      T,
      {
        // Whether or not shuffle mode is enabled.
        shuffle: boolean;
      }
    >;
    // Removes the player from a group. Only works on platforms which support player groups.
    unjoin: ServiceFunction<T, object>;
    // Playback mode that plays the media in a loop.
    repeatSet: ServiceFunction<
      T,
      {
        // Repeat mode to set.
        repeat: "off" | "all" | "one";
      }
    >;
  };
  inputSelect: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Selects the first option.
    selectFirst: ServiceFunction<T, object>;
    // Selects the last option.
    selectLast: ServiceFunction<T, object>;
    // Select the next option.
    selectNext: ServiceFunction<
      T,
      {
        // If the option should cycle from the last to the first option on the list.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ServiceFunction<
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ServiceFunction<
      T,
      {
        // If the option should cycle from the last to the first option on the list.
        cycle?: boolean;
      }
    >;
    // Sets the options.
    setOptions: ServiceFunction<
      T,
      {
        // List of options. @example ['Item A', 'Item B', 'Item C']
        options: object;
      }
    >;
  };
  counter: {
    // Increments a counter.
    increment: ServiceFunction<T, object>;
    // Decrements a counter.
    decrement: ServiceFunction<T, object>;
    // Resets a counter.
    reset: ServiceFunction<T, object>;
    // Sets the counter value.
    setValue: ServiceFunction<
      T,
      {
        // The new counter value the entity should be set to.
        value: number;
      }
    >;
    //
    configure: ServiceFunction<T, object>;
  };
  schedule: {
    // Reloads schedules from the YAML-configuration.
    reload: ServiceFunction<T, object>;
  };
  inputDatetime: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Sets the date and/or time.
    setDatetime: ServiceFunction<
      T,
      {
        // The target date. @example '2019-04-20'
        date?: string;
        // The target time. @example '05:04:20'
        time?: object;
        // The target date & time. @example '2019-04-20 05:04:20'
        datetime?: string;
        // The target date & time, expressed by a UNIX timestamp.
        timestamp?: number;
      }
    >;
  };
  inputText: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Sets the value.
    setValue: ServiceFunction<
      T,
      {
        // The target value. @example This is an example text
        value: string;
      }
    >;
  };
  script: {
    // Reloads all the available scripts.
    reload: ServiceFunction<T, object>;
    // Runs the sequence of actions defined in a script.
    turnOn: ServiceFunction<T, object>;
    // Stops a running script.
    turnOff: ServiceFunction<T, object>;
    // Toggle a script. Starts it, if isn't running, stops it otherwise.
    toggle: ServiceFunction<T, object>;
  };
  scene: {
    // Reloads the scenes from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Activates a scene with configuration.
    apply: ServiceFunction<
      T,
      {
        // List of entities and their target state. @example light.kitchen: 'on' light.ceiling:   state: 'on'   brightness: 80
        entities: object;
        // Time it takes the devices to transition into the states defined in the scene.
        transition?: number;
      }
    >;
    // Creates a new scene.
    create: ServiceFunction<
      T,
      {
        // The entity ID of the new scene. @example all_lights
        scene_id: string;
        // List of entities and their target state. If your entities are already in the target state right now, use `snapshot_entities` instead. @example light.tv_back_light: 'on' light.ceiling:   state: 'on'   brightness: 200
        entities?: object;
        // List of entities to be included in the snapshot. By taking a snapshot, you record the current state of those entities. If you do not want to use the current state of all your entities for this scene, you can combine the `snapshot_entities` with `entities`. @example - light.ceiling - light.kitchen
        snapshot_entities?: string;
      }
    >;
    // Activates a scene.
    turnOn: ServiceFunction<
      T,
      {
        // Time it takes the devices to transition into the states defined in the scene.
        transition?: number;
      }
    >;
  };
  timer: {
    // Reloads timers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Starts a timer.
    start: ServiceFunction<
      T,
      {
        // Duration the timer requires to finish. [optional]. @example 00:01:00 or 60
        duration?: string;
      }
    >;
    // Pauses a timer.
    pause: ServiceFunction<T, object>;
    // Cancels a timer.
    cancel: ServiceFunction<T, object>;
    // Finishes a timer.
    finish: ServiceFunction<T, object>;
    // Changes a timer.
    change: ServiceFunction<
      T,
      {
        // Duration to add or subtract to the running timer. @example 00:01:00, 60 or -60
        duration: string;
      }
    >;
  };
  inputBoolean: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<T, object>;
    // Turns on the helper.
    turnOn: ServiceFunction<T, object>;
    // Turns off the helper.
    turnOff: ServiceFunction<T, object>;
    // Toggles the helper on/off.
    toggle: ServiceFunction<T, object>;
  };
  climate: {
    // Turns climate device on.
    turnOn: ServiceFunction<T, object>;
    // Turns climate device off.
    turnOff: ServiceFunction<T, object>;
    // Sets HVAC operation mode.
    setHvacMode: ServiceFunction<
      T,
      {
        // HVAC operation mode.
        hvac_mode?:
          | "off"
          | "auto"
          | "cool"
          | "dry"
          | "fan_only"
          | "heat_cool"
          | "heat";
      }
    >;
    // Sets preset mode.
    setPresetMode: ServiceFunction<
      T,
      {
        // Preset mode. @example away
        preset_mode: string;
      }
    >;
    // Turns auxiliary heater on/off.
    setAuxHeat: ServiceFunction<
      T,
      {
        // New value of auxiliary heater.
        aux_heat: boolean;
      }
    >;
    // Sets target temperature.
    setTemperature: ServiceFunction<
      T,
      {
        // Target temperature.
        temperature?: number;
        // High target temperature.
        target_temp_high?: number;
        // Low target temperature.
        target_temp_low?: number;
        // HVAC operation mode.
        hvac_mode?:
          | "off"
          | "auto"
          | "cool"
          | "dry"
          | "fan_only"
          | "heat_cool"
          | "heat";
      }
    >;
    // Sets target humidity.
    setHumidity: ServiceFunction<
      T,
      {
        // Target humidity.
        humidity: number;
      }
    >;
    // Sets fan operation mode.
    setFanMode: ServiceFunction<
      T,
      {
        // Fan operation mode. @example low
        fan_mode: string;
      }
    >;
    // Sets swing operation mode.
    setSwingMode: ServiceFunction<
      T,
      {
        // Swing operation mode. @example horizontal
        swing_mode: string;
      }
    >;
  };
  button: {
    // Press the button entity.
    press: ServiceFunction<T, object>;
  };
  alarmControlPanel: {
    // Disarms the alarm.
    alarmDisarm: ServiceFunction<
      T,
      {
        // Code to disarm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed, but someone is home_.
    alarmArmHome: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed, no one home_.
    alarmArmAway: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed for the night_.
    alarmArmNight: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed for vacation_.
    alarmArmVacation: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm while allowing to bypass a custom area.
    alarmArmCustomBypass: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Enables an external alarm trigger.
    alarmTrigger: ServiceFunction<
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
  };
  fan: {
    // Turns fan on.
    turnOn: ServiceFunction<
      T,
      {
        // Speed of the fan.
        percentage?: number;
        // Preset mode. @example auto
        preset_mode?: string;
      }
    >;
    // Turns fan off.
    turnOff: ServiceFunction<T, object>;
    // Toggles the fan on/off.
    toggle: ServiceFunction<T, object>;
    // Increases the speed of the fan.
    increaseSpeed: ServiceFunction<
      T,
      {
        // Increases the speed by a percentage step.
        percentage_step?: number;
      }
    >;
    // Decreases the speed of the fan.
    decreaseSpeed: ServiceFunction<
      T,
      {
        // Decreases the speed by a percentage step.
        percentage_step?: number;
      }
    >;
    // Controls oscillatation of the fan.
    oscillate: ServiceFunction<
      T,
      {
        // Turn on/off oscillation.
        oscillating: boolean;
      }
    >;
    // Sets the fan rotation direction.
    setDirection: ServiceFunction<
      T,
      {
        // Direction to rotate.
        direction: "forward" | "reverse";
      }
    >;
    // Sets the fan speed.
    setPercentage: ServiceFunction<
      T,
      {
        // Speed of the fan.
        percentage: number;
      }
    >;
    // Sets preset mode.
    setPresetMode: ServiceFunction<
      T,
      {
        // Preset mode. @example auto
        preset_mode: string;
      }
    >;
  };
  number: {
    // Sets the value of a number.
    setValue: ServiceFunction<
      T,
      {
        // The target value to set. @example 42
        value?: string;
      }
    >;
  };
  siren: {
    // Turns the siren on.
    turnOn: ServiceFunction<
      T,
      {
        // The tone to emit. When `available_tones` property is a map, either the key or the value can be used. Must be supported by the integration. @example fire
        tone?: string;
        // The volume. 0 is inaudible, 1 is the maximum volume. Must be supported by the integration. @example 0.5
        volume_level?: number;
        // Number of seconds the sound is played. Must be supported by the integration. @example 15
        duration?: string;
      }
    >;
    // Turns the siren off.
    turnOff: ServiceFunction<T, object>;
    // Toggles the siren on/off.
    toggle: ServiceFunction<T, object>;
  };
  lock: {
    // Unlocks a lock.
    unlock: ServiceFunction<
      T,
      {
        // Code used to unlock the lock. @example 1234
        code?: string;
      }
    >;
    // Locks a lock.
    lock: ServiceFunction<
      T,
      {
        // Code used to lock the lock. @example 1234
        code?: string;
      }
    >;
    // Opens a lock.
    open: ServiceFunction<
      T,
      {
        // Code used to open the lock. @example 1234
        code?: string;
      }
    >;
  };
  select: {
    // Selects the first option.
    selectFirst: ServiceFunction<T, object>;
    // Selects the last option.
    selectLast: ServiceFunction<T, object>;
    // Selects the next option.
    selectNext: ServiceFunction<
      T,
      {
        // If the option should cycle from the last to the first.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ServiceFunction<
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ServiceFunction<
      T,
      {
        // If the option should cycle from the first to the last.
        cycle?: boolean;
      }
    >;
  };
  automation: {
    // Triggers the actions of an automation.
    trigger: ServiceFunction<
      T,
      {
        // Defines whether or not the conditions will be skipped.
        skip_condition?: boolean;
      }
    >;
    // Toggles (enable / disable) an automation.
    toggle: ServiceFunction<T, object>;
    // Enables an automation.
    turnOn: ServiceFunction<T, object>;
    // Disables an automation.
    turnOff: ServiceFunction<
      T,
      {
        // Stops currently running actions.
        stop_actions?: boolean;
      }
    >;
    // Reloads the automation configuration.
    reload: ServiceFunction<T, object>;
  };
  camera: {
    // Enables the motion detection.
    enableMotionDetection: ServiceFunction<T, object>;
    // Disables the motion detection.
    disableMotionDetection: ServiceFunction<T, object>;
    // Turns off the camera.
    turnOff: ServiceFunction<T, object>;
    // Turns on the camera.
    turnOn: ServiceFunction<T, object>;
    // Takes a snapshot from a camera.
    snapshot: ServiceFunction<
      T,
      {
        // Template of a filename. Variable available is `entity_id`. @example /tmp/snapshot_{{ entity_id.name }}.jpg
        filename: string;
      }
    >;
    // Plays the camera stream on a supported media player.
    playStream: ServiceFunction<
      T,
      {
        // Media players to stream to.
        media_player: string;
        // Stream format supported by the media player.
        format?: "hls";
      }
    >;
    // Creates a recording of a live camera feed.
    record: ServiceFunction<
      T,
      {
        // Template of a filename. Variable available is `entity_id`. Must be mp4. @example /tmp/snapshot_{{ entity_id.name }}.mp4
        filename: string;
        // Planned duration of the recording. The actual duration may vary.
        duration?: number;
        // Planned lookback period to include in the recording (in addition to the duration). Only available if there is currently an active HLS stream. The actual length of the lookback period may vary.
        lookback?: number;
      }
    >;
  };
  deviceTracker: {
    // Records a seen tracked device.
    see: ServiceFunction<
      T,
      {
        // MAC address of the device. @example FF:FF:FF:FF:FF:FF
        mac?: string;
        // ID of the device (find the ID in `known_devices.yaml`). @example phonedave
        dev_id?: string;
        // Hostname of the device. @example Dave
        host_name?: string;
        // Name of the location where the device is located. The options are: `home`, `not_home`, or the name of the zone. @example home
        location_name?: string;
        // GPS coordinates where the device is located, specified by latitude and longitude (for example: [51.513845, -0.100539]). @example [51.509802, -0.086692]
        gps?: object;
        // Accuracy of the GPS coordinates.
        gps_accuracy?: number;
        // Battery level of the device.
        battery?: number;
      }
    >;
  };
  text: {
    // Sets the value.
    setValue: ServiceFunction<
      T,
      {
        // Enter your text. @example Hello world!
        value: string;
      }
    >;
  };
  lawnMower: {
    // Starts the mowing task.
    startMowing: ServiceFunction<T, object>;
    // Pauses the mowing task.
    pause: ServiceFunction<T, object>;
    // Stops the mowing task and returns to the dock.
    dock: ServiceFunction<T, object>;
  };
  humidifier: {
    // Turns the humidifier on.
    turnOn: ServiceFunction<T, object>;
    // Turns the humidifier off.
    turnOff: ServiceFunction<T, object>;
    // Toggles the humidifier on/off.
    toggle: ServiceFunction<T, object>;
    // Sets the humidifier operation mode.
    setMode: ServiceFunction<
      T,
      {
        // Operation mode. For example, _normal_, _eco_, or _away_. For a list of possible values, refer to the integration documentation. @example away
        mode: string;
      }
    >;
    // Sets the target humidity.
    setHumidity: ServiceFunction<
      T,
      {
        // Target humidity.
        humidity: number;
      }
    >;
  };
  waterHeater: {
    // Turns water heater on.
    turnOn: ServiceFunction<T, object>;
    // Turns water heater off.
    turnOff: ServiceFunction<T, object>;
    // Turns away mode on/off.
    setAwayMode: ServiceFunction<
      T,
      {
        // New value of away mode.
        away_mode: boolean;
      }
    >;
    // Sets the target temperature.
    setTemperature: ServiceFunction<
      T,
      {
        // New target temperature for the water heater.
        temperature: number;
        // New value of the operation mode. For a list of possible modes, refer to the integration documentation. @example eco
        operation_mode?: string;
      }
    >;
    // Sets the operation mode.
    setOperationMode: ServiceFunction<
      T,
      {
        // New value of the operation mode. For a list of possible modes, refer to the integration documentation. @example eco
        operation_mode: string;
      }
    >;
  };
  vacuum: {
    // Starts a new cleaning task.
    turnOn: ServiceFunction<T, object>;
    // Stops the current cleaning task and returns to its dock.
    turnOff: ServiceFunction<T, object>;
    //
    toggle: ServiceFunction<T, object>;
    // Starts, pauses, or resumes the cleaning task.
    startPause: ServiceFunction<T, object>;
    // Starts or resumes the cleaning task.
    start: ServiceFunction<T, object>;
    // Pauses the cleaning task.
    pause: ServiceFunction<T, object>;
    // Tells the vacuum cleaner to return to its dock.
    returnToBase: ServiceFunction<T, object>;
    // Tells the vacuum cleaner to do a spot clean-up.
    cleanSpot: ServiceFunction<T, object>;
    // Locates the vacuum cleaner robot.
    locate: ServiceFunction<T, object>;
    // Stops the current cleaning task.
    stop: ServiceFunction<T, object>;
    // Sets the fan speed of the vacuum cleaner.
    setFanSpeed: ServiceFunction<
      T,
      {
        // Fan speed. The value depends on the integration. Some integrations have speed steps, like 'medium'. Some use a percentage, between 0 and 100. @example low
        fan_speed: string;
      }
    >;
    // Sends a command to the vacuum cleaner.
    sendCommand: ServiceFunction<
      T,
      {
        // Command to execute. The commands are integration-specific. @example set_dnd_timer
        command: string;
        // Parameters for the command. The parameters are integration-specific. @example { 'key': 'value' }
        params?: object;
      }
    >;
  };
  calendar: {
    // Adds a new calendar event.
    createEvent: ServiceFunction<
      T,
      {
        // Defines the short summary or subject for the event. @example Department Party
        summary: string;
        // A more complete description of the event than the one provided by the summary. @example Meeting to provide technical review for 'Phoenix' design.
        description?: string;
        // The date and time the event should start. @example 2022-03-22 20:00:00
        start_date_time?: object;
        // The date and time the event should end. @example 2022-03-22 22:00:00
        end_date_time?: object;
        // The date the all-day event should start. @example 2022-03-22
        start_date?: object;
        // The date the all-day event should end (exclusive). @example 2022-03-23
        end_date?: object;
        // Days or weeks that you want to create the event in. @example {'days': 2} or {'weeks': 2}
        in?: object;
        // The location of the event. @example Conference Room - F123, Bldg. 002
        location?: string;
      }
    >;
    // Lists events on a calendar within a time range.
    listEvents: ServiceFunction<
      T,
      {
        // Returns active events after this time (exclusive). When not set, defaults to now. @example 2022-03-22 20:00:00
        start_date_time?: object;
        // Returns active events before this time (exclusive). Cannot be used with 'duration'. @example 2022-03-22 22:00:00
        end_date_time?: object;
        // Returns active events from start_date_time until the specified duration.
        duration?: object;
      }
    >;
  };
  remote: {
    // Turns the device off.
    turnOff: ServiceFunction<T, object>;
    // Sends the power on command.
    turnOn: ServiceFunction<
      T,
      {
        // Activity ID or activity name to be started. @example BedroomTV
        activity?: string;
      }
    >;
    // Toggles a device on/off.
    toggle: ServiceFunction<T, object>;
    // Sends a command or a list of commands to a device.
    sendCommand: ServiceFunction<
      T,
      {
        // Device ID to send command to. @example 32756745
        device?: string;
        // A single command or a list of commands to send. @example Play
        command: object;
        // The number of times you want to repeat the commands.
        num_repeats?: number;
        // The time you want to wait in between repeated commands.
        delay_secs?: number;
        // The time you want to have it held before the release is send.
        hold_secs?: number;
      }
    >;
    // Learns a command or a list of commands from a device.
    learnCommand: ServiceFunction<
      T,
      {
        // Device ID to learn command from. @example television
        device?: string;
        // A single command or a list of commands to learn. @example Turn on
        command?: object;
        // The type of command to be learned.
        command_type?: "ir" | "rf";
        // If code must be stored as an alternative. This is useful for discrete codes. Discrete codes are used for toggles that only perform one function. For example, a code to only turn a device on. If it is on already, sending the code won't change the state.
        alternative?: boolean;
        // Timeout for the command to be learned.
        timeout?: number;
      }
    >;
    // Deletes a command or a list of commands from the database.
    deleteCommand: ServiceFunction<
      T,
      {
        // Device from which commands will be deleted. @example television
        device?: string;
        // The single command or the list of commands to be deleted. @example Mute
        command: object;
      }
    >;
  };
  switch: {
    // Turns a switch off.
    turnOff: ServiceFunction<T, object>;
    // Turns a switch on.
    turnOn: ServiceFunction<T, object>;
    // Toggles a switch on/off.
    toggle: ServiceFunction<T, object>;
  };
  weather: {
    // Get weather forecast.
    getForecast: ServiceFunction<
      T,
      {
        // Forecast type: daily, hourly or twice daily.
        type: "daily" | "hourly" | "twice_daily";
      }
    >;
  };
  profiler: {
    // Starts the Profiler.
    start: ServiceFunction<
      T,
      {
        // The number of seconds to run the profiler.
        seconds?: number;
      }
    >;
    // Starts the Memory Profiler.
    memory: ServiceFunction<
      T,
      {
        // The number of seconds to run the memory profiler.
        seconds?: number;
      }
    >;
    // Starts logging growth of objects in memory.
    startLogObjects: ServiceFunction<
      T,
      {
        // The number of seconds between logging objects.
        scan_interval?: number;
      }
    >;
    // Stops logging growth of objects in memory.
    stopLogObjects: ServiceFunction<T, object>;
    // Starts logging sources of new objects in memory.
    startLogObjectSources: ServiceFunction<
      T,
      {
        // The number of seconds between logging objects.
        scan_interval?: number;
        // The maximum number of objects to log.
        max_objects?: number;
      }
    >;
    // Stops logging sources of new objects in memory.
    stopLogObjectSources: ServiceFunction<T, object>;
    // Dumps the repr of all matching objects to the log.
    dumpLogObjects: ServiceFunction<
      T,
      {
        // The type of objects to dump to the log. @example State
        type: string;
      }
    >;
    // Logs the stats of all lru caches.
    lruStats: ServiceFunction<T, object>;
    // Logs the current frames for all threads.
    logThreadFrames: ServiceFunction<T, object>;
    // Logs what is scheduled in the event loop.
    logEventLoopScheduled: ServiceFunction<T, object>;
  };
  notify: {
    // Sends a notification that is visible in the **Notifications** panel.
    persistentNotification: ServiceFunction<
      T,
      {
        // Message body of the notification. @example The garage door has been open for 10 minutes.
        message: string;
        // Title of the notification. @example Your Garage Door Friend
        title?: string;
        // Some integrations provide extended functionality. For information on how to use _data_, refer to the integration documentation.. @example platform specific
        data?: object;
      }
    >;
    // Sends a notification message using the notify service.
    notify: ServiceFunction<
      T,
      {
        // undefined @example The garage door has been open for 10 minutes.
        message: string;
        // undefined @example Your Garage Door Friend
        title?: string;
        // undefined @example platform specific
        target?: object;
        // undefined @example platform specific
        data?: object;
      }
    >;
    // Sends a notification message using the google_assistant_sdk service.
    googleAssistantSdk: ServiceFunction<
      T,
      {
        // undefined @example The garage door has been open for 10 minutes.
        message: string;
        // undefined @example Your Garage Door Friend
        title?: string;
        // undefined @example platform specific
        target?: object;
        // undefined @example platform specific
        data?: object;
      }
    >;
  };
  cast: {
    // Shows a dashboard view on a Chromecast device.
    showLovelaceView: ServiceFunction<
      T,
      {
        // Media player entity to show the dashboard view on.
        entity_id: string;
        // The URL path of the dashboard to show. @example lovelace-cast
        dashboard_path: string;
        // The path of the dashboard view to show. @example downstairs
        view_path?: string;
      }
    >;
  };
  template: {
    // Reloads template entities from the YAML-configuration.
    reload: ServiceFunction<T, object>;
  };
  google: {
    // Adds a new calendar event.
    addEvent: ServiceFunction<
      T,
      {
        // The id of the calendar you want. @example Your email
        calendar_id: string;
        // Acts as the title of the event. @example Bowling
        summary: string;
        // The description of the event. Optional. @example Birthday bowling
        description?: string;
        // The date and time the event should start. @example 2019-03-22 20:00:00
        start_date_time?: string;
        // The date and time the event should end. @example 2019-03-22 22:00:00
        end_date_time?: string;
        // The date the whole day event should start. @example 2019-03-10
        start_date?: string;
        // The date the whole day event should end. @example 2019-03-11
        end_date?: string;
        // Days or weeks that you want to create the event in. @example 'days': 2 or 'weeks': 2
        in?: object;
      }
    >;
    // Add a new calendar event.
    createEvent: ServiceFunction<
      T,
      {
        // Acts as the title of the event. @example Bowling
        summary: string;
        // The description of the event. Optional. @example Birthday bowling
        description?: string;
        // The date and time the event should start. @example 2022-03-22 20:00:00
        start_date_time?: string;
        // The date and time the event should end. @example 2022-03-22 22:00:00
        end_date_time?: string;
        // The date the whole day event should start. @example 2022-03-10
        start_date?: string;
        // The date the whole day event should end. @example 2022-03-11
        end_date?: string;
        // Days or weeks that you want to create the event in. @example 'days': 2 or 'weeks': 2
        in?: object;
        // The location of the event. Optional. @example Conference Room - F123, Bldg. 002
        location?: string;
      }
    >;
  };
}
