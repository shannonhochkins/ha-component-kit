import type { ServiceFunctionTypes, ServiceFunction } from "./";
export interface SupportedServices<T extends ServiceFunctionTypes = "target"> {
  persistentNotification: {
    // Show a notification in the frontend.
    create: ServiceFunction<
      T,
      {
        // Message body of the notification. [Templates accepted]
        message: string;
        // Optional title for your notification. [Templates accepted]
        title?: string;
        // Target ID of the notification, will replace a notification with the same ID.
        notification_id?: string;
      }
    >;
    // Remove a notification from the frontend.
    dismiss: ServiceFunction<
      T,
      {
        // Target ID of the notification, which should be removed.
        notification_id: string;
      }
    >;
  };
  homeassistant: {
    // Save the persistent states (for entities derived from RestoreEntity) immediately. Maintain the normal periodic saving interval.
    savePersistentStates: ServiceFunction<T, unknown>;
    // Generic service to turn devices off under any domain.
    turnOff: ServiceFunction<T, unknown>;
    // Generic service to turn devices on under any domain.
    turnOn: ServiceFunction<T, unknown>;
    // Generic service to toggle devices on/off under any domain
    toggle: ServiceFunction<T, unknown>;
    // Stop the Home Assistant service.
    stop: ServiceFunction<T, unknown>;
    // Restart the Home Assistant service.
    restart: ServiceFunction<T, unknown>;
    // Check the Home Assistant configuration files for errors. Errors will be displayed in the Home Assistant log.
    checkConfig: ServiceFunction<T, unknown>;
    // Force one or more entities to update its data
    updateEntity: ServiceFunction<T, unknown>;
    // Reload the core configuration.
    reloadCoreConfig: ServiceFunction<T, unknown>;
    // Update the Home Assistant location.
    setLocation: ServiceFunction<
      T,
      {
        // Latitude of your location.
        latitude: string;
        // Longitude of your location.
        longitude: string;
      }
    >;
    // Reload Jinja2 templates found in the custom_templates folder in your config. New values will be applied on the next render of the template.
    reloadCustomTemplates: ServiceFunction<T, unknown>;
    // Reload a config entry that matches a target.
    reloadConfigEntry: ServiceFunction<
      T,
      {
        // A configuration entry id
        entry_id?: string;
      }
    >;
    //
    reloadAll: ServiceFunction<T, unknown>;
  };
  systemLog: {
    // Clear all log entries.
    clear: ServiceFunction<T, unknown>;
    // Write log entry.
    write: ServiceFunction<
      T,
      {
        // Message to log.
        message: string;
        // Log level.
        level?: "debug" | "info" | "warning" | "error" | "critical";
        // Logger name under which to log the message. Defaults to 'system_log.external'.
        logger?: string;
      }
    >;
  };
  logger: {
    // Set the default log level for integrations.
    setDefaultLevel: ServiceFunction<
      T,
      {
        // Default severity level for all integrations.
        level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
      }
    >;
    // Set log level for integrations.
    setLevel: ServiceFunction<T, unknown>;
  };
  person: {
    // Reload the person configuration.
    reload: ServiceFunction<T, unknown>;
  };
  frontend: {
    // Set a theme unless the client selected per-device theme.
    setTheme: ServiceFunction<
      T,
      {
        // Name of a predefined theme
        name: object;
        // The mode the theme is for.
        mode?: "dark" | "light";
      }
    >;
    // Reload themes from YAML configuration.
    reloadThemes: ServiceFunction<T, unknown>;
  };
  recorder: {
    // Start purge task - to clean up old data from your database.
    purge: ServiceFunction<
      T,
      {
        // Number of history days to keep in database after purge.
        keep_days?: number;
        // Attempt to save disk space by rewriting the entire database file.
        repack?: boolean;
        // Apply entity_id and event_type filter in addition to time based purge.
        apply_filter?: boolean;
      }
    >;
    // Start purge task to remove specific entities from your database.
    purgeEntities: ServiceFunction<
      T,
      {
        // List the domains that need to be removed from the recorder database.
        domains?: object;
        // List the glob patterns to select entities for removal from the recorder database.
        entity_globs?: object;
        // Number of history days to keep in database of matching rows. The default of 0 days will remove all matching rows.
        keep_days?: number;
      }
    >;
    // Start the recording of events and state changes
    enable: ServiceFunction<T, unknown>;
    // Stop the recording of events and state changes
    disable: ServiceFunction<T, unknown>;
  };
  hassio: {
    // Start add-on.
    addonStart: ServiceFunction<
      T,
      {
        // The add-on slug.
        addon: object;
      }
    >;
    // Stop add-on.
    addonStop: ServiceFunction<
      T,
      {
        // The add-on slug.
        addon: object;
      }
    >;
    // Restart add-on.
    addonRestart: ServiceFunction<
      T,
      {
        // The add-on slug.
        addon: object;
      }
    >;
    // Update add-on. This service should be used with caution since add-on updates can contain breaking changes. It is highly recommended that you review release notes/change logs before updating an add-on.
    addonUpdate: ServiceFunction<
      T,
      {
        // The add-on slug.
        addon: object;
      }
    >;
    // Write data to add-on stdin.
    addonStdin: ServiceFunction<
      T,
      {
        // The add-on slug.
        addon: object;
      }
    >;
    // Poweroff the host system.
    hostShutdown: ServiceFunction<T, unknown>;
    // Reboot the host system.
    hostReboot: ServiceFunction<T, unknown>;
    // Create a full backup.
    backupFull: ServiceFunction<
      T,
      {
        // Optional (default = current date and time).
        name?: string;
        // Optional password.
        password?: string;
        // Use compressed archives
        compressed?: boolean;
        // Name of a backup network storage to put backup (or /backup)
        location?: object;
      }
    >;
    // Create a partial backup.
    backupPartial: ServiceFunction<
      T,
      {
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
    >;
    // Restore from full backup.
    restoreFull: ServiceFunction<
      T,
      {
        // Slug of backup to restore from.
        slug: string;
        // Optional password.
        password?: string;
      }
    >;
    // Restore from partial backup.
    restorePartial: ServiceFunction<
      T,
      {
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
    >;
  };
  cloud: {
    // Make instance UI available outside over NabuCasa cloud
    remoteConnect: ServiceFunction<T, unknown>;
    // Disconnect UI from NabuCasa cloud
    remoteDisconnect: ServiceFunction<T, unknown>;
  };
  tts: {
    // Say something using text-to-speech on a media player with google_translate.
    googleTranslateSay: ServiceFunction<
      T,
      {
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
    >;
    // Speak something using text-to-speech on a media player.
    speak: ServiceFunction<
      T,
      {
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
    >;
    // Remove all text-to-speech cache files and RAM cache.
    clearCache: ServiceFunction<T, unknown>;
    // Say something using text-to-speech on a media player with cloud.
    cloudSay: ServiceFunction<
      T,
      {
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
    >;
  };
  update: {
    // Install an update for this device or service
    install: ServiceFunction<
      T,
      {
        // Version to install, if omitted, the latest version will be installed.
        version?: string;
        // Backup before installing the update, if supported by the integration.
        backup?: boolean;
      }
    >;
    // Mark currently available update as skipped.
    skip: ServiceFunction<T, unknown>;
    // Removes the skipped version marker from an update.
    clearSkipped: ServiceFunction<T, unknown>;
  };
  localtuya: {
    // Reload localtuya and reconnect to all devices.
    reload: ServiceFunction<T, unknown>;
    // Change the value of a datapoint (DP)
    setDp: ServiceFunction<
      T,
      {
        // Device ID of device to change datapoint value for
        device_id?: object;
        // Datapoint index
        dp?: object;
        // New value to set
        value?: object;
      }
    >;
  };
  restCommand: {
    //
    assistantRelay: ServiceFunction<T, unknown>;
  };
  conversation: {
    // Launch a conversation from a transcribed text.
    process: ServiceFunction<
      T,
      {
        // Transcribed text
        text?: string;
        // Language of text. Defaults to server language
        language?: string;
        // Assist engine to process your request
        agent_id?: string;
      }
    >;
    //
    reload: ServiceFunction<T, unknown>;
  };
  commandLine: {
    // Reload all command_line entities
    reload: ServiceFunction<T, unknown>;
  };
  light: {
    // Turn on one or more lights and adjust properties of the light, even when they are turned on already.

    turnOn: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // Color temperature for the light in Kelvin.
        color_temp_kelvin?: number;
        // Color for the light in hue/sat format. Hue is 0-360 and Sat is 0-100.
        hs_color?: [number, number];
        // The color for the light (based on RGB - red, green, blue).
        rgb_color?: [number, number, number];
        // A list containing four integers between 0 and 255 representing the RGBW (red, green, blue, white) color for the light.
        rgbw_color?: [number, number, number, number];
        // A list containing five integers between 0 and 255 representing the RGBWW (red, green, blue, cold white, warm white) color for the light.
        rgbww_color?: [number, number, number, number, number];
        // A human readable color name.
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
    >;
    // Turns off one or more lights.
    turnOff: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // If the light should flash.
        flash?: "long" | "short";
      }
    >;
    // Toggles one or more lights, from on to off, or, off to on, based on their current state.

    toggle: ServiceFunction<
      T,
      {
        // Duration it takes to get to next state.
        transition?: number;
        // Color temperature for the light in Kelvin.
        color_temp_kelvin?: number;
        // Color for the light in hue/sat format. Hue is 0-360 and Sat is 0-100.
        hs_color?: [number, number];
        // The color for the light (based on RGB - red, green, blue).
        rgb_color?: [number, number, number];
        // A list containing four integers between 0 and 255 representing the RGBW (red, green, blue, white) color for the light.
        rgbw_color?: [number, number, number, number];
        // A list containing five integers between 0 and 255 representing the RGBWW (red, green, blue, cold white, warm white) color for the light.
        rgbww_color?: [number, number, number, number, number];
        // A human readable color name.
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
    >;
  };
  logbook: {
    // Create a custom entry in your logbook.
    log: ServiceFunction<
      T,
      {
        // Custom name for an entity, can be referenced with entity_id.
        name: string;
        // Message of the custom logbook entry.
        message: string;
        // Entity to reference in custom logbook entry.
        entity_id?: string;
        // Icon of domain to display in custom logbook entry.
        domain?: string;
      }
    >;
  };
  zone: {
    // Reload the YAML-based zone configuration.
    reload: ServiceFunction<T, unknown>;
  };
  counter: {
    // Increment a counter.
    increment: ServiceFunction<T, unknown>;
    // Decrement a counter.
    decrement: ServiceFunction<T, unknown>;
    // Reset a counter.
    reset: ServiceFunction<T, unknown>;
    // Set the counter value
    setValue: ServiceFunction<
      T,
      {
        // The new counter value the entity should be set to.
        value: number;
      }
    >;
    //
    configure: ServiceFunction<T, unknown>;
  };
  cover: {
    // Open all or specified cover.
    openCover: ServiceFunction<T, unknown>;
    // Close all or specified cover.
    closeCover: ServiceFunction<T, unknown>;
    // Move to specific position all or specified cover.
    setCoverPosition: ServiceFunction<
      T,
      {
        // Position of the cover
        position: number;
      }
    >;
    // Stop all or specified cover.
    stopCover: ServiceFunction<T, unknown>;
    // Toggle a cover open/closed.
    toggle: ServiceFunction<T, unknown>;
    // Open all or specified cover tilt.
    openCoverTilt: ServiceFunction<T, unknown>;
    // Close all or specified cover tilt.
    closeCoverTilt: ServiceFunction<T, unknown>;
    // Stop all or specified cover.
    stopCoverTilt: ServiceFunction<T, unknown>;
    // Move to specific position all or specified cover tilt.
    setCoverTiltPosition: ServiceFunction<
      T,
      {
        // Tilt position of the cover.
        tilt_position: number;
      }
    >;
    // Toggle a cover tilt open/closed.
    toggleCoverTilt: ServiceFunction<T, unknown>;
  };
  group: {
    // Reload group configuration, entities, and notify services.
    reload: ServiceFunction<T, unknown>;
    // Create/Update a user group.
    set: ServiceFunction<
      T,
      {
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
    >;
    // Remove a user group.
    remove: ServiceFunction<
      T,
      {
        // Group id and part of entity id.
        object_id: object;
      }
    >;
  };
  scene: {
    // Reload the scene configuration.
    reload: ServiceFunction<T, unknown>;
    // Activate a scene with configuration.
    apply: ServiceFunction<
      T,
      {
        // The entities and the state that they need to be.
        entities: object;
        // Transition duration it takes to bring devices to the state defined in the scene.
        transition?: number;
      }
    >;
    // Creates a new scene.
    create: ServiceFunction<
      T,
      {
        // The entity_id of the new scene.
        scene_id: string;
        // The entities to control with the scene.
        entities?: object;
        // The entities of which a snapshot is to be taken
        snapshot_entities?: object;
      }
    >;
    // Activate a scene.
    turnOn: ServiceFunction<
      T,
      {
        // Transition duration it takes to bring devices to the state defined in the scene.
        transition?: number;
      }
    >;
  };
  inputSelect: {
    // Reload the input_select configuration.
    reload: ServiceFunction<T, unknown>;
    // Select the first option of an input select entity.
    selectFirst: ServiceFunction<T, unknown>;
    // Select the last option of an input select entity.
    selectLast: ServiceFunction<T, unknown>;
    // Select the next options of an input select entity.
    selectNext: ServiceFunction<
      T,
      {
        // If the option should cycle from the last to the first.
        cycle?: boolean;
      }
    >;
    // Select an option of an input select entity.
    selectOption: ServiceFunction<
      T,
      {
        // Option to be selected.
        option: string;
      }
    >;
    // Select the previous options of an input select entity.
    selectPrevious: ServiceFunction<
      T,
      {
        // If the option should cycle from the first to the last.
        cycle?: boolean;
      }
    >;
    // Set the options of an input select entity.
    setOptions: ServiceFunction<
      T,
      {
        // Options for the input select entity.
        options: object;
      }
    >;
  };
  schedule: {
    // Reload the schedule configuration
    reload: ServiceFunction<T, unknown>;
  };
  inputNumber: {
    // Reload the input_number configuration.
    reload: ServiceFunction<T, unknown>;
    // Set the value of an input number entity.
    setValue: ServiceFunction<
      T,
      {
        // The target value the entity should be set to.
        value: number;
      }
    >;
    // Increment the value of an input number entity by its stepping.
    increment: ServiceFunction<T, unknown>;
    // Decrement the value of an input number entity by its stepping.
    decrement: ServiceFunction<T, unknown>;
  };
  inputButton: {
    //
    reload: ServiceFunction<T, unknown>;
    // Press the input button entity.
    press: ServiceFunction<T, unknown>;
  };
  inputDatetime: {
    // Reload the input_datetime configuration.
    reload: ServiceFunction<T, unknown>;
    // This can be used to dynamically set the date and/or time.
    setDatetime: ServiceFunction<
      T,
      {
        // The target date the entity should be set to.
        date?: string;
        // The target time the entity should be set to.
        time?: object;
        // The target date & time the entity should be set to.
        datetime?: string;
        // The target date & time the entity should be set to as expressed by a UNIX timestamp.
        timestamp?: number;
      }
    >;
  };
  timer: {
    //
    reload: ServiceFunction<T, unknown>;
    // Start a timer
    start: ServiceFunction<
      T,
      {
        // Duration the timer requires to finish. [optional]
        duration?: string;
      }
    >;
    // Pause a timer.
    pause: ServiceFunction<T, unknown>;
    // Cancel a timer.
    cancel: ServiceFunction<T, unknown>;
    // Finish a timer.
    finish: ServiceFunction<T, unknown>;
    // Change a timer
    change: ServiceFunction<
      T,
      {
        // Duration to add or subtract to the running timer
        duration: string;
      }
    >;
  };
  script: {
    //
    gamingLightColorChanger: ServiceFunction<T, unknown>;
    //
    randomLightColour: ServiceFunction<T, unknown>;
    // Reload all the available scripts
    reload: ServiceFunction<T, unknown>;
    // Turn on script
    turnOn: ServiceFunction<T, unknown>;
    // Turn off script
    turnOff: ServiceFunction<T, unknown>;
    // Toggle script
    toggle: ServiceFunction<T, unknown>;
  };
  inputText: {
    // Reload the input_text configuration.
    reload: ServiceFunction<T, unknown>;
    // Set the value of an input text entity.
    setValue: ServiceFunction<
      T,
      {
        // The target value the entity should be set to.
        value: string;
      }
    >;
  };
  deconz: {
    // Configure attributes of either a device endpoint in deCONZ or the deCONZ service itself.
    configure: ServiceFunction<
      T,
      {
        // Represents a specific device endpoint in deCONZ.
        entity?: string;
        // String representing a full path to deCONZ endpoint (when entity is not specified) or a subpath of the device path for the entity (when entity is specified).
        field?: string;
        // JSON object with what data you want to alter.
        data: object;
        // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
        bridgeid?: string;
      }
    >;
    // Refresh available devices from deCONZ.
    deviceRefresh: ServiceFunction<
      T,
      {
        // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
        bridgeid?: string;
      }
    >;
    // Clean up device and entity registry entries orphaned by deCONZ.
    removeOrphanedEntries: ServiceFunction<
      T,
      {
        // Unique string for each deCONZ hardware. It can be found as part of the integration name. Useful if you run multiple deCONZ integrations.
        bridgeid?: string;
      }
    >;
  };
  inputBoolean: {
    // Reload the input_boolean configuration
    reload: ServiceFunction<T, unknown>;
    // Turn on an input boolean
    turnOn: ServiceFunction<T, unknown>;
    // Turn off an input boolean
    turnOff: ServiceFunction<T, unknown>;
    // Toggle an input boolean
    toggle: ServiceFunction<T, unknown>;
  };
  climate: {
    // Turn climate device on.
    turnOn: ServiceFunction<T, unknown>;
    // Turn climate device off.
    turnOff: ServiceFunction<T, unknown>;
    // Set HVAC operation mode for climate device.
    setHvacMode: ServiceFunction<
      T,
      {
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
    >;
    // Set preset mode for climate device.
    setPresetMode: ServiceFunction<
      T,
      {
        // New value of preset mode.
        preset_mode: string;
      }
    >;
    // Turn auxiliary heater on/off for climate device.
    setAuxHeat: ServiceFunction<
      T,
      {
        // New value of auxiliary heater.
        aux_heat: boolean;
      }
    >;
    // Set target temperature of climate device.
    setTemperature: ServiceFunction<
      T,
      {
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
    >;
    // Set target humidity of climate device.
    setHumidity: ServiceFunction<
      T,
      {
        // New target humidity for climate device.
        humidity: number;
      }
    >;
    // Set fan operation for climate device.
    setFanMode: ServiceFunction<
      T,
      {
        // New value of fan mode.
        fan_mode: string;
      }
    >;
    // Set swing operation for climate device.
    setSwingMode: ServiceFunction<
      T,
      {
        // New value of swing mode.
        swing_mode: string;
      }
    >;
  };
  mediaPlayer: {
    // Turn a media player power on.
    turnOn: ServiceFunction<T, unknown>;
    // Turn a media player power off.
    turnOff: ServiceFunction<T, unknown>;
    // Toggles a media player power state.
    toggle: ServiceFunction<T, unknown>;
    // Turn a media player volume up.
    volumeUp: ServiceFunction<T, unknown>;
    // Turn a media player volume down.
    volumeDown: ServiceFunction<T, unknown>;
    // Toggle media player play/pause state.
    mediaPlayPause: ServiceFunction<T, unknown>;
    // Send the media player the command for play.
    mediaPlay: ServiceFunction<T, unknown>;
    // Send the media player the command for pause.
    mediaPause: ServiceFunction<T, unknown>;
    // Send the media player the stop command.
    mediaStop: ServiceFunction<T, unknown>;
    // Send the media player the command for next track.
    mediaNextTrack: ServiceFunction<T, unknown>;
    // Send the media player the command for previous track.
    mediaPreviousTrack: ServiceFunction<T, unknown>;
    // Send the media player the command to clear players playlist.
    clearPlaylist: ServiceFunction<T, unknown>;
    // Set a media player's volume level.
    volumeSet: ServiceFunction<
      T,
      {
        // Volume level to set as float.
        volume_level: number;
      }
    >;
    // Mute a media player's volume.
    volumeMute: ServiceFunction<
      T,
      {
        // True/false for mute/unmute.
        is_volume_muted: boolean;
      }
    >;
    // Send the media player the command to seek in current playing media.
    mediaSeek: ServiceFunction<
      T,
      {
        // Position to seek to. The format is platform dependent.
        seek_position: number;
      }
    >;
    // Group players together. Only works on platforms with support for player groups.
    join: ServiceFunction<
      T,
      {
        // The players which will be synced with the target player.
        group_members: string;
      }
    >;
    // Send the media player the command to change input source.
    selectSource: ServiceFunction<
      T,
      {
        // Name of the source to switch to. Platform dependent.
        source: string;
      }
    >;
    // Send the media player the command to change sound mode.
    selectSoundMode: ServiceFunction<
      T,
      {
        // Name of the sound mode to switch to.
        sound_mode?: string;
      }
    >;
    // Send the media player the command for playing media.
    playMedia: ServiceFunction<
      T,
      {
        // The ID of the content to play. Platform dependent.
        media_content_id: string;
        // The type of the content to play. Like image, music, tvshow, video, episode, channel or playlist.
        media_content_type: string;
        // If the content should be played now or be added to the queue.
        enqueue?: "play" | "next" | "add" | "replace";
        // If the media should be played as an announcement.
        announce?: boolean;
      }
    >;
    // Set shuffling state.
    shuffleSet: ServiceFunction<
      T,
      {
        // True/false for enabling/disabling shuffle.
        shuffle: boolean;
      }
    >;
    // Unjoin the player from a group. Only works on platforms with support for player groups.
    unjoin: ServiceFunction<T, unknown>;
    // Set repeat mode
    repeatSet: ServiceFunction<
      T,
      {
        // Repeat mode to set.
        repeat: "off" | "all" | "one";
      }
    >;
  };
  alarmControlPanel: {
    // Send the alarm the command for disarm.
    alarmDisarm: ServiceFunction<
      T,
      {
        // An optional code to disarm the alarm control panel with.
        code?: string;
      }
    >;
    // Send the alarm the command for arm home.
    alarmArmHome: ServiceFunction<
      T,
      {
        // An optional code to arm home the alarm control panel with.
        code?: string;
      }
    >;
    // Send the alarm the command for arm away.
    alarmArmAway: ServiceFunction<
      T,
      {
        // An optional code to arm away the alarm control panel with.
        code?: string;
      }
    >;
    // Send the alarm the command for arm night.
    alarmArmNight: ServiceFunction<
      T,
      {
        // An optional code to arm night the alarm control panel with.
        code?: string;
      }
    >;
    // Send the alarm the command for arm vacation.
    alarmArmVacation: ServiceFunction<
      T,
      {
        // An optional code to arm vacation the alarm control panel with.
        code?: string;
      }
    >;
    // Send arm custom bypass command.
    alarmArmCustomBypass: ServiceFunction<
      T,
      {
        // An optional code to arm custom bypass the alarm control panel with.
        code?: string;
      }
    >;
    // Send the alarm the command for trigger.
    alarmTrigger: ServiceFunction<
      T,
      {
        // An optional code to trigger the alarm control panel with.
        code?: string;
      }
    >;
  };
  button: {
    // Press the button entity.
    press: ServiceFunction<T, unknown>;
  };
  number: {
    // Set the value of a Number entity.
    setValue: ServiceFunction<
      T,
      {
        // The target value the entity should be set to.
        value?: string;
      }
    >;
  };
  lock: {
    // Unlock all or specified locks.
    unlock: ServiceFunction<
      T,
      {
        // An optional code to unlock the lock with.
        code?: string;
      }
    >;
    // Lock all or specified locks.
    lock: ServiceFunction<
      T,
      {
        // An optional code to lock the lock with.
        code?: string;
      }
    >;
    // Open all or specified locks.
    open: ServiceFunction<
      T,
      {
        // An optional code to open the lock with.
        code?: string;
      }
    >;
  };
  fan: {
    // Turn fan on.
    turnOn: ServiceFunction<
      T,
      {
        // Speed setting.
        speed?: string;
        // Percentage speed setting.
        percentage?: number;
        // Preset mode setting.
        preset_mode?: string;
      }
    >;
    // Turn fan off.
    turnOff: ServiceFunction<T, unknown>;
    // Toggle the fan on/off.
    toggle: ServiceFunction<T, unknown>;
    // Increase the speed of the fan by one speed or a percentage_step.
    increaseSpeed: ServiceFunction<
      T,
      {
        // Increase speed by a percentage.
        percentage_step?: number;
      }
    >;
    // Decrease the speed of the fan by one speed or a percentage_step.
    decreaseSpeed: ServiceFunction<
      T,
      {
        // Decrease speed by a percentage.
        percentage_step?: number;
      }
    >;
    // Oscillate the fan.
    oscillate: ServiceFunction<
      T,
      {
        // Flag to turn on/off oscillation.
        oscillating: boolean;
      }
    >;
    // Set the fan rotation.
    setDirection: ServiceFunction<
      T,
      {
        // The direction to rotate.
        direction: "forward" | "reverse";
      }
    >;
    // Set fan speed percentage.
    setPercentage: ServiceFunction<
      T,
      {
        // Percentage speed setting.
        percentage: number;
      }
    >;
    // Set preset mode for a fan device.
    setPresetMode: ServiceFunction<
      T,
      {
        // New value of preset mode.
        preset_mode: string;
      }
    >;
  };
  siren: {
    // Turn siren on.
    turnOn: ServiceFunction<
      T,
      {
        // The tone to emit when turning the siren on. When `available_tones` property is a map, either the key or the value can be used. Must be supported by the integration.
        tone?: string;
        // The volume level of the noise to emit when turning the siren on. Must be supported by the integration.
        volume_level?: number;
        // The duration in seconds of the noise to emit when turning the siren on. Must be supported by the integration.
        duration?: string;
      }
    >;
    // Turn siren off.
    turnOff: ServiceFunction<T, unknown>;
    // Toggles a siren.
    toggle: ServiceFunction<T, unknown>;
  };
  select: {
    // Select the first option of an select entity.
    selectFirst: ServiceFunction<T, unknown>;
    // Select the last option of an select entity.
    selectLast: ServiceFunction<T, unknown>;
    // Select the next options of an select entity.
    selectNext: ServiceFunction<
      T,
      {
        // If the option should cycle from the last to the first.
        cycle?: boolean;
      }
    >;
    // Select an option of an select entity.
    selectOption: ServiceFunction<
      T,
      {
        // Option to be selected.
        option: string;
      }
    >;
    // Select the previous options of an select entity.
    selectPrevious: ServiceFunction<
      T,
      {
        // If the option should cycle from the first to the last.
        cycle?: boolean;
      }
    >;
  };
  remote: {
    // Sends the Power Off Command.
    turnOff: ServiceFunction<T, unknown>;
    // Sends the Power On Command.
    turnOn: ServiceFunction<
      T,
      {
        // Activity ID or Activity Name to start.
        activity?: string;
      }
    >;
    // Toggles a device.
    toggle: ServiceFunction<T, unknown>;
    // Sends a command or a list of commands to a device.
    sendCommand: ServiceFunction<
      T,
      {
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
    >;
    // Learns a command or a list of commands from a device.
    learnCommand: ServiceFunction<
      T,
      {
        // Device ID to learn command from.
        device?: string;
        // A single command or a list of commands to learn.
        command?: object;
        // The type of command to be learned.
        command_type?: "ir" | "rf";
        // If code must be stored as alternative (useful for discrete remotes).
        alternative?: boolean;
        // Timeout for the command to be learned.
        timeout?: number;
      }
    >;
    // Deletes a command or a list of commands from the database.
    deleteCommand: ServiceFunction<
      T,
      {
        // Name of the device from which commands will be deleted.
        device?: string;
        // A single command or a list of commands to delete.
        command: object;
      }
    >;
  };
  ffmpeg: {
    // Send a start command to a ffmpeg based sensor.
    start: ServiceFunction<
      T,
      {
        // Name of entity that will start. Platform dependent.
        entity_id?: string;
      }
    >;
    // Send a stop command to a ffmpeg based sensor.
    stop: ServiceFunction<
      T,
      {
        // Name of entity that will stop. Platform dependent.
        entity_id?: string;
      }
    >;
    // Send a restart command to a ffmpeg based sensor.
    restart: ServiceFunction<
      T,
      {
        // Name of entity that will restart. Platform dependent.
        entity_id?: string;
      }
    >;
  };
  profiler: {
    // Start the Profiler
    start: ServiceFunction<
      T,
      {
        // The number of seconds to run the profiler.
        seconds?: number;
      }
    >;
    // Start the Memory Profiler
    memory: ServiceFunction<
      T,
      {
        // The number of seconds to run the memory profiler.
        seconds?: number;
      }
    >;
    // Start logging growth of objects in memory
    startLogObjects: ServiceFunction<
      T,
      {
        // The number of seconds between logging objects.
        scan_interval?: number;
      }
    >;
    // Stop logging growth of objects in memory.
    stopLogObjects: ServiceFunction<T, unknown>;
    // Start logging sources of new objects in memory
    startLogObjectSources: ServiceFunction<
      T,
      {
        // The number of seconds between logging objects.
        scan_interval?: number;
        // The maximum number of objects to log.
        max_objects?: number;
      }
    >;
    // Stop logging sources of new objects in memory.
    stopLogObjectSources: ServiceFunction<T, unknown>;
    // Dump the repr of all matching objects to the log.
    dumpLogObjects: ServiceFunction<
      T,
      {
        // The type of objects to dump to the log.
        type: string;
      }
    >;
    // Log the stats of all lru caches.
    lruStats: ServiceFunction<T, unknown>;
    // Log the current frames for all threads.
    logThreadFrames: ServiceFunction<T, unknown>;
    // Log what is scheduled in the event loop.
    logEventLoopScheduled: ServiceFunction<T, unknown>;
  };
  wakeOnLan: {
    // Send a 'magic packet' to wake up a device with 'Wake-On-LAN' capabilities.
    sendMagicPacket: ServiceFunction<
      T,
      {
        // MAC address of the device to wake up.
        mac: string;
        // Broadcast IP where to send the magic packet.
        broadcast_address?: string;
        // Port where to send the magic packet.
        broadcast_port?: number;
      }
    >;
  };
  switch: {
    // Turn a switch off
    turnOff: ServiceFunction<T, unknown>;
    // Turn a switch on
    turnOn: ServiceFunction<T, unknown>;
    // Toggles a switch state
    toggle: ServiceFunction<T, unknown>;
  };
  mqtt: {
    // Publish a message to an MQTT topic.
    publish: ServiceFunction<
      T,
      {
        // Topic to publish payload.
        topic: string;
        // Payload to publish.
        payload?: string;
        // Template to render as payload value. Ignored if payload given.
        payload_template?: object;
        // Quality of Service to use.
        qos?: "0" | "1" | "2";
        // If message should have the retain flag set.
        retain?: boolean;
      }
    >;
    // Dump messages on a topic selector to the 'mqtt_dump.txt' file in your configuration folder.
    dump: ServiceFunction<
      T,
      {
        // topic to listen to
        topic?: string;
        // how long we should listen for messages in seconds
        duration?: number;
      }
    >;
    // Reload all MQTT entities from YAML.
    reload: ServiceFunction<T, unknown>;
  };
  samsungtvSmart: {
    // Send to samsung TV the command to change picture mode.
    selectPictureMode: ServiceFunction<
      T,
      {
        // Name of the target entity
        entity_id: string;
        // Name of the picture mode to switch to. Possible options can be found in the picture_mode_list state attribute.
        picture_mode: string;
      }
    >;
    // Send to samsung TV the command to set art mode.
    setArtMode: ServiceFunction<
      T,
      {
        // Name of the target entity
        entity_id: string;
      }
    >;
  };
  notify: {
    // Sends a notification that is visible in the front-end.
    persistentNotification: ServiceFunction<
      T,
      {
        // Message body of the notification.
        message: string;
        // Title for your notification.
        title?: string;
      }
    >;
    // Sends a notification message using the mobile_app_natashas_iphone integration.
    mobileAppNatashasIphone: ServiceFunction<
      T,
      {
        // Message body of the notification.
        message: string;
        // Title for your notification.
        title?: string;
        // An array of targets to send the notification to. Optional depending on the platform.
        target?: object;
        // Extended information for notification. Optional depending on the platform.
        data?: object;
      }
    >;
    // Sends a notification message using the mobile_app_sm_t220 integration.
    mobileAppSmT220: ServiceFunction<
      T,
      {
        // Message body of the notification.
        message: string;
        // Title for your notification.
        title?: string;
        // An array of targets to send the notification to. Optional depending on the platform.
        target?: object;
        // Extended information for notification. Optional depending on the platform.
        data?: object;
      }
    >;
    // Sends a notification message using the mobile_app_shannons_phone integration.
    mobileAppShannonsPhone: ServiceFunction<
      T,
      {
        // Message body of the notification.
        message: string;
        // Title for your notification.
        title?: string;
        // An array of targets to send the notification to. Optional depending on the platform.
        target?: object;
        // Extended information for notification. Optional depending on the platform.
        data?: object;
      }
    >;
    // Sends a notification message using the notify service.
    notify: ServiceFunction<
      T,
      {
        // Message body of the notification.
        message: string;
        // Title for your notification.
        title?: string;
        // An array of targets to send the notification to. Optional depending on the platform.
        target?: object;
        // Extended information for notification. Optional depending on the platform.
        data?: object;
      }
    >;
  };
  camera: {
    // Enable the motion detection in a camera.
    enableMotionDetection: ServiceFunction<T, unknown>;
    // Disable the motion detection in a camera.
    disableMotionDetection: ServiceFunction<T, unknown>;
    // Turn off camera.
    turnOff: ServiceFunction<T, unknown>;
    // Turn on camera.
    turnOn: ServiceFunction<T, unknown>;
    // Take a snapshot from a camera.
    snapshot: ServiceFunction<
      T,
      {
        // Template of a Filename. Variable is entity_id.
        filename: string;
      }
    >;
    // Play camera stream on supported media player.
    playStream: ServiceFunction<
      T,
      {
        // Name(s) of media player to stream to.
        media_player: string;
        // Stream format supported by media player.
        format?: "hls";
      }
    >;
    // Record live camera feed.
    record: ServiceFunction<
      T,
      {
        // Template of a Filename. Variable is entity_id. Must be mp4.
        filename: string;
        // Target recording length.
        duration?: number;
        // Target lookback period to include in addition to duration. Only available if there is currently an active HLS stream.
        lookback?: number;
      }
    >;
  };
  deviceTracker: {
    // Control tracked device.
    see: ServiceFunction<
      T,
      {
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
    >;
  };
  text: {
    // Set value of a text entity.
    setValue: ServiceFunction<
      T,
      {
        // Value to set.
        value: string;
      }
    >;
  };
  vacuum: {
    // Start a new cleaning task.
    turnOn: ServiceFunction<T, unknown>;
    // Stop the current cleaning task and return to home.
    turnOff: ServiceFunction<T, unknown>;
    //
    toggle: ServiceFunction<T, unknown>;
    // Start, pause, or resume the cleaning task.
    startPause: ServiceFunction<T, unknown>;
    // Start or resume the cleaning task.
    start: ServiceFunction<T, unknown>;
    // Pause the cleaning task.
    pause: ServiceFunction<T, unknown>;
    // Tell the vacuum cleaner to return to its dock.
    returnToBase: ServiceFunction<T, unknown>;
    // Tell the vacuum cleaner to do a spot clean-up.
    cleanSpot: ServiceFunction<T, unknown>;
    // Locate the vacuum cleaner robot.
    locate: ServiceFunction<T, unknown>;
    // Stop the current cleaning task.
    stop: ServiceFunction<T, unknown>;
    // Set the fan speed of the vacuum cleaner.
    setFanSpeed: ServiceFunction<
      T,
      {
        // Platform dependent vacuum cleaner fan speed, with speed steps, like 'medium' or by percentage, between 0 and 100.
        fan_speed: string;
      }
    >;
    // Send a raw command to the vacuum cleaner.
    sendCommand: ServiceFunction<
      T,
      {
        // Command to execute.
        command: string;
        // Parameters for the command.
        params?: object;
      }
    >;
  };
  humidifier: {
    // Turn humidifier device on.
    turnOn: ServiceFunction<T, unknown>;
    // Turn humidifier device off.
    turnOff: ServiceFunction<T, unknown>;
    // Toggles a humidifier device.
    toggle: ServiceFunction<T, unknown>;
    // Set mode for humidifier device.
    setMode: ServiceFunction<
      T,
      {
        // New mode
        mode: string;
      }
    >;
    // Set target humidity of humidifier device.
    setHumidity: ServiceFunction<
      T,
      {
        // New target humidity for humidifier device.
        humidity: number;
      }
    >;
  };
  automation: {
    // Trigger the actions of an automation.
    trigger: ServiceFunction<
      T,
      {
        // Whether or not the conditions will be skipped.
        skip_condition?: boolean;
      }
    >;
    // Toggle (enable / disable) an automation.
    toggle: ServiceFunction<T, unknown>;
    // Enable an automation.
    turnOn: ServiceFunction<T, unknown>;
    // Disable an automation.
    turnOff: ServiceFunction<
      T,
      {
        // Stop currently running actions.
        stop_actions?: boolean;
      }
    >;
    // Reload the automation configuration.
    reload: ServiceFunction<T, unknown>;
  };
  cast: {
    // Show a Lovelace view on a Chromecast.
    showLovelaceView: ServiceFunction<
      T,
      {
        // Media Player entity to show the Lovelace view on.
        entity_id: string;
        // The URL path of the Lovelace dashboard to show.
        dashboard_path: string;
        // The path of the Lovelace view to show.
        view_path?: string;
      }
    >;
  };
  template: {
    // Reload all template entities.
    reload: ServiceFunction<T, unknown>;
  };
  tplink: {
    // Set a random effect
    randomEffect: ServiceFunction<
      T,
      {
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
    >;
    // Set a sequence effect
    sequenceEffect: ServiceFunction<
      T,
      {
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
    >;
  };
  ring: {
    // Updates the data we have for all your ring devices
    update: ServiceFunction<T, unknown>;
  };
  nodered: {
    // Trigger a Node-RED Node
    trigger: ServiceFunction<
      T,
      {
        // Entity Id to trigger the event node with. Only needed if the node is not triggered by a single entity.
        trigger_entity_id?: object;
        // Skip conditions of the node (defaults to false)
        skip_condition?: object;
        // Which output of the node to use (defaults to true, the top output). Only used when skip_condition is set to true.
        output_path?: object;
        // The payload the node will output when triggered. Works only when triggering an entity node, not an event node.
        payload?: object;
      }
    >;
  };
}
