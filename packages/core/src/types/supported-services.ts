// this is an auto generated file, do not change this manually

import type { ServiceFunctionTypes, ServiceFunction } from "./";
export interface DefaultServices<T extends ServiceFunctionTypes = "target"> {
  homeassistant: {
    // Saves the persistent states immediately. Maintains the normal periodic saving interval.
    savePersistentStates: ServiceFunction<object, T, object>;
    // Generic action to turn devices off under any domain.
    turnOff: ServiceFunction<object, T, object>;
    // Generic action to turn devices on under any domain.
    turnOn: ServiceFunction<object, T, object>;
    // Generic action to toggle devices on/off under any domain.
    toggle: ServiceFunction<object, T, object>;
    // Stops Home Assistant.
    stop: ServiceFunction<object, T, object>;
    // Restarts Home Assistant.
    restart: ServiceFunction<object, T, object>;
    // Checks the Home Assistant YAML-configuration files for errors. Errors will be shown in the Home Assistant logs.
    checkConfig: ServiceFunction<object, T, object>;
    // Forces one or more entities to update their data.
    updateEntity: ServiceFunction<
      object,
      T,
      {
        // List of entities to force update.
        entity_id: string;
      }
    >;
    // Reloads the Core configuration from the YAML-configuration.
    reloadCoreConfig: ServiceFunction<object, T, object>;
    // Updates the Home Assistant location.
    setLocation: ServiceFunction<
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
    reloadCustomTemplates: ServiceFunction<object, T, object>;
    // Reloads the specified config entry.
    reloadConfigEntry: ServiceFunction<
      object,
      T,
      {
        // The configuration entry ID of the entry to be reloaded. @example 8955375327824e14ba89e4b29cc3ec9a
        entry_id?: string;
      }
    >;
    // Reload all YAML configuration that can be reloaded without restarting Home Assistant.
    reloadAll: ServiceFunction<object, T, object>;
  };
  persistentNotification: {
    // Shows a notification on the notifications panel.
    create: ServiceFunction<
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
    dismiss: ServiceFunction<
      object,
      T,
      {
        // ID of the notification to be deleted. @example 1234
        notification_id: string;
      }
    >;
    // Deletes all notifications from the notifications panel.
    dismissAll: ServiceFunction<object, T, object>;
  };
  systemLog: {
    // Deletes all log entries.
    clear: ServiceFunction<object, T, object>;
    // Write log entry.
    write: ServiceFunction<
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
    setDefaultLevel: ServiceFunction<
      object,
      T,
      {
        // Default severity level for all integrations.
        level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
      }
    >;
    // Sets the log level for one or more integrations.
    setLevel: ServiceFunction<object, T, object>;
  };
  person: {
    // Reloads persons from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
  };
  frontend: {
    // Sets the default theme Home Assistant uses. Can be overridden by a user.
    setTheme: ServiceFunction<
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
    reloadThemes: ServiceFunction<object, T, object>;
  };
  recorder: {
    // Starts purge task - to clean up old data from your database.
    purge: ServiceFunction<
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
    purgeEntities: ServiceFunction<
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
    enable: ServiceFunction<object, T, object>;
    // Stops the recording of events and state changes.
    disable: ServiceFunction<object, T, object>;
  };
  hassio: {
    // Starts an add-on.
    addonStart: ServiceFunction<
      object,
      T,
      {
        // The add-on to start. @example core_ssh
        addon: string;
      }
    >;
    // Stops an add-on.
    addonStop: ServiceFunction<
      object,
      T,
      {
        // The add-on to stop. @example core_ssh
        addon: string;
      }
    >;
    // Restarts an add-on.
    addonRestart: ServiceFunction<
      object,
      T,
      {
        // The add-on to restart. @example core_ssh
        addon: string;
      }
    >;
    // Updates an add-on. This action should be used with caution since add-on updates can contain breaking changes. It is highly recommended that you review release notes/change logs before updating an add-on.
    addonUpdate: ServiceFunction<
      object,
      T,
      {
        // The add-on to update. @example core_ssh
        addon: string;
      }
    >;
    // Writes data to the add-on's standard input.
    addonStdin: ServiceFunction<
      object,
      T,
      {
        // The add-on to write to. @example core_ssh
        addon: string;
      }
    >;
    // Powers off the host system.
    hostShutdown: ServiceFunction<object, T, object>;
    // Reboots the host system.
    hostReboot: ServiceFunction<object, T, object>;
    // Creates a full backup.
    backupFull: ServiceFunction<
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
    backupPartial: ServiceFunction<
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
    restoreFull: ServiceFunction<
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
    restorePartial: ServiceFunction<
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
    install: ServiceFunction<
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
    skip: ServiceFunction<object, T, object>;
    // Removes the skipped version marker from an update.
    clearSkipped: ServiceFunction<object, T, object>;
  };
  cloud: {
    // Makes the instance UI accessible from outside of the local network by enabling your Home Assistant Cloud connection.
    remoteConnect: ServiceFunction<object, T, object>;
    // Disconnects the instance UI from Home Assistant Cloud. This disables access to it from outside your local network.
    remoteDisconnect: ServiceFunction<object, T, object>;
  };
  tts: {
    // Speaks something using text-to-speech on a media player.
    speak: ServiceFunction<
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
    clearCache: ServiceFunction<object, T, object>;
    // Say something using text-to-speech on a media player with cloud.
    cloudSay: ServiceFunction<
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
    googleTranslateSay: ServiceFunction<
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
  mediaPlayer: {
    // Turns on the power of the media player.
    turnOn: ServiceFunction<object, T, object>;
    // Turns off the power of the media player.
    turnOff: ServiceFunction<object, T, object>;
    // Toggles a media player on/off.
    toggle: ServiceFunction<object, T, object>;
    // Turns up the volume.
    volumeUp: ServiceFunction<object, T, object>;
    // Turns down the volume.
    volumeDown: ServiceFunction<object, T, object>;
    // Toggles play/pause.
    mediaPlayPause: ServiceFunction<object, T, object>;
    // Starts playing.
    mediaPlay: ServiceFunction<object, T, object>;
    // Pauses.
    mediaPause: ServiceFunction<object, T, object>;
    // Stops playing.
    mediaStop: ServiceFunction<object, T, object>;
    // Selects the next track.
    mediaNextTrack: ServiceFunction<object, T, object>;
    // Selects the previous track.
    mediaPreviousTrack: ServiceFunction<object, T, object>;
    // Removes all items from the playlist.
    clearPlaylist: ServiceFunction<object, T, object>;
    // Sets the volume level.
    volumeSet: ServiceFunction<
      object,
      T,
      {
        // The volume. 0 is inaudible, 1 is the maximum volume. @constraints  number: min: 0, max: 1, step: 0.01
        volume_level: number;
      }
    >;
    // Mutes or unmutes the media player.
    volumeMute: ServiceFunction<
      object,
      T,
      {
        // Defines whether or not it is muted.
        is_volume_muted: boolean;
      }
    >;
    // Allows you to go to a different part of the media that is currently playing.
    mediaSeek: ServiceFunction<
      object,
      T,
      {
        // Target position in the currently playing media. The format is platform dependent. @constraints  number: min: 0, max: 9223372036854776000, step: 0.01, mode: box
        seek_position: number;
      }
    >;
    // Groups media players together for synchronous playback. Only works on supported multiroom audio systems.
    join: ServiceFunction<
      object,
      T,
      {
        // The players which will be synced with the playback specified in 'Targets'. @example - media_player.multiroom_player2 - media_player.multiroom_player3
        group_members: string[];
      }
    >;
    // Sends the media player the command to change input source.
    selectSource: ServiceFunction<
      object,
      T,
      {
        // Name of the source to switch to. Platform dependent. @example video1
        source: string;
      }
    >;
    // Selects a specific sound mode.
    selectSoundMode: ServiceFunction<
      object,
      T,
      {
        // Name of the sound mode to switch to. @example Music
        sound_mode?: string;
      }
    >;
    // Starts playing specified media.
    playMedia: ServiceFunction<
      object,
      T,
      {
        // The ID of the content to play. Platform dependent. @example https://home-assistant.io/images/cast/splash.png
        media_content_id: string | number;
        // The type of the content to play, such as image, music, tv show, video, episode, channel, or playlist. @example music
        media_content_type: string;
        // If the content should be played now or be added to the queue.
        enqueue?: "play" | "next" | "add" | "replace";
        // If the media should be played as an announcement. @example true
        announce?: boolean;
      }
    >;
    // Browses the available media.
    browseMedia: ServiceFunction<
      object,
      T,
      {
        // The type of the content to browse, such as image, music, tv show, video, episode, channel, or playlist. @example music
        media_content_type?: string;
        // The ID of the content to browse. Integration dependent. @example A:ALBUMARTIST/Beatles
        media_content_id?: string | number;
      }
    >;
    // Enables or disables the shuffle mode.
    shuffleSet: ServiceFunction<
      object,
      T,
      {
        // Whether the media should be played in randomized order or not.
        shuffle: boolean;
      }
    >;
    // Removes the player from a group. Only works on platforms which support player groups.
    unjoin: ServiceFunction<object, T, object>;
    // Sets the repeat mode.
    repeatSet: ServiceFunction<
      object,
      T,
      {
        // Whether the media (one or all) should be played in a loop or not.
        repeat: "off" | "all" | "one";
      }
    >;
  };
  conversation: {
    // Launches a conversation from a transcribed text.
    process: ServiceFunction<
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
    reload: ServiceFunction<
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
  assistSatellite: {
    // Lets a satellite announce a message.
    announce: ServiceFunction<
      object,
      T,
      {
        // The message to announce. @example Time to wake up!
        message?: string;
        // The media ID to announce instead of using text-to-speech.
        media_id?: string;
      }
    >;
    // Starts a conversation from a satellite.
    startConversation: ServiceFunction<
      object,
      T,
      {
        // The message to start with. @example You left the lights on in the living room. Turn them off?
        start_message?: string;
        // The media ID to start with instead of using text-to-speech.
        start_media_id?: string;
        // Provide background information to the AI about the request.
        extra_system_prompt?: string;
      }
    >;
  };
  group: {
    // Reloads group configuration, entities, and notify services from YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Creates/Updates a group.
    set: ServiceFunction<
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
    remove: ServiceFunction<
      object,
      T,
      {
        // Object ID of this group. This object ID is used as part of the entity ID. Entity ID format: [domain].[object_id]. @example test_group
        object_id: object;
      }
    >;
  };
  light: {
    // Turns on one or more lights and adjusts their properties, even when they are turned on already.
    turnOn: ServiceFunction<
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
    // Turns off one or more lights.
    turnOff: ServiceFunction<
      object,
      T,
      {
        // Duration it takes to get to next state. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
        //
        flash?: "long" | "short";
      }
    >;
    // Toggles one or more lights, from on to off, or off to on, based on their current state.
    toggle: ServiceFunction<
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
  camera: {
    // Enables the motion detection.
    enableMotionDetection: ServiceFunction<object, T, object>;
    // Disables the motion detection.
    disableMotionDetection: ServiceFunction<object, T, object>;
    // Turns off the camera.
    turnOff: ServiceFunction<object, T, object>;
    // Turns on the camera.
    turnOn: ServiceFunction<object, T, object>;
    // Takes a snapshot from a camera.
    snapshot: ServiceFunction<
      object,
      T,
      {
        // Full path to filename. @example /tmp/snapshot_{{ entity_id.name }}.jpg
        filename: string;
      }
    >;
    // Plays the camera stream on a supported media player.
    playStream: ServiceFunction<
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
    record: ServiceFunction<
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
  scene: {
    // Activates a scene.
    turnOn: ServiceFunction<
      object,
      T,
      {
        // Time it takes the devices to transition into the states defined in the scene. @constraints  number: min: 0, max: 300, unit_of_measurement: seconds
        transition?: number;
      }
    >;
    // Reloads the scenes from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Activates a scene with configuration.
    apply: ServiceFunction<
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
    create: ServiceFunction<
      object,
      T,
      {
        // The entity ID of the new scene. @example all_lights
        scene_id: string;
        // List of entities and their target state. If your entities are already in the target state right now, use 'Entities snapshot' instead. @example light.tv_back_light: 'on' light.ceiling:   state: 'on'   brightness: 200
        entities?: object;
        // List of entities to be included in the snapshot. By taking a snapshot, you record the current state of those entities. If you do not want to use the current state of all your entities for this scene, you can combine 'Entities snapshot' with 'Entity states'. @example - light.ceiling - light.kitchen
        snapshot_entities?: string;
      }
    >;
    // Deletes a dynamically created scene.
    delete: ServiceFunction<object, T, object>;
  };
  inputButton: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Mimics the physical button press on the device.
    press: ServiceFunction<object, T, object>;
  };
  inputNumber: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Sets the value.
    setValue: ServiceFunction<
      object,
      T,
      {
        // The target value. @constraints  number: min: 0, max: 9223372036854776000, step: 0.001, mode: box
        value: number;
      }
    >;
    // Increments the current value by 1 step.
    increment: ServiceFunction<object, T, object>;
    // Decrements the current value by 1 step.
    decrement: ServiceFunction<object, T, object>;
  };
  logbook: {
    // Creates a custom entry in the logbook.
    log: ServiceFunction<
      object,
      T,
      {
        // Custom name for an entity, can be referenced using the 'Entity ID' field. @example Kitchen
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
  backup: {
    // Creates a new backup with automatic backup settings.
    createAutomatic: ServiceFunction<object, T, object>;
  };
  inputSelect: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Selects the first option.
    selectFirst: ServiceFunction<object, T, object>;
    // Selects the last option.
    selectLast: ServiceFunction<object, T, object>;
    // Selects the next option.
    selectNext: ServiceFunction<
      object,
      T,
      {
        // If the option should cycle from the last to the first option on the list.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ServiceFunction<
      object,
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ServiceFunction<
      object,
      T,
      {
        // If the option should cycle from the first to the last option on the list.
        cycle?: boolean;
      }
    >;
    // Sets the options.
    setOptions: ServiceFunction<
      object,
      T,
      {
        // List of options. @example ['Item A', 'Item B', 'Item C']
        options: string;
      }
    >;
  };
  script: {
    //
    nightlightPower: ServiceFunction<object, T, object>;
    // Reloads all the available scripts.
    reload: ServiceFunction<object, T, object>;
    // Runs the sequence of actions defined in a script.
    turnOn: ServiceFunction<object, T, object>;
    // Stops a running script.
    turnOff: ServiceFunction<object, T, object>;
    // Starts a script if it isn't running, stops it otherwise.
    toggle: ServiceFunction<object, T, object>;
  };
  zone: {
    // Reloads zones from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
  };
  inputBoolean: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Turns on the helper.
    turnOn: ServiceFunction<object, T, object>;
    // Turns off the helper.
    turnOff: ServiceFunction<object, T, object>;
    // Toggles the helper on/off.
    toggle: ServiceFunction<object, T, object>;
  };
  timer: {
    // Reloads timers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Starts a timer or restarts it with a provided duration.
    start: ServiceFunction<
      object,
      T,
      {
        // Custom duration to restart the timer with. @example 00:01:00 or 60
        duration?: string;
      }
    >;
    // Pauses a running timer, retaining the remaining duration for later continuation.
    pause: ServiceFunction<object, T, object>;
    // Resets a timer's duration to the last known initial value without firing the timer finished event.
    cancel: ServiceFunction<object, T, object>;
    // Finishes a running timer earlier than scheduled.
    finish: ServiceFunction<object, T, object>;
    // Changes a timer by adding or subtracting a given duration.
    change: ServiceFunction<
      object,
      T,
      {
        // Duration to add to or subtract from the running timer. @example 00:01:00, 60 or -60
        duration: string;
      }
    >;
  };
  valve: {
    // Opens a valve.
    openValve: ServiceFunction<object, T, object>;
    // Closes a valve.
    closeValve: ServiceFunction<object, T, object>;
    // Moves a valve to a specific position.
    setValvePosition: ServiceFunction<
      object,
      T,
      {
        // Target position. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        position: number;
      }
    >;
    // Stops the valve movement.
    stopValve: ServiceFunction<object, T, object>;
    // Toggles a valve open/closed.
    toggle: ServiceFunction<object, T, object>;
  };
  lock: {
    // Unlocks a lock.
    unlock: ServiceFunction<
      object,
      T,
      {
        // Code used to unlock the lock. @example 1234
        code?: string;
      }
    >;
    // Locks a lock.
    lock: ServiceFunction<
      object,
      T,
      {
        // Code used to lock the lock. @example 1234
        code?: string;
      }
    >;
    // Opens a lock.
    open: ServiceFunction<
      object,
      T,
      {
        // Code used to open the lock. @example 1234
        code?: string;
      }
    >;
  };
  cover: {
    // Opens a cover.
    openCover: ServiceFunction<object, T, object>;
    // Closes a cover.
    closeCover: ServiceFunction<object, T, object>;
    // Moves a cover to a specific position.
    setCoverPosition: ServiceFunction<
      object,
      T,
      {
        // Target position. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        position: number;
      }
    >;
    // Stops the cover movement.
    stopCover: ServiceFunction<object, T, object>;
    // Toggles a cover open/closed.
    toggle: ServiceFunction<object, T, object>;
    // Tilts a cover open.
    openCoverTilt: ServiceFunction<object, T, object>;
    // Tilts a cover to close.
    closeCoverTilt: ServiceFunction<object, T, object>;
    // Stops a tilting cover movement.
    stopCoverTilt: ServiceFunction<object, T, object>;
    // Moves a cover tilt to a specific position.
    setCoverTiltPosition: ServiceFunction<
      object,
      T,
      {
        // Target tilt positition. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        tilt_position: number;
      }
    >;
    // Toggles a cover tilt open/closed.
    toggleCoverTilt: ServiceFunction<object, T, object>;
  };
  switch: {
    // Turns a switch off.
    turnOff: ServiceFunction<object, T, object>;
    // Turns a switch on.
    turnOn: ServiceFunction<object, T, object>;
    // Toggles a switch on/off.
    toggle: ServiceFunction<object, T, object>;
  };
  vacuum: {
    // Starts or resumes the cleaning task.
    start: ServiceFunction<object, T, object>;
    // Pauses the cleaning task.
    pause: ServiceFunction<object, T, object>;
    // Tells the vacuum cleaner to return to its dock.
    returnToBase: ServiceFunction<object, T, object>;
    // Tells the vacuum cleaner to do a spot clean-up.
    cleanSpot: ServiceFunction<object, T, object>;
    // Locates the vacuum cleaner robot.
    locate: ServiceFunction<object, T, object>;
    // Stops the current cleaning task.
    stop: ServiceFunction<object, T, object>;
    // Sets the fan speed of the vacuum cleaner.
    setFanSpeed: ServiceFunction<
      object,
      T,
      {
        // Fan speed. The value depends on the integration. Some integrations have speed steps, like 'medium'. Some use a percentage, between 0 and 100. @example low
        fan_speed: string;
      }
    >;
    // Sends a command to the vacuum cleaner.
    sendCommand: ServiceFunction<
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
  alarmControlPanel: {
    // Disarms the alarm.
    alarmDisarm: ServiceFunction<
      object,
      T,
      {
        // Code to disarm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm in the home mode.
    alarmArmHome: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm in the away mode.
    alarmArmAway: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm in the night mode.
    alarmArmNight: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm in the vacation mode.
    alarmArmVacation: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Arms the alarm while allowing to bypass a custom area.
    alarmArmCustomBypass: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
    // Triggers the alarm manually.
    alarmTrigger: ServiceFunction<
      object,
      T,
      {
        // Code to arm the alarm. @example 1234
        code?: string;
      }
    >;
  };
  inputDatetime: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Sets the date and/or time.
    setDatetime: ServiceFunction<
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
  profiler: {
    // Starts the Profiler.
    start: ServiceFunction<
      object,
      T,
      {
        // The number of seconds to run the profiler. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        seconds?: number;
      }
    >;
    // Starts the Memory Profiler.
    memory: ServiceFunction<
      object,
      T,
      {
        // The number of seconds to run the memory profiler. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        seconds?: number;
      }
    >;
    // Starts logging growth of objects in memory.
    startLogObjects: ServiceFunction<
      object,
      T,
      {
        // The number of seconds between logging objects. @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds
        scan_interval?: number;
      }
    >;
    // Stops logging growth of objects in memory.
    stopLogObjects: ServiceFunction<object, T, object>;
    // Starts logging sources of new objects in memory.
    startLogObjectSources: ServiceFunction<
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
    stopLogObjectSources: ServiceFunction<object, T, object>;
    // Dumps the repr of all matching objects to the log.
    dumpLogObjects: ServiceFunction<
      object,
      T,
      {
        // The type of objects to dump to the log. @example State
        type: string;
      }
    >;
    // Logs the stats of all lru caches.
    lruStats: ServiceFunction<object, T, object>;
    // Logs the current frames for all threads.
    logThreadFrames: ServiceFunction<object, T, object>;
    // Logs what is scheduled in the event loop.
    logEventLoopScheduled: ServiceFunction<object, T, object>;
    // Enable or disable asyncio debug.
    setAsyncioDebug: ServiceFunction<
      object,
      T,
      {
        // Whether to enable or disable asyncio debug.
        enabled?: boolean;
      }
    >;
    // Logs all the current asyncio tasks.
    logCurrentTasks: ServiceFunction<object, T, object>;
  };
  restCommand: {
    //
    assistantRelay: ServiceFunction<object, T, object>;
    // Reloads RESTful commands from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
  };
  cast: {
    // Shows a dashboard view on a Chromecast device.
    showLovelaceView: ServiceFunction<
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
  mediaExtractor: {
    // Extract media URL from a service.
    extractMediaUrl: ServiceFunction<
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
    playMedia: ServiceFunction<
      object,
      T,
      {
        // The ID of the content to play. Platform dependent. @example https://soundcloud.com/bruttoband/brutto-11
        media_content_id: string | number;
        // The type of the content to play.
        media_content_type: "CHANNEL" | "EPISODE" | "PLAYLIST MUSIC" | "MUSIC" | "TVSHOW" | "VIDEO";
      }
    >;
  };
  schedule: {
    // Reloads schedules from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Retrieve one or multiple schedules.
    getSchedule: ServiceFunction<object, T, object>;
  };
  inputText: {
    // Reloads helpers from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
    // Sets the value.
    setValue: ServiceFunction<
      object,
      T,
      {
        // The target value. @example This is an example text
        value: string;
      }
    >;
  };
  reolink: {
    // Plays a ringtone on a Reolink Chime.
    playChime: ServiceFunction<
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
    ptzMove: ServiceFunction<
      object,
      T,
      {
        // PTZ move speed. @constraints  number: min: 1, max: 64, step: 1
        speed: number;
      }
    >;
  };
  commandLine: {
    // Reloads command line configuration from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
  };
  template: {
    // Reloads template entities from the YAML-configuration.
    reload: ServiceFunction<object, T, object>;
  };
  counter: {
    // Increments a counter by its step size.
    increment: ServiceFunction<object, T, object>;
    // Decrements a counter by its step size.
    decrement: ServiceFunction<object, T, object>;
    // Resets a counter to its initial value.
    reset: ServiceFunction<object, T, object>;
    // Sets the counter to a specific value.
    setValue: ServiceFunction<
      object,
      T,
      {
        // The new counter value the entity should be set to. @constraints  number: min: 0, max: 9223372036854776000, mode: box
        value: number;
      }
    >;
  };
  lawnMower: {
    // Starts the mowing task.
    startMowing: ServiceFunction<object, T, object>;
    // Pauses the mowing task.
    pause: ServiceFunction<object, T, object>;
    // Stops the mowing task and returns to the dock.
    dock: ServiceFunction<object, T, object>;
  };
  button: {
    // Press the button entity.
    press: ServiceFunction<object, T, object>;
  };
  climate: {
    // Turns climate device on.
    turnOn: ServiceFunction<object, T, object>;
    // Turns climate device off.
    turnOff: ServiceFunction<object, T, object>;
    // Toggles climate device, from on to off, or off to on.
    toggle: ServiceFunction<object, T, object>;
    // Sets HVAC operation mode.
    setHvacMode: ServiceFunction<
      object,
      T,
      {
        // HVAC operation mode.
        hvac_mode?: "off" | "auto" | "cool" | "dry" | "fan_only" | "heat_cool" | "heat";
      }
    >;
    // Sets preset mode.
    setPresetMode: ServiceFunction<
      object,
      T,
      {
        // Preset mode. @example away
        preset_mode: string;
      }
    >;
    // Turns auxiliary heater on/off.
    setAuxHeat: ServiceFunction<
      object,
      T,
      {
        // New value of auxiliary heater.
        aux_heat: boolean;
      }
    >;
    // Sets the temperature setpoint.
    setTemperature: ServiceFunction<
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
    setHumidity: ServiceFunction<
      object,
      T,
      {
        // Target humidity. @constraints  number: min: 30, max: 99, unit_of_measurement: %
        humidity: number;
      }
    >;
    // Sets fan operation mode.
    setFanMode: ServiceFunction<
      object,
      T,
      {
        // Fan operation mode. @example low
        fan_mode: string;
      }
    >;
    // Sets swing operation mode.
    setSwingMode: ServiceFunction<
      object,
      T,
      {
        // Swing operation mode. @example on
        swing_mode: string;
      }
    >;
    // Sets horizontal swing operation mode.
    setSwingHorizontalMode: ServiceFunction<
      object,
      T,
      {
        // Horizontal swing operation mode. @example on
        swing_horizontal_mode: string;
      }
    >;
  };
  number: {
    // Sets the value of a number.
    setValue: ServiceFunction<
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
    selectFirst: ServiceFunction<object, T, object>;
    // Selects the last option.
    selectLast: ServiceFunction<object, T, object>;
    // Selects the next option.
    selectNext: ServiceFunction<
      object,
      T,
      {
        // If the option should cycle from the last to the first.
        cycle?: boolean;
      }
    >;
    // Selects an option.
    selectOption: ServiceFunction<
      object,
      T,
      {
        // Option to be selected. @example 'Item A'
        option: string;
      }
    >;
    // Selects the previous option.
    selectPrevious: ServiceFunction<
      object,
      T,
      {
        // If the option should cycle from the first to the last.
        cycle?: boolean;
      }
    >;
  };
  text: {
    // Sets the value.
    setValue: ServiceFunction<
      object,
      T,
      {
        // Enter your text. @example Hello world!
        value: string;
      }
    >;
  };
  notify: {
    // Sends a notification message.
    sendMessage: ServiceFunction<
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
    persistentNotification: ServiceFunction<
      object,
      T,
      {
        // Message body of the notification. @example The garage door has been open for 10 minutes.
        message: string;
        // Title of the notification. @example Your Garage Door Friend
        title?: string;
        // Some integrations provide extended functionality via this field. For more information, refer to the integration documentation. @example platform specific
        data?: object;
      }
    >;
    // Sends a notification message using the notify service.
    notify: ServiceFunction<
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
    googleAssistantSdk: ServiceFunction<
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
    see: ServiceFunction<
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
  remote: {
    // Sends the turn off command.
    turnOff: ServiceFunction<object, T, object>;
    // Sends the turn on command.
    turnOn: ServiceFunction<
      object,
      T,
      {
        // Activity ID or activity name to be started. @example BedroomTV
        activity?: string;
      }
    >;
    // Sends the toggle command.
    toggle: ServiceFunction<object, T, object>;
    // Sends a command or a list of commands to a device.
    sendCommand: ServiceFunction<
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
    learnCommand: ServiceFunction<
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
    deleteCommand: ServiceFunction<
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
    // Retrieves the forecast from selected weather services.
    getForecasts: ServiceFunction<
      object,
      T,
      {
        // The scope of the weather forecast.
        type: "daily" | "hourly" | "twice_daily";
      }
    >;
  };
  calendar: {
    // Adds a new calendar event.
    createEvent: ServiceFunction<
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
    getEvents: ServiceFunction<
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
  fan: {
    // Turns fan on.
    turnOn: ServiceFunction<
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
    turnOff: ServiceFunction<object, T, object>;
    // Toggles a fan on/off.
    toggle: ServiceFunction<object, T, object>;
    // Increases the speed of a fan.
    increaseSpeed: ServiceFunction<
      object,
      T,
      {
        // Percentage step by which the speed should be increased. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage_step?: number;
      }
    >;
    // Decreases the speed of a fan.
    decreaseSpeed: ServiceFunction<
      object,
      T,
      {
        // Percentage step by which the speed should be decreased. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage_step?: number;
      }
    >;
    // Controls the oscillation of a fan.
    oscillate: ServiceFunction<
      object,
      T,
      {
        // Turns oscillation on/off.
        oscillating: boolean;
      }
    >;
    // Sets a fan's rotation direction.
    setDirection: ServiceFunction<
      object,
      T,
      {
        // Direction of the fan rotation.
        direction: "forward" | "reverse";
      }
    >;
    // Sets the speed of a fan.
    setPercentage: ServiceFunction<
      object,
      T,
      {
        // Speed of the fan. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        percentage: number;
      }
    >;
    // Sets preset fan mode.
    setPresetMode: ServiceFunction<
      object,
      T,
      {
        // Preset fan mode. @example auto
        preset_mode: string;
      }
    >;
  };
  siren: {
    // Turns the siren on.
    turnOn: ServiceFunction<
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
    turnOff: ServiceFunction<object, T, object>;
    // Toggles the siren on/off.
    toggle: ServiceFunction<object, T, object>;
  };
  humidifier: {
    // Turns the humidifier on.
    turnOn: ServiceFunction<object, T, object>;
    // Turns the humidifier off.
    turnOff: ServiceFunction<object, T, object>;
    // Toggles the humidifier on/off.
    toggle: ServiceFunction<object, T, object>;
    // Sets the humidifier operation mode.
    setMode: ServiceFunction<
      object,
      T,
      {
        // Operation mode. For example, _normal_, _eco_, or _away_. For a list of possible values, refer to the integration documentation. @example away
        mode: string;
      }
    >;
    // Sets the target humidity.
    setHumidity: ServiceFunction<
      object,
      T,
      {
        // Target humidity. @constraints  number: min: 0, max: 100, unit_of_measurement: %
        humidity: number;
      }
    >;
  };
  waterHeater: {
    // Turns water heater on.
    turnOn: ServiceFunction<object, T, object>;
    // Turns water heater off.
    turnOff: ServiceFunction<object, T, object>;
    // Turns away mode on/off.
    setAwayMode: ServiceFunction<
      object,
      T,
      {
        // New value of away mode.
        away_mode: boolean;
      }
    >;
    // Sets the target temperature.
    setTemperature: ServiceFunction<
      object,
      T,
      {
        // New target temperature for the water heater. @constraints  number: min: 0, max: 100, step: 0.5, unit_of_measurement: °
        temperature: number;
        // New value of the operation mode. For a list of possible modes, refer to the integration documentation. @example eco
        operation_mode?: string;
      }
    >;
    // Sets the operation mode.
    setOperationMode: ServiceFunction<
      object,
      T,
      {
        // New value of the operation mode. For a list of possible modes, refer to the integration documentation. @example eco
        operation_mode: string;
      }
    >;
  };
  onvif: {
    // If your ONVIF camera supports PTZ, you will be able to pan, tilt or zoom your camera.
    ptz: ServiceFunction<
      object,
      T,
      {
        // Tilt direction.
        tilt?: "DOWN" | "UP";
        // Pan direction.
        pan?: "LEFT" | "RIGHT";
        // Zoom.
        zoom?: "ZOOM_IN" | "ZOOM_OUT";
        // Distance coefficient. Sets how much PTZ should be executed in one request. @constraints  number: min: 0, max: 1, step: 0.01
        distance?: number;
        // Speed coefficient. Sets how fast PTZ will be executed. @constraints  number: min: 0, max: 1, step: 0.01
        speed?: number;
        // Set ContinuousMove delay in seconds before stopping the move. @constraints  number: min: 0, max: 1, step: 0.01
        continuous_duration?: number;
        // PTZ preset profile token. Sets the preset profile token which is executed with GotoPreset. @example 1
        preset?: string;
        // PTZ moving mode.
        move_mode?: "AbsoluteMove" | "ContinuousMove" | "GotoPreset" | "RelativeMove" | "Stop";
      }
    >;
  };
  google: {
    // Adds a new calendar event.
    addEvent: ServiceFunction<
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
    createEvent: ServiceFunction<
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
    trigger: ServiceFunction<
      object,
      T,
      {
        // Defines whether or not the conditions will be skipped.
        skip_condition?: boolean;
      }
    >;
    // Toggles (enable / disable) an automation.
    toggle: ServiceFunction<object, T, object>;
    // Enables an automation.
    turnOn: ServiceFunction<object, T, object>;
    // Disables an automation.
    turnOff: ServiceFunction<
      object,
      T,
      {
        // Stops currently running actions.
        stop_actions?: boolean;
      }
    >;
    // Reloads the automation configuration.
    reload: ServiceFunction<object, T, object>;
  };
  zha: {
    // Allows nodes to join the Zigbee network.
    permit: ServiceFunction<
      object,
      T,
      {
        // Time to permit joins. @constraints  number: min: 0, max: 254, unit_of_measurement: seconds
        duration?: number;
        // IEEE address of the node permitting new joins. @example 00:0d:6f:00:05:7d:2d:34
        ieee?: string;
        // IEEE address of the joining device (must be combined with the 'Install code' field). @example 00:0a:bf:00:01:10:23:35
        source_ieee?: string;
        // Install code of the joining device (must be combined with the 'Source IEEE' field). @example 1234-5678-1234-5678-AABB-CCDD-AABB-CCDD-EEFF
        install_code?: string;
        // Provides both the IEEE address and the install code of the joining device (different between vendors). @example Z:000D6FFFFED4163B$I:52797BF4A5084DAA8E1712B61741CA024051
        qr_code?: string;
      }
    >;
    // Removes a node from the Zigbee network.
    remove: ServiceFunction<
      object,
      T,
      {
        // IEEE address of the node to remove. @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
      }
    >;
    // Sets an attribute value for the specified cluster on the specified entity.
    setZigbeeClusterAttribute: ServiceFunction<
      object,
      T,
      {
        // IEEE address for the device. @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        // Endpoint ID for the cluster. @constraints  number: min: 1, max: 65535, mode: box
        endpoint_id: number;
        // ZCL cluster to retrieve attributes for. @constraints  number: min: 1, max: 65535
        cluster_id: number;
        // Type of the cluster.
        cluster_type?: "in" | "out";
        // ID of the attribute to set. @constraints  number: min: 1, max: 65535
        attribute: number;
        // Value to write to the attribute. @example 1
        value: string;
        // Manufacturer code. Use a value of '-1' to force no code to be set. @example 252
        manufacturer?: string;
      }
    >;
    // Issues a command on the specified cluster on the specified entity.
    issueZigbeeClusterCommand: ServiceFunction<
      object,
      T,
      {
        // IEEE address for the device. @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        // Endpoint ID for the cluster. @constraints  number: min: 1, max: 65535
        endpoint_id: number;
        // ZCL cluster to retrieve attributes for. @constraints  number: min: 1, max: 65535
        cluster_id: number;
        // Type of the cluster.
        cluster_type?: "in" | "out";
        // ID of the command to execute. @constraints  number: min: 1, max: 65535
        command: number;
        // Type of the command to execute.
        command_type: "client" | "server";
        // Arguments to pass to the command. @example [arg1, arg2, argN]
        args?: object;
        // Parameters to pass to the command.
        params?: object;
        // Manufacturer code. Use a value of '-1' to force no code to be set. @example 252
        manufacturer?: string;
      }
    >;
    // Issues a command on the specified cluster on the specified group.
    issueZigbeeGroupCommand: ServiceFunction<
      object,
      T,
      {
        // Hexadecimal address of the group. @example 546
        group: string;
        // ZCL cluster to send command to. @constraints  number: min: 1, max: 65535
        cluster_id: number;
        // Type of the cluster.
        cluster_type?: "in" | "out";
        // ID of the command to execute. @constraints  number: min: 1, max: 65535
        command: number;
        // Arguments to pass to the command. @example [arg1, arg2, argN]
        args?: object;
        // Manufacturer code. Use a value of '-1' to force no code to be set. @example 252
        manufacturer?: string;
      }
    >;
    // This action uses the WD capabilities to emit a quick audible/visible pulse called a 'squawk'. The squawk command has no effect if the WD is currently active (warning in progress).
    warningDeviceSquawk: ServiceFunction<
      object,
      T,
      {
        // IEEE address for the device. @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        // The Squawk Mode field is used as a 4-bit enumeration, and can have one of the values shown in Table 8-24 of the ZCL spec - Squawk Mode Field. The exact operation of each mode (how the WD “squawks”) is implementation specific. @constraints  number: min: 0, max: 1, mode: box
        mode?: number;
        // The strobe field is used as a Boolean, and determines if the visual indication is also required in addition to the audible squawk, as shown in Table 8-25 of the ZCL spec - Strobe Bit. @constraints  number: min: 0, max: 1, mode: box
        strobe?: number;
        // The squawk level field is used as a 2-bit enumeration, and determines the intensity of audible squawk sound as shown in Table 8-26 of the ZCL spec - Squawk Level Field Values. @constraints  number: min: 0, max: 3, mode: box
        level?: number;
      }
    >;
    // This action starts the operation of the warning device. The warning device alerts the surrounding area by audible (siren) and visual (strobe) signals.
    warningDeviceWarn: ServiceFunction<
      object,
      T,
      {
        // IEEE address for the device. @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        // The Warning Mode field is used as a 4-bit enumeration, can have one of the values 0-6 defined below in table 8-20 of the ZCL spec. The exact behavior of the warning device in each mode is according to the relevant security standards. @constraints  number: min: 0, max: 6, mode: box
        mode?: number;
        // The Strobe field is used as a 2-bit enumeration, and determines if the visual indication is required in addition to the audible siren, as indicated in Table 8-21 of the ZCL spec. '0' means no strobe, '1' means strobe. If the strobe field is “1” and the Warning Mode is “0” (“Stop”), then only the strobe is activated. @constraints  number: min: 0, max: 1, mode: box
        strobe?: number;
        // The Siren Level field is used as a 2-bit enumeration, and indicates the intensity of audible squawk sound as shown in Table 8-22 of the ZCL spec. @constraints  number: min: 0, max: 3, mode: box
        level?: number;
        // Requested duration of warning, in seconds (16 bit). If both Strobe and Warning Mode are '0' this field is ignored. @constraints  number: min: 0, max: 65535, unit_of_measurement: seconds
        duration?: number;
        // Indicates the length of the flash cycle. This allows you to vary the flash duration for different alarm types (e.g., fire, police, burglar). The valid range is 0-100 in increments of 10. All other values must be rounded to the nearest valid value. Strobe calculates a duty cycle over a duration of one second. The ON state must precede the OFF state. For example, if the Strobe Duty Cycle field specifies “40,”, then the strobe flashes ON for 4/10ths of a second and then turns OFF for 6/10ths of a second. @constraints  number: min: 0, max: 100, step: 10
        duty_cycle?: number;
        // Indicates the intensity of the strobe as shown in Table 8-23 of the ZCL spec. This attribute is designed to vary the output of the strobe (i.e., brightness) and not its frequency, which is detailed in section 8.4.2.3.1.6 of the ZCL spec. @constraints  number: min: 0, max: 3, mode: box
        intensity?: number;
      }
    >;
    // Sets a user code on a lock.
    setLockUserCode: ServiceFunction<
      object,
      T,
      {
        // Code slot to set the code in. @example 1
        code_slot: string;
        // Code to set. @example 1234
        user_code: string;
      }
    >;
    // Enables a user code on a lock.
    enableLockUserCode: ServiceFunction<
      object,
      T,
      {
        // Code slot to enable. @example 1
        code_slot: string;
      }
    >;
    // Disables a user code on a lock.
    disableLockUserCode: ServiceFunction<
      object,
      T,
      {
        // Code slot to disable. @example 1
        code_slot: string;
      }
    >;
    // Clears a user code from a lock.
    clearLockUserCode: ServiceFunction<
      object,
      T,
      {
        // Code slot to clear code from. @example 1
        code_slot: string;
      }
    >;
  };
}
