// this is an auto generated file, do not change this manually

import type { ActionFunctionTypes, ActionFunction } from "./";
export interface DefaultActions<T extends ActionFunctionTypes = "target"> {
  homeassistant: {
    // Saves the persistent states immediately. Maintains the normal periodic saving interval.
    savePersistentStates: ActionFunction<object, T, object>;
    // Generic action to turn devices off under any domain.
    turnOff: ActionFunction<object, T, object>;
    // Generic action to turn devices on under any domain.
    turnOn: ActionFunction<object, T, object>;
    // Generic action to toggle devices on/off under any domain.
    toggle: ActionFunction<object, T, object>;
    // Stops Home Assistant.
    stop: ActionFunction<object, T, object>;
    // Restarts Home Assistant.
    restart: ActionFunction<object, T, object>;
    // Checks the Home Assistant YAML-configuration files for errors. Errors will be shown in the Home Assistant logs.
    checkConfig: ActionFunction<object, T, object>;
    // Forces one or more entities to update its data.
    updateEntity: ActionFunction<
      object,
      T,
      {
        // List of entities to force update.
        entity_id: string;
      }
    >;
    // Reloads the core configuration from the YAML-configuration.
    reloadCoreConfig: ActionFunction<object, T, object>;
    // Updates the Home Assistant location.
    setLocation: ActionFunction<
      object,
      T,
      {
        // Latitude of your location. @example 32.87336 @constraints  number: mode: box, min: -90, max: 90, step: any
        latitude: number;
        // Longitude of your location. @example 117.22743 @constraints  number: mode: box, min: -180, max: 180, step: any
        longitude: number;
        // Elevation of your location above sea level. @example 120 @constraints  number: mode: box, step: any
        elevation?: number;
      }
    >;
    // Reloads Jinja2 templates found in the `custom_templates` folder in your config. New values will be applied on the next render of the template.
    reloadCustomTemplates: ActionFunction<object, T, object>;
    // Reloads the specified config entry.
    reloadConfigEntry: ActionFunction<
      object,
      T,
      {
        // The configuration entry ID of the entry to be reloaded. @example 8955375327824e14ba89e4b29cc3ec9a
        entry_id?: string;
      }
    >;
    // Reload all YAML configuration that can be reloaded without restarting Home Assistant.
    reloadAll: ActionFunction<object, T, object>;
  };
  persistentNotification: {
    // Shows a notification on the notifications panel.
    create: ActionFunction<
      object,
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
    // Deletes a notification from the notifications panel.
    dismiss: ActionFunction<
      object,
      T,
      {
        // ID of the notification to be deleted. @example 1234
        notification_id: string;
      }
    >;
    // Deletes all notifications from the notifications panel.
    dismissAll: ActionFunction<object, T, object>;
  };
  systemLog: {
    // Deletes all log entries.
    clear: ActionFunction<object, T, object>;
    // Write log entry.
    write: ActionFunction<
      object,
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
    setDefaultLevel: ActionFunction<
      object,
      T,
      {
        // Default severity level for all integrations.
        level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
      }
    >;
    // Sets the log level for one or more integrations.
    setLevel: ActionFunction<object, T, object>;
  };
  person: {
    // Reloads persons from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  frontend: {
    // Sets the default theme Home Assistant uses. Can be overridden by a user.
    setTheme: ActionFunction<
      object,
      T,
      {
        // Name of a theme. @example default
        name: string;
        // Theme mode.
        mode?: "dark" | "light";
      }
    >;
    // Reloads themes from the YAML-configuration.
    reloadThemes: ActionFunction<object, T, object>;
  };
  recorder: {
    // Starts purge task - to clean up old data from your database.
    purge: ActionFunction<
      object,
      T,
      {
        // Number of days to keep the data in the database. Starting today, counting backward. A value of `7` means that everything older than a week will be purged. @constraints  number: min: 0, max: 365, unit_of_measurement: days
        keep_days?: number;
        // Attempt to save disk space by rewriting the entire database file.
        repack?: boolean;
        // Apply `entity_id` and `event_type` filters in addition to time-based purge.
        apply_filter?: boolean;
      }
    >;
    // Starts a purge task to remove the data related to specific entities from your database.
    purgeEntities: ActionFunction<
      object,
      T,
      {
        // List of entities for which the data is to be removed from the recorder database.
        entity_id?: string;
        // List of domains for which the data needs to be removed from the recorder database. @example sun
        domains?: object;
        // List of glob patterns used to select the entities for which the data is to be removed from the recorder database. @example domain*.object_id*
        entity_globs?: object;
        // Number of days to keep the data for rows matching the filter. Starting today, counting backward. A value of `7` means that everything older than a week will be purged. The default of 0 days will remove all matching rows immediately. @constraints  number: min: 0, max: 365, unit_of_measurement: days
        keep_days?: number;
      }
    >;
    // Starts the recording of events and state changes.
    enable: ActionFunction<object, T, object>;
    // Stops the recording of events and state changes.
    disable: ActionFunction<object, T, object>;
  };
  hassio: {
    // Starts an add-on.
    addonStart: ActionFunction<
      object,
      T,
      {
        // The add-on to start. @example core_ssh
        addon: string;
      }
    >;
    // Stops an add-on.
    addonStop: ActionFunction<
      object,
      T,
      {
        // The add-on to stop. @example core_ssh
        addon: string;
      }
    >;
    // Restarts an add-on.
    addonRestart: ActionFunction<
      object,
      T,
      {
        // The add-on to restart. @example core_ssh
        addon: string;
      }
    >;
    // Updates an add-on. This action should be used with caution since add-on updates can contain breaking changes. It is highly recommended that you review release notes/change logs before updating an add-on.
    addonUpdate: ActionFunction<
      object,
      T,
      {
        // The add-on to update. @example core_ssh
        addon: string;
      }
    >;
    // Writes data to the add-on's standard input.
    addonStdin: ActionFunction<
      object,
      T,
      {
        // The add-on to write to. @example core_ssh
        addon: string;
      }
    >;
    // Powers off the host system.
    hostShutdown: ActionFunction<object, T, object>;
    // Reboots the host system.
    hostReboot: ActionFunction<object, T, object>;
    // Creates a full backup.
    backupFull: ActionFunction<
      object,
      T,
      {
        // Optional (default = current date and time). @example Backup 1
        name?: string;
        // Password to protect the backup with. @example password
        password?: string;
        // Compresses the backup files.
        compressed?: boolean;
        // Name of a backup network storage to host backups. @example my_backup_mount
        location?: string;
        // Exclude the Home Assistant database file from backup
        homeassistant_exclude_database?: boolean;
      }
    >;
    // Creates a partial backup.
    backupPartial: ActionFunction<
      object,
      T,
      {
        // Includes Home Assistant settings in the backup.
        homeassistant?: boolean;
        // Exclude the Home Assistant database file from backup
        homeassistant_exclude_database?: boolean;
        // List of add-ons to include in the backup. Use the name slug of each add-on. @example core_ssh,core_samba,core_mosquitto
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
        location?: string;
      }
    >;
    // Restores from full backup.
    restoreFull: ActionFunction<
      object,
      T,
      {
        // Slug of backup to restore from.
        slug: string;
        // Optional password. @example password
        password?: string;
      }
    >;
    // Restores from a partial backup.
    restorePartial: ActionFunction<
      object,
      T,
      {
        // Slug of backup to restore from.
        slug: string;
        // Restores Home Assistant.
        homeassistant?: boolean;
        // List of directories to restore from the backup. @example homeassistant,share
        folders?: object;
        // List of add-ons to restore from the backup. Use the name slug of each add-on. @example core_ssh,core_samba,core_mosquitto
        addons?: object;
        // Optional password. @example password
        password?: string;
      }
    >;
  };
  update: {
    // Installs an update for a device or service.
    install: ActionFunction<
      object,
      T,
      {
        // The version to install. If omitted, the latest version will be installed. @example 1.0.0
        version?: string;
        // If supported by the integration, this creates a backup before starting the update.
        backup?: boolean;
      }
    >;
    // Marks currently available update as skipped.
    skip: ActionFunction<object, T, object>;
    // Removes the skipped version marker from an update.
    clearSkipped: ActionFunction<object, T, object>;
  };
  cloud: {
    // Makes the instance UI accessible from outside of the local network by enabling your Home Assistant Cloud connection.
    remoteConnect: ActionFunction<object, T, object>;
    // Disconnects the instance UI from Home Assistant Cloud. This disables access to it from outside your local network.
    remoteDisconnect: ActionFunction<object, T, object>;
  };
  tts: {
    // Speaks something using text-to-speech on a media player.
    speak: ActionFunction<
      object,
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
    clearCache: ActionFunction<object, T, object>;
    // Say something using text-to-speech on a media player with cloud.
    cloudSay: ActionFunction<
      object,
      T,
      {
        //
        entity_id: string;
        //  @example My name is hanna
        message: string;
        //
        cache?: boolean;
        //  @example ru
        language?: string;
        //  @example platform specific
        options?: object;
      }
    >;
    // Say something using text-to-speech on a media player with google_translate.
    googleTranslateSay: ActionFunction<
      object,
      T,
      {
        //
        entity_id: string;
        //  @example My name is hanna
        message: string;
        //
        cache?: boolean;
        //  @example ru
        language?: string;
        //  @example platform specific
        options?: object;
      }
    >;
  };
  scene: {
    // Activates a scene.
    turnOn: ActionFunction<
      object,
      T,
      {
        // Time it takes the devices to transition into the states defined in the scene. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
      }
    >;
    // Reloads the scenes from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Activates a scene with configuration.
    apply: ActionFunction<
      object,
      T,
      {
        // List of entities and their target state. @example light.kitchen: 'on' light.ceiling:   state: 'on'   brightness: 80
        entities: object;
        // Time it takes the devices to transition into the states defined in the scene. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
      }
    >;
    // Creates a new scene.
    create: ActionFunction<
      object,
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
    // Deletes a dynamically created scene.
    delete: ActionFunction<object, T, object>;
  };
  group: {
    // Reloads group configuration, entities, and notify services from YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Creates/Updates a group.
    set: ActionFunction<
      object,
      T,
      {
        // Object ID of this group. This object ID is used as part of the entity ID. Entity ID format: [domain].[object_id]. @example test_group
        object_id: string;
        // Name of the group. @example My test group
        name?: string;
        // Name of the icon for the group. @example mdi:camera
        icon?: string;
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
    remove: ActionFunction<
      object,
      T,
      {
        // Object ID of this group. This object ID is used as part of the entity ID. Entity ID format: [domain].[object_id]. @example test_group
        object_id: object;
      }
    >;
  };
  mediaPlayer: {
    // Turns on the power of the media player.
    turnOn: ActionFunction<object, T, object>;
    // Turns off the power of the media player.
    turnOff: ActionFunction<object, T, object>;
    // Toggles a media player on/off.
    toggle: ActionFunction<object, T, object>;
    // Turns up the volume.
    volumeUp: ActionFunction<object, T, object>;
    // Turns down the volume.
    volumeDown: ActionFunction<object, T, object>;
    // Toggles play/pause.
    mediaPlayPause: ActionFunction<object, T, object>;
    // Starts playing.
    mediaPlay: ActionFunction<object, T, object>;
    // Pauses.
    mediaPause: ActionFunction<object, T, object>;
    // Stops playing.
    mediaStop: ActionFunction<object, T, object>;
    // Selects the next track.
    mediaNextTrack: ActionFunction<object, T, object>;
    // Selects the previous track.
    mediaPreviousTrack: ActionFunction<object, T, object>;
    // Removes all items from the playlist.
    clearPlaylist: ActionFunction<object, T, object>;
    // Sets the volume level.
    volumeSet: ActionFunction<
      object,
      T,
      {
        // The volume. 0 is inaudible, 1 is the maximum volume. @constraints  number: min: 0, max: 1, step: 0.01
        volume_level: number;
      }
    >;
    // Mutes or unmutes the media player.
    volumeMute: ActionFunction<
      object,
      T,
      {
        // Defines whether or not it is muted.
        is_volume_muted: boolean;
      }
    >;
    // Allows you to go to a different part of the media that is currently playing.
    mediaSeek: ActionFunction<
      object,
      T,
      {
        // Target position in the currently playing media. The format is platform dependent. @constraints  number: min: 0, max: 9223372036854776000, step: 0.01, mode: box
        seek_position: number;
      }
    >;
    // Groups media players together for synchronous playback. Only works on supported multiroom audio systems.
    join: ActionFunction<
      object,
      T,
      {
        // The players which will be synced with the playback specified in `target`. @example - media_player.multiroom_player2 - media_player.multiroom_player3
        group_members: string[];
      }
    >;
    // Sends the media player the command to change input source.
    selectSource: ActionFunction<
      object,
      T,
      {
        // Name of the source to switch to. Platform dependent. @example video1
        source: string;
      }
    >;
    // Selects a specific sound mode.
    selectSoundMode: ActionFunction<
      object,
      T,
      {
        // Name of the sound mode to switch to. @example Music
        sound_mode?: string;
      }
    >;
    // Starts playing specified media.
    playMedia: ActionFunction<
      object,
      T,
      {
        // The ID of the content to play. Platform dependent. @example https://home-assistant.io/images/cast/splash.png
        media_content_id: string | number;
        // The type of the content to play. Such as image, music, tv show, video, episode, channel, or playlist. @example music
        media_content_type: string;
        // If the content should be played now or be added to the queue.
        enqueue?: "play" | "next" | "add" | "replace";
        // If the media should be played as an announcement. @example true
        announce?: boolean;
      }
    >;
    // Playback mode that selects the media in randomized order.
    shuffleSet: ActionFunction<
      object,
      T,
      {
        // Whether or not shuffle mode is enabled.
        shuffle: boolean;
      }
    >;
    // Removes the player from a group. Only works on platforms which support player groups.
    unjoin: ActionFunction<object, T, object>;
    // Playback mode that plays the media in a loop.
    repeatSet: ActionFunction<
      object,
      T,
      {
        // Repeat mode to set.
        repeat: "off" | "all" | "one";
      }
    >;
  };
  light: {
    // Turn on one or more lights and adjust properties of the light, even when they are turned on already.
    turnOn: ActionFunction<
      object,
      T,
      {
        // Duration it takes to get to next state. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
        // The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue. @example [255, 100, 100]
        rgb_color?: [number, number, number];
        // Color temperature in Kelvin. @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
        kelvin?: number | object;
        // Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        brightness_pct?: number;
        // Change brightness by a percentage. @constraints  number: min: -100, max: 100, unit_of_measurement: %
        brightness_step_pct?: number;
        // Light effect.
        effect?: string;
        //  @example [255, 100, 100, 50]
        rgbw_color?: [number, number, number, number];
        //  @example [255, 100, 100, 50, 70]
        rgbww_color?: [number, number, number, number, number];
        //
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
        //  @example [300, 70]
        hs_color?: [number, number];
        //  @example [0.52, 0.43]
        xy_color?: [number, number];
        //  @constraints  color_temp: unit: mired, min: 153, max: 500
        color_temp?: number | object;
        //  @constraints  number: min: 0, max: 255
        brightness?: number;
        //  @constraints  number: min: -225, max: 255
        brightness_step?: number;
        //
        white?: boolean;
        //  @example relax
        profile?: string;
        //
        flash?: "long" | "short";
      }
    >;
    // Turn off one or more lights.
    turnOff: ActionFunction<
      object,
      T,
      {
        // Duration it takes to get to next state. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
        //
        flash?: "long" | "short";
      }
    >;
    // Toggles one or more lights, from on to off, or, off to on, based on their current state.
    toggle: ActionFunction<
      object,
      T,
      {
        // Duration it takes to get to next state. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
        // The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue. @example [255, 100, 100]
        rgb_color?: [number, number, number];
        // Color temperature in Kelvin. @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
        kelvin?: number | object;
        // Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        brightness_pct?: number;
        // Light effect.
        effect?: string;
        //  @example [255, 100, 100, 50]
        rgbw_color?: [number, number, number, number];
        //  @example [255, 100, 100, 50, 70]
        rgbww_color?: [number, number, number, number, number];
        //
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
        //  @example [300, 70]
        hs_color?: [number, number];
        //  @example [0.52, 0.43]
        xy_color?: [number, number];
        //  @constraints  color_temp: unit: mired, min: 153, max: 500
        color_temp?: number | object;
        //  @constraints  number: min: 0, max: 255
        brightness?: number;
        //
        white?: boolean;
        //  @example relax
        profile?: string;
        //
        flash?: "long" | "short";
      }
    >;
  };
  logbook: {
    // Creates a custom entry in the logbook.
    log: ActionFunction<
      object,
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
  zone: {
    // Reloads zones from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  inputSelect: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Selects the first option.
    selectFirst: ActionFunction<object, T, object>;
    // Selects the last option.
    selectLast: ActionFunction<object, T, object>;
    // Select the next option.
    selectNext: ActionFunction<
      object,
      T,
      {
        // If the option should cycle from the last to the first option on the list.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ActionFunction<
      object,
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ActionFunction<
      object,
      T,
      {
        // If the option should cycle from the last to the first option on the list.
        cycle?: boolean;
      }
    >;
    // Sets the options.
    setOptions: ActionFunction<
      object,
      T,
      {
        // List of options. @example ['Item A', 'Item B', 'Item C']
        options: string;
      }
    >;
  };
  inputNumber: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Sets the value.
    setValue: ActionFunction<
      object,
      T,
      {
        // The target value. @constraints  number: min: 0, max: 9223372036854776000, step: 0.001, mode: box
        value: number;
      }
    >;
    // Increments the current value by 1 step.
    increment: ActionFunction<object, T, object>;
    // Decrements the current value by 1 step.
    decrement: ActionFunction<object, T, object>;
  };
  inputButton: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Mimics the physical button press on the device.
    press: ActionFunction<object, T, object>;
  };
  script: {
    //
    nightlightPower: ActionFunction<object, T, object>;
    // Reloads all the available scripts.
    reload: ActionFunction<object, T, object>;
    // Runs the sequence of actions defined in a script.
    turnOn: ActionFunction<object, T, object>;
    // Stops a running script.
    turnOff: ActionFunction<object, T, object>;
    // Starts a script if it isn't running, stops it otherwise.
    toggle: ActionFunction<object, T, object>;
  };
  camera: {
    // Enables the motion detection.
    enableMotionDetection: ActionFunction<object, T, object>;
    // Disables the motion detection.
    disableMotionDetection: ActionFunction<object, T, object>;
    // Turns off the camera.
    turnOff: ActionFunction<object, T, object>;
    // Turns on the camera.
    turnOn: ActionFunction<object, T, object>;
    // Takes a snapshot from a camera.
    snapshot: ActionFunction<
      object,
      T,
      {
        // Full path to filename. @example /tmp/snapshot_{{ entity_id.name }}.jpg
        filename: string;
      }
    >;
    // Plays the camera stream on a supported media player.
    playStream: ActionFunction<
      object,
      T,
      {
        // Media players to stream to.
        media_player: string;
        // Stream format supported by the media player.
        format?: "hls";
      }
    >;
    // Creates a recording of a live camera feed.
    record: ActionFunction<
      object,
      T,
      {
        // Full path to filename. Must be mp4. @example /tmp/snapshot_{{ entity_id.name }}.mp4
        filename: string;
        // Planned duration of the recording. The actual duration may vary. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        duration?: number;
        // Planned lookback period to include in the recording (in addition to the duration). Only available if there is currently an active HLS stream. The actual length of the lookback period may vary. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        lookback?: number;
      }
    >;
  };
  timer: {
    // Reloads timers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Starts a timer or restarts it with a provided duration.
    start: ActionFunction<
      object,
      T,
      {
        // Custom duration to restart the timer with. @example 00:01:00 or 60
        duration?: string;
      }
    >;
    // Pauses a running timer, retaining the remaining duration for later continuation.
    pause: ActionFunction<object, T, object>;
    // Resets a timer's duration to the last known initial value without firing the timer finished event.
    cancel: ActionFunction<object, T, object>;
    // Finishes a running timer earlier than scheduled.
    finish: ActionFunction<object, T, object>;
    // Changes a timer by adding or subtracting a given duration.
    change: ActionFunction<
      object,
      T,
      {
        // Duration to add to or subtract from the running timer. @example 00:01:00, 60 or -60
        duration: string;
      }
    >;
  };
  inputBoolean: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Turns on the helper.
    turnOn: ActionFunction<object, T, object>;
    // Turns off the helper.
    turnOff: ActionFunction<object, T, object>;
    // Toggles the helper on/off.
    toggle: ActionFunction<object, T, object>;
  };
  conversation: {
    // Launches a conversation from a transcribed text.
    process: ActionFunction<
      object,
      T,
      {
        // Transcribed text input. @example Turn all lights on
        text: string;
        // Language of text. Defaults to server language. @example NL
        language?: string;
        // Conversation agent to process your request. The conversation agent is the brains of your assistant. It processes the incoming text commands. @example homeassistant
        agent_id?: string;
        // ID of the conversation, to be able to continue a previous conversation @example my_conversation_1
        conversation_id?: string;
      }
    >;
    // Reloads the intent configuration.
    reload: ActionFunction<
      object,
      T,
      {
        // Language to clear cached intents for. Defaults to server language. @example NL
        language?: string;
        // Conversation agent to reload. @example homeassistant
        agent_id?: string;
      }
    >;
  };
  lock: {
    // Unlocks a lock.
    unlock: ActionFunction<
      object,
      T,
      {
        // Code used to unlock the lock. @example 1234
        code?: string;
      }
    >;
    // Locks a lock.
    lock: ActionFunction<
      object,
      T,
      {
        // Code used to lock the lock. @example 1234
        code?: string;
      }
    >;
    // Opens a lock.
    open: ActionFunction<
      object,
      T,
      {
        // Code used to open the lock. @example 1234
        code?: string;
      }
    >;
  };
  valve: {
    // Opens a valve.
    openValve: ActionFunction<object, T, object>;
    // Closes a valve.
    closeValve: ActionFunction<object, T, object>;
    // Moves a valve to a specific position.
    setValvePosition: ActionFunction<
      object,
      T,
      {
        // Target position. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        position: number;
      }
    >;
    // Stops the valve movement.
    stopValve: ActionFunction<object, T, object>;
    // Toggles a valve open/closed.
    toggle: ActionFunction<object, T, object>;
  };
  cover: {
    // Opens a cover.
    openCover: ActionFunction<object, T, object>;
    // Closes a cover.
    closeCover: ActionFunction<object, T, object>;
    // Moves a cover to a specific position.
    setCoverPosition: ActionFunction<
      object,
      T,
      {
        // Target position. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        position: number;
      }
    >;
    // Stops the cover movement.
    stopCover: ActionFunction<object, T, object>;
    // Toggles a cover open/closed.
    toggle: ActionFunction<object, T, object>;
    // Tilts a cover open.
    openCoverTilt: ActionFunction<object, T, object>;
    // Tilts a cover to close.
    closeCoverTilt: ActionFunction<object, T, object>;
    // Stops a tilting cover movement.
    stopCoverTilt: ActionFunction<object, T, object>;
    // Moves a cover tilt to a specific position.
    setCoverTiltPosition: ActionFunction<
      object,
      T,
      {
        // Target tilt positition. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        tilt_position: number;
      }
    >;
    // Toggles a cover tilt open/closed.
    toggleCoverTilt: ActionFunction<object, T, object>;
  };
  switch: {
    // Turns a switch off.
    turnOff: ActionFunction<object, T, object>;
    // Turns a switch on.
    turnOn: ActionFunction<object, T, object>;
    // Toggles a switch on/off.
    toggle: ActionFunction<object, T, object>;
  };
  alarmControlPanel: {
    // Disarms the alarm.
    alarmDisarm: ActionFunction<
      object,
      T,
      {
        // Code to disarm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed, but someone is home_.
    alarmArmHome: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed, no one home_.
    alarmArmAway: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed for the night_.
    alarmArmNight: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Sets the alarm to: _armed for vacation_.
    alarmArmVacation: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm while allowing to bypass a custom area.
    alarmArmCustomBypass: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Trigger the alarm manually.
    alarmTrigger: ActionFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
  };
  vacuum: {
    // Starts or resumes the cleaning task.
    start: ActionFunction<object, T, object>;
    // Pauses the cleaning task.
    pause: ActionFunction<object, T, object>;
    // Tells the vacuum cleaner to return to its dock.
    returnToBase: ActionFunction<object, T, object>;
    // Tells the vacuum cleaner to do a spot clean-up.
    cleanSpot: ActionFunction<object, T, object>;
    // Locates the vacuum cleaner robot.
    locate: ActionFunction<object, T, object>;
    // Stops the current cleaning task.
    stop: ActionFunction<object, T, object>;
    // Sets the fan speed of the vacuum cleaner.
    setFanSpeed: ActionFunction<
      object,
      T,
      {
        // Fan speed. The value depends on the integration. Some integrations have speed steps, like 'medium'. Some use a percentage, between 0 and 100. @example low
        fan_speed: string;
      }
    >;
    // Sends a command to the vacuum cleaner.
    sendCommand: ActionFunction<
      object,
      T,
      {
        // Command to execute. The commands are integration-specific. @example set_dnd_timer
        command: string;
        // Parameters for the command. The parameters are integration-specific. @example { 'key': 'value' }
        params?: object;
      }
    >;
  };
  inputDatetime: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Sets the date and/or time.
    setDatetime: ActionFunction<
      object,
      T,
      {
        // The target date. @example '2019-04-20'
        date?: string;
        // The target time. @example '05:04:20'
        time?: string;
        // The target date & time. @example '2019-04-20 05:04:20'
        datetime?: string;
        // The target date & time, expressed by a UNIX timestamp. @constraints  number: min: 0, max: 9223372036854776000, mode: box
        timestamp?: number;
      }
    >;
  };
  restCommand: {
    //
    assistantRelay: ActionFunction<object, T, object>;
    // Reloads RESTful commands from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  commandLine: {
    // Reloads command line configuration from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  template: {
    // Reloads template entities from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  schedule: {
    // Reloads schedules from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
  };
  inputText: {
    // Reloads helpers from the YAML-configuration.
    reload: ActionFunction<object, T, object>;
    // Sets the value.
    setValue: ActionFunction<
      object,
      T,
      {
        // The target value. @example This is an example text
        value: string;
      }
    >;
  };
  counter: {
    // Increments a counter by its step size.
    increment: ActionFunction<object, T, object>;
    // Decrements a counter by its step size.
    decrement: ActionFunction<object, T, object>;
    // Resets a counter to its initial value.
    reset: ActionFunction<object, T, object>;
    // Sets the counter to a specific value.
    setValue: ActionFunction<
      object,
      T,
      {
        // The new counter value the entity should be set to. @constraints  number: min: 0, max: 9223372036854776000, mode: box
        value: number;
      }
    >;
  };
  mediaExtractor: {
    // Extract media URL from a service.
    extractMediaUrl: ActionFunction<
      object,
      T,
      {
        // URL where the media can be found. @example https://www.youtube.com/watch?v=dQw4w9WgXcQ
        url: string;
        // Youtube-dl query to select the quality of the result. @example best
        format_query?: string;
      }
    >;
    // Downloads file from given URL.
    playMedia: ActionFunction<
      object,
      T,
      {
        // The ID of the content to play. Platform dependent. @example https://soundcloud.com/bruttoband/brutto-11
        media_content_id: string | number;
        // The type of the content to play. Must be one of MUSIC, TVSHOW, VIDEO, EPISODE, CHANNEL or PLAYLIST MUSIC.
        media_content_type: "CHANNEL" | "EPISODE" | "PLAYLIST MUSIC" | "MUSIC" | "TVSHOW" | "VIDEO";
      }
    >;
  };
  cast: {
    // Shows a dashboard view on a Chromecast device.
    showLovelaceView: ActionFunction<
      object,
      T,
      {
        // Media player entity to show the dashboard view on.
        entity_id: string;
        // The URL path of the dashboard to show. @example lovelace-cast
        dashboard_path: string;
        // The URL path of the dashboard view to show. @example downstairs
        view_path?: string;
      }
    >;
  };
  reolink: {
    // Plays a ringtone on a Reolink Chime.
    playChime: ActionFunction<
      object,
      T,
      {
        // The Reolink Chime to play the ringtone on.
        device_id: string;
        // Ringtone to play.
        ringtone:
          | "citybird"
          | "originaltune"
          | "pianokey"
          | "loop"
          | "attraction"
          | "hophop"
          | "goodday"
          | "operetta"
          | "moonlight"
          | "waybackhome";
      }
    >;
    // Moves the camera with a specific speed.
    ptzMove: ActionFunction<
      object,
      T,
      {
        // PTZ move speed. @constraints  number: min: 1, max: 64, step: 1
        speed: number;
      }
    >;
  };
  assistSatellite: {
    // Let the satellite announce a message.
    announce: ActionFunction<
      object,
      T,
      {
        // The message to announce. @example Time to wake up!
        message?: string;
        // The media ID to announce instead of using text-to-speech.
        media_id?: string;
      }
    >;
  };
  lawnMower: {
    // Starts the mowing task.
    startMowing: ActionFunction<object, T, object>;
    // Pauses the mowing task.
    pause: ActionFunction<object, T, object>;
    // Stops the mowing task and returns to the dock.
    dock: ActionFunction<object, T, object>;
  };
  profiler: {
    // Starts the Profiler.
    start: ActionFunction<
      object,
      T,
      {
        // The number of seconds to run the profiler. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        seconds?: number;
      }
    >;
    // Starts the Memory Profiler.
    memory: ActionFunction<
      object,
      T,
      {
        // The number of seconds to run the memory profiler. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        seconds?: number;
      }
    >;
    // Starts logging growth of objects in memory.
    startLogObjects: ActionFunction<
      object,
      T,
      {
        // The number of seconds between logging objects. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        scan_interval?: number;
      }
    >;
    // Stops logging growth of objects in memory.
    stopLogObjects: ActionFunction<object, T, object>;
    // Starts logging sources of new objects in memory.
    startLogObjectSources: ActionFunction<
      object,
      T,
      {
        // The number of seconds between logging objects. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        scan_interval?: number;
        // The maximum number of objects to log. @constraints  number: min: 1, max: 30, unit_of_measurement: objects
        max_objects?: number;
      }
    >;
    // Stops logging sources of new objects in memory.
    stopLogObjectSources: ActionFunction<object, T, object>;
    // Dumps the repr of all matching objects to the log.
    dumpLogObjects: ActionFunction<
      object,
      T,
      {
        // The type of objects to dump to the log. @example State
        type: string;
      }
    >;
    // Logs the stats of all lru caches.
    lruStats: ActionFunction<object, T, object>;
    // Logs the current frames for all threads.
    logThreadFrames: ActionFunction<object, T, object>;
    // Logs what is scheduled in the event loop.
    logEventLoopScheduled: ActionFunction<object, T, object>;
    // Enable or disable asyncio debug.
    setAsyncioDebug: ActionFunction<
      object,
      T,
      {
        // Whether to enable or disable asyncio debug.
        enabled?: boolean;
      }
    >;
    // Logs all the current asyncio tasks.
    logCurrentTasks: ActionFunction<object, T, object>;
  };
  notify: {
    // Sends a notification message.
    sendMessage: ActionFunction<
      object,
      T,
      {
        // Your notification message.
        message: string;
        // Title for your notification message.
        title?: string;
      }
    >;
    // Sends a notification that is visible in the notifications panel.
    persistentNotification: ActionFunction<
      object,
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
    notify: ActionFunction<
      object,
      T,
      {
        //  @example The garage door has been open for 10 minutes.
        message: string;
        //  @example Your Garage Door Friend
        title?: string;
        //  @example platform specific
        target?: object;
        //  @example platform specific
        data?: object;
      }
    >;
    // Sends a notification message using the google_assistant_sdk service.
    googleAssistantSdk: ActionFunction<
      object,
      T,
      {
        //  @example The garage door has been open for 10 minutes.
        message: string;
        //  @example Your Garage Door Friend
        title?: string;
        //  @example platform specific
        target?: object;
        //  @example platform specific
        data?: object;
      }
    >;
  };
  deviceTracker: {
    // Manually update the records of a seen legacy device tracker in the known_devices.yaml file.
    see: ActionFunction<
      object,
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
        // Accuracy of the GPS coordinates. @constraints  number: min: 0, mode: box, unit_of_measurement: m
        gps_accuracy?: number;
        // Battery level of the device. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        battery?: number;
      }
    >;
  };
  number: {
    // Sets the value of a number.
    setValue: ActionFunction<
      object,
      T,
      {
        // The target value to set. @example 42
        value?: string;
      }
    >;
  };
  select: {
    // Selects the first option.
    selectFirst: ActionFunction<object, T, object>;
    // Selects the last option.
    selectLast: ActionFunction<object, T, object>;
    // Selects the next option.
    selectNext: ActionFunction<
      object,
      T,
      {
        // If the option should cycle from the last to the first.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ActionFunction<
      object,
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ActionFunction<
      object,
      T,
      {
        // If the option should cycle from the first to the last.
        cycle?: boolean;
      }
    >;
  };
  calendar: {
    // Adds a new calendar event.
    createEvent: ActionFunction<
      object,
      T,
      {
        // Defines the short summary or subject for the event. @example Department Party
        summary: string;
        // A more complete description of the event than the one provided by the summary. @example Meeting to provide technical review for 'Phoenix' design.
        description?: string;
        // The date and time the event should start. @example 2022-03-22 20:00:00
        start_date_time?: string;
        // The date and time the event should end. @example 2022-03-22 22:00:00
        end_date_time?: string;
        // The date the all-day event should start. @example 2022-03-22
        start_date?: string;
        // The date the all-day event should end (exclusive). @example 2022-03-23
        end_date?: string;
        // Days or weeks that you want to create the event in. @example {'days': 2} or {'weeks': 2}
        in?: object;
        // The location of the event. @example Conference Room - F123, Bldg. 002
        location?: string;
      }
    >;
    // Get events on a calendar within a time range.
    getEvents: ActionFunction<
      object,
      T,
      {
        // Returns active events after this time (exclusive). When not set, defaults to now. @example 2022-03-22 20:00:00
        start_date_time?: string;
        // Returns active events before this time (exclusive). Cannot be used with Duration. @example 2022-03-22 22:00:00
        end_date_time?: string;
        // Returns active events from Start time for the specified duration.
        duration?: {
          hours?: number;
          days?: number;
          minutes?: number;
          seconds?: number;
        };
      }
    >;
  };
  remote: {
    // Sends the turn off command.
    turnOff: ActionFunction<object, T, object>;
    // Sends the turn on command.
    turnOn: ActionFunction<
      object,
      T,
      {
        // Activity ID or activity name to be started. @example BedroomTV
        activity?: string;
      }
    >;
    // Sends the toggle command.
    toggle: ActionFunction<object, T, object>;
    // Sends a command or a list of commands to a device.
    sendCommand: ActionFunction<
      object,
      T,
      {
        // Device ID to send command to. @example 32756745
        device?: string;
        // A single command or a list of commands to send. @example Play
        command: object;
        // The number of times you want to repeat the commands. @constraints  number: min: 0, max: 255
        num_repeats?: number;
        // The time you want to wait in between repeated commands. @constraints  number: min: 0, max: 60, step: 0.1, unit_of_measurement: seconds
        delay_secs?: number;
        // The time you want to have it held before the release is send. @constraints  number: min: 0, max: 60, step: 0.1, unit_of_measurement: seconds
        hold_secs?: number;
      }
    >;
    // Learns a command or a list of commands from a device.
    learnCommand: ActionFunction<
      object,
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
        // Timeout for the command to be learned. @constraints  number: min: 0, max: 60, step: 5, unit_of_measurement: seconds
        timeout?: number;
      }
    >;
    // Deletes a command or a list of commands from the database.
    deleteCommand: ActionFunction<
      object,
      T,
      {
        // Device from which commands will be deleted. @example television
        device?: string;
        // The single command or the list of commands to be deleted. @example Mute
        command: object;
      }
    >;
  };
  weather: {
    // Get weather forecasts.
    getForecasts: ActionFunction<
      object,
      T,
      {
        // Forecast type: daily, hourly or twice daily.
        type: "daily" | "hourly" | "twice_daily";
      }
    >;
  };
  climate: {
    // Turns climate device on.
    turnOn: ActionFunction<object, T, object>;
    // Turns climate device off.
    turnOff: ActionFunction<object, T, object>;
    // Toggles climate device, from on to off, or off to on.
    toggle: ActionFunction<object, T, object>;
    // Sets HVAC operation mode.
    setHvacMode: ActionFunction<
      object,
      T,
      {
        // HVAC operation mode.
        hvac_mode?: "off" | "auto" | "cool" | "dry" | "fan_only" | "heat_cool" | "heat";
      }
    >;
    // Sets preset mode.
    setPresetMode: ActionFunction<
      object,
      T,
      {
        // Preset mode. @example away
        preset_mode: string;
      }
    >;
    // Turns auxiliary heater on/off.
    setAuxHeat: ActionFunction<
      object,
      T,
      {
        // New value of auxiliary heater.
        aux_heat: boolean;
      }
    >;
    // Sets the temperature setpoint.
    setTemperature: ActionFunction<
      object,
      T,
      {
        // The temperature setpoint. @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        temperature?: number;
        // The max temperature setpoint. @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        target_temp_high?: number;
        // The min temperature setpoint. @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        target_temp_low?: number;
        // HVAC operation mode.
        hvac_mode?: "off" | "auto" | "cool" | "dry" | "fan_only" | "heat_cool" | "heat";
      }
    >;
    // Sets target humidity.
    setHumidity: ActionFunction<
      object,
      T,
      {
        // Target humidity. @constraints  number: min: 30, max: 99, unit_of_measurement: %
        humidity: number;
      }
    >;
    // Sets fan operation mode.
    setFanMode: ActionFunction<
      object,
      T,
      {
        // Fan operation mode. @example low
        fan_mode: string;
      }
    >;
    // Sets swing operation mode.
    setSwingMode: ActionFunction<
      object,
      T,
      {
        // Swing operation mode. @example on
        swing_mode: string;
      }
    >;
    // Sets horizontal swing operation mode.
    setSwingHorizontalMode: ActionFunction<
      object,
      T,
      {
        // Horizontal swing operation mode. @example on
        swing_horizontal_mode: string;
      }
    >;
  };
  button: {
    // Press the button entity.
    press: ActionFunction<object, T, object>;
  };
  siren: {
    // Turns the siren on.
    turnOn: ActionFunction<
      object,
      T,
      {
        // The tone to emit. When `available_tones` property is a map, either the key or the value can be used. Must be supported by the integration. @example fire
        tone?: string;
        // The volume. 0 is inaudible, 1 is the maximum volume. Must be supported by the integration. @example 0.5 @constraints  number: min: 0, max: 1, step: 0.05
        volume_level?: number;
        // Number of seconds the sound is played. Must be supported by the integration. @example 15
        duration?: string;
      }
    >;
    // Turns the siren off.
    turnOff: ActionFunction<object, T, object>;
    // Toggles the siren on/off.
    toggle: ActionFunction<object, T, object>;
  };
  fan: {
    // Turns fan on.
    turnOn: ActionFunction<
      object,
      T,
      {
        // Speed of the fan. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage?: number;
        // Preset fan mode. @example auto
        preset_mode?: string;
      }
    >;
    // Turns fan off.
    turnOff: ActionFunction<object, T, object>;
    // Toggles a fan on/off.
    toggle: ActionFunction<object, T, object>;
    // Increases the speed of a fan.
    increaseSpeed: ActionFunction<
      object,
      T,
      {
        // Percentage step by which the speed should be increased. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage_step?: number;
      }
    >;
    // Decreases the speed of a fan.
    decreaseSpeed: ActionFunction<
      object,
      T,
      {
        // Percentage step by which the speed should be decreased. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage_step?: number;
      }
    >;
    // Controls the oscillation of a fan.
    oscillate: ActionFunction<
      object,
      T,
      {
        // Turns oscillation on/off.
        oscillating: boolean;
      }
    >;
    // Sets a fan's rotation direction.
    setDirection: ActionFunction<
      object,
      T,
      {
        // Direction of the fan rotation.
        direction: "forward" | "reverse";
      }
    >;
    // Sets the speed of a fan.
    setPercentage: ActionFunction<
      object,
      T,
      {
        // Speed of the fan. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage: number;
      }
    >;
    // Sets preset fan mode.
    setPresetMode: ActionFunction<
      object,
      T,
      {
        // Preset fan mode. @example auto
        preset_mode: string;
      }
    >;
  };
  google: {
    // Adds a new calendar event.
    addEvent: ActionFunction<
      object,
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
    // Adds a new calendar event.
    createEvent: ActionFunction<
      object,
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
  automation: {
    // Triggers the actions of an automation.
    trigger: ActionFunction<
      object,
      T,
      {
        // Defines whether or not the conditions will be skipped.
        skip_condition?: boolean;
      }
    >;
    // Toggles (enable / disable) an automation.
    toggle: ActionFunction<object, T, object>;
    // Enables an automation.
    turnOn: ActionFunction<object, T, object>;
    // Disables an automation.
    turnOff: ActionFunction<
      object,
      T,
      {
        // Stops currently running actions.
        stop_actions?: boolean;
      }
    >;
    // Reloads the automation configuration.
    reload: ActionFunction<object, T, object>;
  };
  text: {
    // Sets the value.
    setValue: ActionFunction<
      object,
      T,
      {
        // Enter your text. @example Hello world!
        value: string;
      }
    >;
  };
}
/**
 * @deprecated use the DefaultActions interface instead
 * */
export type DefaultServices<T extends ActionFunctionTypes = "target"> = DefaultActions<T>;