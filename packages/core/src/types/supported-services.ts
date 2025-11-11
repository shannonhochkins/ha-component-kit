// this is an auto generated file, do not change this manually

import type { ServiceFunctionTypes, ServiceFunction } from "./";
export interface DefaultServices<T extends ServiceFunctionTypes = "target"> {
  homeassistant: {
    // undefined
    savePersistentStates: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    stop: ServiceFunction<object, T, object>;
    // undefined
    restart: ServiceFunction<object, T, object>;
    // undefined
    checkConfig: ServiceFunction<object, T, object>;
    // undefined
    updateEntity: ServiceFunction<
      object,
      T,
      {
        //
        entity_id: string;
      }
    >;
    // undefined
    reloadCoreConfig: ServiceFunction<object, T, object>;
    // undefined
    setLocation: ServiceFunction<
      object,
      T,
      {
        //  @example 32.87336 @constraints  number: mode: box, min: -90, max: 90, step: any
        latitude: number;
        //  @example 117.22743 @constraints  number: mode: box, min: -180, max: 180, step: any
        longitude: number;
        //  @example 120 @constraints  number: mode: box, step: any
        elevation?: number;
      }
    >;
    // undefined
    reloadCustomTemplates: ServiceFunction<object, T, object>;
    // undefined
    reloadConfigEntry: ServiceFunction<
      object,
      T,
      {
        //  @example 8955375327824e14ba89e4b29cc3ec9a @constraints  config_entry:
        entry_id?: unknown;
      }
    >;
    // undefined
    reloadAll: ServiceFunction<object, T, object>;
  };
  persistentNotification: {
    // undefined
    create: ServiceFunction<
      object,
      T,
      {
        //  @example Please check your configuration.yaml.
        message: string;
        //  @example Test notification
        title?: string;
        //  @example 1234
        notification_id?: string;
      }
    >;
    // undefined
    dismiss: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        notification_id: string;
      }
    >;
    // undefined
    dismissAll: ServiceFunction<object, T, object>;
  };
  systemLog: {
    // undefined
    clear: ServiceFunction<object, T, object>;
    // undefined
    write: ServiceFunction<
      object,
      T,
      {
        //  @example Something went wrong
        message: string;
        //
        level?: "debug" | "info" | "warning" | "error" | "critical";
        //  @example mycomponent.myplatform
        logger?: string;
      }
    >;
  };
  logger: {
    // undefined
    setDefaultLevel: ServiceFunction<
      object,
      T,
      {
        //
        level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
      }
    >;
    // undefined
    setLevel: ServiceFunction<object, T, object>;
  };
  frontend: {
    // undefined
    setTheme: ServiceFunction<
      object,
      T,
      {
        //  @example default
        name: string;
        //
        mode?: "dark" | "light";
      }
    >;
    // undefined
    reloadThemes: ServiceFunction<object, T, object>;
  };
  recorder: {
    // undefined
    purge: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 365, unit_of_measurement: days, step: 1, mode: slider
        keep_days?: number;
        //  @constraints  boolean:
        repack?: boolean;
        //  @constraints  boolean:
        apply_filter?: boolean;
      }
    >;
    // undefined
    purgeEntities: ServiceFunction<
      object,
      T,
      {
        //
        entity_id?: string;
        //  @example sun @constraints  object: multiple: false
        domains?: object;
        //  @example domain*.object_id* @constraints  object: multiple: false
        entity_globs?: object;
        //  @constraints  number: min: 0, max: 365, unit_of_measurement: days, step: 1, mode: slider
        keep_days?: number;
      }
    >;
    // undefined
    enable: ServiceFunction<object, T, object>;
    // undefined
    disable: ServiceFunction<object, T, object>;
    // undefined
    getStatistics: ServiceFunction<
      object,
      T,
      {
        //  @example 2025-01-01 00:00:00 @constraints  datetime:
        start_time: string;
        //  @example 2025-01-02 00:00:00 @constraints  datetime:
        end_time?: string;
        //  @example sensor.energy_consumption,sensor.temperature @constraints  statistic: multiple: true
        statistic_ids: unknown;
        //  @example hour
        period: "5minute" | "hour" | "day" | "week" | "month";
        //  @example mean,sum
        types: "change" | "last_reset" | "max" | "mean" | "min" | "state" | "sum";
        //  @example [object Object] @constraints  object: multiple: false
        units?: object;
      }
    >;
  };
  mediaPlayer: {
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    volumeUp: ServiceFunction<object, T, object>;
    // undefined
    volumeDown: ServiceFunction<object, T, object>;
    // undefined
    mediaPlayPause: ServiceFunction<object, T, object>;
    // undefined
    mediaPlay: ServiceFunction<object, T, object>;
    // undefined
    mediaPause: ServiceFunction<object, T, object>;
    // undefined
    mediaStop: ServiceFunction<object, T, object>;
    // undefined
    mediaNextTrack: ServiceFunction<object, T, object>;
    // undefined
    mediaPreviousTrack: ServiceFunction<object, T, object>;
    // undefined
    clearPlaylist: ServiceFunction<object, T, object>;
    // undefined
    volumeSet: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 1, step: 0.01, mode: slider
        volume_level: number;
      }
    >;
    // undefined
    volumeMute: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        is_volume_muted: boolean;
      }
    >;
    // undefined
    mediaSeek: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 9223372036854776000, step: 0.01, mode: box
        seek_position: number;
      }
    >;
    // undefined
    join: ServiceFunction<
      object,
      T,
      {
        //  @example - media_player.multiroom_player2 - media_player.multiroom_player3
        group_members: string[];
      }
    >;
    // undefined
    selectSource: ServiceFunction<
      object,
      T,
      {
        //  @example video1
        source: string;
      }
    >;
    // undefined
    selectSoundMode: ServiceFunction<
      object,
      T,
      {
        //  @example Music
        sound_mode?: string;
      }
    >;
    // undefined
    playMedia: ServiceFunction<
      object,
      T,
      {
        //  @example {'media_content_id': 'https://home-assistant.io/images/cast/splash.png', 'media_content_type': 'music'} @constraints  media:
        media: unknown;
        //
        enqueue?: "play" | "next" | "add" | "replace";
        //  @example true @constraints  boolean:
        announce?: boolean;
      }
    >;
    // undefined
    browseMedia: ServiceFunction<
      object,
      T,
      {
        //  @example music
        media_content_type?: string;
        //  @example A:ALBUMARTIST/Beatles
        media_content_id?: string | number;
      }
    >;
    // undefined
    searchMedia: ServiceFunction<
      object,
      T,
      {
        //  @example Beatles
        search_query: string;
        //  @example music
        media_content_type?: string;
        //  @example A:ALBUMARTIST/Beatles
        media_content_id?: string | number;
        //  @example album,artist
        media_filter_classes?: string;
      }
    >;
    // undefined
    shuffleSet: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        shuffle: boolean;
      }
    >;
    // undefined
    unjoin: ServiceFunction<object, T, object>;
    // undefined
    repeatSet: ServiceFunction<
      object,
      T,
      {
        //
        repeat: "off" | "all" | "one";
      }
    >;
  };
  hassio: {
    // undefined
    addonStart: ServiceFunction<
      object,
      T,
      {
        //  @example core_ssh @constraints  addon:
        addon: string;
      }
    >;
    // undefined
    addonStop: ServiceFunction<
      object,
      T,
      {
        //  @example core_ssh @constraints  addon:
        addon: string;
      }
    >;
    // undefined
    addonRestart: ServiceFunction<
      object,
      T,
      {
        //  @example core_ssh @constraints  addon:
        addon: string;
      }
    >;
    // undefined
    addonStdin: ServiceFunction<
      object,
      T,
      {
        //  @example core_ssh @constraints  addon:
        addon: string;
      }
    >;
    // undefined
    hostShutdown: ServiceFunction<object, T, object>;
    // undefined
    hostReboot: ServiceFunction<object, T, object>;
    // undefined
    backupFull: ServiceFunction<
      object,
      T,
      {
        //  @example Backup 1
        name?: string;
        //  @example password
        password?: string;
        //  @constraints  boolean:
        compressed?: boolean;
        //  @example my_backup_mount @constraints  backup_location:
        location?: string;
        //  @constraints  boolean:
        homeassistant_exclude_database?: boolean;
      }
    >;
    // undefined
    backupPartial: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        homeassistant?: boolean;
        //  @constraints  boolean:
        homeassistant_exclude_database?: boolean;
        //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
        addons?: object;
        //  @example homeassistant,share @constraints  object: multiple: false
        folders?: object;
        //  @example Partial backup 1
        name?: string;
        //  @example password
        password?: string;
        //  @constraints  boolean:
        compressed?: boolean;
        //  @example my_backup_mount @constraints  backup_location:
        location?: string;
      }
    >;
    // undefined
    restoreFull: ServiceFunction<
      object,
      T,
      {
        //
        slug: string;
        //  @example password
        password?: string;
      }
    >;
    // undefined
    restorePartial: ServiceFunction<
      object,
      T,
      {
        //
        slug: string;
        //  @constraints  boolean:
        homeassistant?: boolean;
        //  @example homeassistant,share @constraints  object: multiple: false
        folders?: object;
        //  @example core_ssh,core_samba,core_mosquitto @constraints  object: multiple: false
        addons?: object;
        //  @example password
        password?: string;
      }
    >;
  };
  update: {
    // undefined
    install: ServiceFunction<
      object,
      T,
      {
        //  @example 1.0.0
        version?: string;
        //  @constraints  boolean:
        backup?: boolean;
      }
    >;
    // undefined
    skip: ServiceFunction<object, T, object>;
    // undefined
    clearSkipped: ServiceFunction<object, T, object>;
  };
  conversation: {
    // undefined
    process: ServiceFunction<
      object,
      T,
      {
        //  @example Turn all lights on
        text: string;
        //  @example NL
        language?: string;
        //  @example homeassistant @constraints  conversation_agent:
        agent_id?: string;
        //  @example my_conversation_1
        conversation_id?: string;
      }
    >;
    // undefined
    reload: ServiceFunction<
      object,
      T,
      {
        //  @example NL
        language?: string;
        //  @example homeassistant @constraints  conversation_agent:
        agent_id?: string;
      }
    >;
  };
  switch: {
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
  };
  backup: {
    // undefined
    createAutomatic: ServiceFunction<object, T, object>;
  };
  tts: {
    // undefined
    speak: ServiceFunction<
      object,
      T,
      {
        //
        media_player_entity_id: string;
        //  @example My name is hanna
        message: string;
        //  @constraints  boolean:
        cache?: boolean;
        //  @example ru
        language?: string;
        //  @example platform specific @constraints  object: multiple: false
        options?: object;
      }
    >;
    // undefined
    clearCache: ServiceFunction<object, T, object>;
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
  };
  cloud: {
    // undefined
    remoteConnect: ServiceFunction<object, T, object>;
    // undefined
    remoteDisconnect: ServiceFunction<object, T, object>;
  };
  camera: {
    // undefined
    enableMotionDetection: ServiceFunction<object, T, object>;
    // undefined
    disableMotionDetection: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    snapshot: ServiceFunction<
      object,
      T,
      {
        //  @example /tmp/snapshot_{{ entity_id.name }}.jpg
        filename: string;
      }
    >;
    // undefined
    playStream: ServiceFunction<
      object,
      T,
      {
        //
        media_player: string;
        //
        format?: "hls";
      }
    >;
    // undefined
    record: ServiceFunction<
      object,
      T,
      {
        //  @example /tmp/snapshot_{{ entity_id.name }}.mp4
        filename: string;
        //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
        duration?: number;
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        lookback?: number;
      }
    >;
  };
  group: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    set: ServiceFunction<
      object,
      T,
      {
        //  @example test_group
        object_id: string;
        //  @example My test group
        name?: string;
        //  @example mdi:camera @constraints  icon:
        icon?: string;
        //  @example domain.entity_id1, domain.entity_id2
        entities?: string;
        //  @example domain.entity_id1, domain.entity_id2
        add_entities?: string;
        //  @example domain.entity_id1, domain.entity_id2
        remove_entities?: string;
        //  @constraints  boolean:
        all?: boolean;
      }
    >;
    // undefined
    remove: ServiceFunction<
      object,
      T,
      {
        //  @example test_group @constraints  object: multiple: false
        object_id: object;
      }
    >;
  };
  light: {
    // undefined
    turnOn: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        transition?: number;
        //  @example [255, 100, 100] @constraints  color_rgb:
        rgb_color?: [number, number, number];
        //  @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
        color_temp_kelvin?: number;
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        brightness_pct?: number;
        //  @constraints  number: min: -100, max: 100, unit_of_measurement: %, step: 1, mode: slider
        brightness_step_pct?: number;
        //
        effect?: string;
        //  @example [255, 100, 100, 50] @constraints  object: multiple: false
        rgbw_color?: [number, number, number, number];
        //  @example [255, 100, 100, 50, 70] @constraints  object: multiple: false
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
        //  @example [300, 70] @constraints  object: multiple: false
        hs_color?: [number, number];
        //  @example [0.52, 0.43] @constraints  object: multiple: false
        xy_color?: [number, number];
        //  @constraints  color_temp: unit: mired, min: 153, max: 500
        color_temp?: number;
        //  @constraints  number: min: 0, max: 255, step: 1, mode: slider
        brightness?: number;
        //  @constraints  number: min: -225, max: 255, step: 1, mode: slider
        brightness_step?: number;
        //
        white?: boolean;
        //  @example relax
        profile?: string;
        //
        flash?: "long" | "short";
      }
    >;
    // undefined
    turnOff: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        transition?: number;
        //
        flash?: "long" | "short";
      }
    >;
    // undefined
    toggle: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        transition?: number;
        //  @example [255, 100, 100] @constraints  color_rgb:
        rgb_color?: [number, number, number];
        //  @constraints  color_temp: unit: kelvin, min: 2000, max: 6500
        color_temp_kelvin?: number;
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        brightness_pct?: number;
        //
        effect?: string;
        //  @example [255, 100, 100, 50] @constraints  object: multiple: false
        rgbw_color?: [number, number, number, number];
        //  @example [255, 100, 100, 50, 70] @constraints  object: multiple: false
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
        //  @example [300, 70] @constraints  object: multiple: false
        hs_color?: [number, number];
        //  @example [0.52, 0.43] @constraints  object: multiple: false
        xy_color?: [number, number];
        //  @constraints  color_temp: unit: mired, min: 153, max: 500
        color_temp?: number;
        //  @constraints  number: min: 0, max: 255, step: 1, mode: slider
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
  scene: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    apply: ServiceFunction<
      object,
      T,
      {
        //  @example light.kitchen: 'on' light.ceiling:   state: 'on'   brightness: 80  @constraints  object: multiple: false
        entities: object;
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        transition?: number;
      }
    >;
    // undefined
    create: ServiceFunction<
      object,
      T,
      {
        //  @example all_lights
        scene_id: string;
        //  @example light.tv_back_light: 'on' light.ceiling:   state: 'on'   brightness: 200  @constraints  object: multiple: false
        entities?: object;
        //  @example - light.ceiling - light.kitchen
        snapshot_entities?: string;
      }
    >;
    // undefined
    delete: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 300, unit_of_measurement: seconds, step: 1, mode: slider
        transition?: number;
      }
    >;
  };
  assistSatellite: {
    // undefined
    announce: ServiceFunction<
      object,
      T,
      {
        //  @example Time to wake up!
        message?: string;
        //  @constraints  media: accept: audio/*
        media_id?: unknown;
        //  @constraints  boolean:
        preannounce?: boolean;
        //  @constraints  media: accept: audio/*
        preannounce_media_id?: unknown;
      }
    >;
    // undefined
    startConversation: ServiceFunction<
      object,
      T,
      {
        //  @example You left the lights on in the living room. Turn them off?
        start_message?: string;
        //  @constraints  media: accept: audio/*
        start_media_id?: unknown;
        //
        extra_system_prompt?: string;
        //  @constraints  boolean:
        preannounce?: boolean;
        //  @constraints  media: accept: audio/*
        preannounce_media_id?: unknown;
      }
    >;
    // undefined
    askQuestion: ServiceFunction<
      object,
      T,
      {
        //
        entity_id: string;
        //  @example What kind of music would you like to play?
        question?: string;
        //  @constraints  media: accept: audio/*
        question_media_id?: unknown;
        //  @constraints  boolean:
        preannounce?: boolean;
        //  @constraints  media: accept: audio/*
        preannounce_media_id?: unknown;
        //  @constraints  object: label_field: sentences, description_field: id, multiple: true, translation_key: answers, fields: [object Object]
        answers?: object;
      }
    >;
  };
  zone: {
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  logbook: {
    // undefined
    log: ServiceFunction<
      object,
      T,
      {
        //  @example Kitchen
        name: string;
        //  @example is being used
        message: string;
        //
        entity_id?: string;
        //  @example light
        domain?: string;
      }
    >;
  };
  inputSelect: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    selectFirst: ServiceFunction<object, T, object>;
    // undefined
    selectLast: ServiceFunction<object, T, object>;
    // undefined
    selectNext: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        cycle?: boolean;
      }
    >;
    // undefined
    selectOption: ServiceFunction<
      object,
      T,
      {
        //  @example 'Item A' @constraints  state: hide_states: unavailable,unknown, multiple: false
        option: unknown;
      }
    >;
    // undefined
    selectPrevious: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        cycle?: boolean;
      }
    >;
    // undefined
    setOptions: ServiceFunction<
      object,
      T,
      {
        //  @example ['Item A', 'Item B', 'Item C']
        options: string;
      }
    >;
  };
  inputButton: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    press: ServiceFunction<object, T, object>;
  };
  inputNumber: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    setValue: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 9223372036854776000, step: 0.001, mode: box
        value: number;
      }
    >;
    // undefined
    increment: ServiceFunction<object, T, object>;
    // undefined
    decrement: ServiceFunction<object, T, object>;
  };
  script: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
  };
  inputBoolean: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
  };
  timer: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    start: ServiceFunction<
      object,
      T,
      {
        //  @example 00:01:00 or 60
        duration?: string;
      }
    >;
    // undefined
    pause: ServiceFunction<object, T, object>;
    // undefined
    cancel: ServiceFunction<object, T, object>;
    // undefined
    finish: ServiceFunction<object, T, object>;
    // undefined
    change: ServiceFunction<
      object,
      T,
      {
        //  @example 00:01:00, 60 or -60
        duration: string;
      }
    >;
  };
  person: {
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  vacuum: {
    // undefined
    start: ServiceFunction<object, T, object>;
    // undefined
    pause: ServiceFunction<object, T, object>;
    // undefined
    returnToBase: ServiceFunction<object, T, object>;
    // undefined
    cleanSpot: ServiceFunction<object, T, object>;
    // undefined
    locate: ServiceFunction<object, T, object>;
    // undefined
    stop: ServiceFunction<object, T, object>;
    // undefined
    setFanSpeed: ServiceFunction<
      object,
      T,
      {
        //  @example low
        fan_speed: string;
      }
    >;
    // undefined
    sendCommand: ServiceFunction<
      object,
      T,
      {
        //  @example set_dnd_timer
        command: string;
        //  @example { 'key': 'value' } @constraints  object: multiple: false
        params?: object;
      }
    >;
  };
  alarmControlPanel: {
    // undefined
    alarmDisarm: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmArmHome: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmArmAway: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmArmNight: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmArmVacation: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmArmCustomBypass: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    alarmTrigger: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
  };
  lock: {
    // undefined
    unlock: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    lock: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
    // undefined
    open: ServiceFunction<
      object,
      T,
      {
        //  @example 1234
        code?: string;
      }
    >;
  };
  cover: {
    // undefined
    openCover: ServiceFunction<object, T, object>;
    // undefined
    closeCover: ServiceFunction<object, T, object>;
    // undefined
    setCoverPosition: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        position: number;
      }
    >;
    // undefined
    stopCover: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    openCoverTilt: ServiceFunction<object, T, object>;
    // undefined
    closeCoverTilt: ServiceFunction<object, T, object>;
    // undefined
    stopCoverTilt: ServiceFunction<object, T, object>;
    // undefined
    setCoverTiltPosition: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        tilt_position: number;
      }
    >;
    // undefined
    toggleCoverTilt: ServiceFunction<object, T, object>;
  };
  valve: {
    // undefined
    openValve: ServiceFunction<object, T, object>;
    // undefined
    closeValve: ServiceFunction<object, T, object>;
    // undefined
    setValvePosition: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        position: number;
      }
    >;
    // undefined
    stopValve: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
  };
  lawnMower: {
    // undefined
    startMowing: ServiceFunction<object, T, object>;
    // undefined
    pause: ServiceFunction<object, T, object>;
    // undefined
    dock: ServiceFunction<object, T, object>;
  };
  cast: {
    // undefined
    showLovelaceView: ServiceFunction<
      object,
      T,
      {
        //
        entity_id: string;
        //  @example lovelace-cast
        dashboard_path?: string;
        //  @example downstairs
        view_path: string;
      }
    >;
  };
  reolink: {
    // undefined
    playChime: ServiceFunction<
      object,
      T,
      {
        //
        device_id: string;
        //
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
    // undefined
    ptzMove: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 1, max: 64, step: 1, mode: slider
        speed: number;
      }
    >;
  };
  schedule: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    getSchedule: ServiceFunction<object, T, object>;
  };
  mediaExtractor: {
    // undefined
    extractMediaUrl: ServiceFunction<
      object,
      T,
      {
        //  @example https://www.youtube.com/watch?v=dQw4w9WgXcQ
        url: string;
        //  @example best
        format_query?: string;
      }
    >;
    // undefined
    playMedia: ServiceFunction<
      object,
      T,
      {
        //  @example https://soundcloud.com/bruttoband/brutto-11
        media_content_id: string | number;
        //
        media_content_type: "CHANNEL" | "EPISODE" | "PLAYLIST MUSIC" | "MUSIC" | "TVSHOW" | "VIDEO";
      }
    >;
  };
  file: {
    // undefined
    readFile: ServiceFunction<
      object,
      T,
      {
        //  @example www/my_file.json
        file_name?: string;
        //  @example JSON
        file_encoding?: "JSON" | "YAML";
      }
    >;
  };
  inputDatetime: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    setDatetime: ServiceFunction<
      object,
      T,
      {
        //  @example '2019-04-20'
        date?: string;
        //  @example '05:04:20' @constraints  time:
        time?: string;
        //  @example '2019-04-20 05:04:20'
        datetime?: string;
        //  @constraints  number: min: 0, max: 9223372036854776000, mode: box, step: 1
        timestamp?: number;
      }
    >;
  };
  restCommand: {
    // undefined
    assistantRelay: ServiceFunction<object, T, object>;
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  counter: {
    // undefined
    increment: ServiceFunction<object, T, object>;
    // undefined
    decrement: ServiceFunction<object, T, object>;
    // undefined
    reset: ServiceFunction<object, T, object>;
    // undefined
    setValue: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 9223372036854776000, mode: box, step: 1
        value: number;
      }
    >;
  };
  inputText: {
    // undefined
    reload: ServiceFunction<object, T, object>;
    // undefined
    setValue: ServiceFunction<
      object,
      T,
      {
        //  @example This is an example text
        value: string;
      }
    >;
  };
  profiler: {
    // undefined
    start: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
        seconds?: number;
      }
    >;
    // undefined
    memory: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
        seconds?: number;
      }
    >;
    // undefined
    startLogObjects: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
        scan_interval?: number;
      }
    >;
    // undefined
    stopLogObjects: ServiceFunction<object, T, object>;
    // undefined
    startLogObjectSources: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 1, max: 3600, unit_of_measurement: seconds, step: 1, mode: slider
        scan_interval?: number;
        //  @constraints  number: min: 1, max: 30, unit_of_measurement: objects, step: 1, mode: slider
        max_objects?: number;
      }
    >;
    // undefined
    stopLogObjectSources: ServiceFunction<object, T, object>;
    // undefined
    dumpLogObjects: ServiceFunction<
      object,
      T,
      {
        //  @example State
        type: string;
      }
    >;
    // undefined
    dumpSockets: ServiceFunction<object, T, object>;
    // undefined
    lruStats: ServiceFunction<object, T, object>;
    // undefined
    logThreadFrames: ServiceFunction<object, T, object>;
    // undefined
    logEventLoopScheduled: ServiceFunction<object, T, object>;
    // undefined
    setAsyncioDebug: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        enabled?: boolean;
      }
    >;
    // undefined
    logCurrentTasks: ServiceFunction<object, T, object>;
  };
  commandLine: {
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  template: {
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  calendar: {
    // undefined
    createEvent: ServiceFunction<
      object,
      T,
      {
        //  @example Department Party
        summary: string;
        //  @example Meeting to provide technical review for 'Phoenix' design.
        description?: string;
        //  @example 2022-03-22 20:00:00 @constraints  datetime:
        start_date_time?: string;
        //  @example 2022-03-22 22:00:00 @constraints  datetime:
        end_date_time?: string;
        //  @example 2022-03-22 @constraints  date:
        start_date?: string;
        //  @example 2022-03-23 @constraints  date:
        end_date?: string;
        //  @example {'days': 2} or {'weeks': 2}
        in?: object;
        //  @example Conference Room - F123, Bldg. 002
        location?: string;
      }
    >;
    // undefined
    getEvents: ServiceFunction<
      object,
      T,
      {
        //  @example 2022-03-22 20:00:00 @constraints  datetime:
        start_date_time?: string;
        //  @example 2022-03-22 22:00:00 @constraints  datetime:
        end_date_time?: string;
        //  @constraints  duration:
        duration?: {
          hours?: number;
          days?: number;
          minutes?: number;
          seconds?: number;
        };
      }
    >;
  };
  notify: {
    // undefined
    sendMessage: ServiceFunction<
      object,
      T,
      {
        //
        message: string;
        //
        title?: string;
      }
    >;
    // undefined
    persistentNotification: ServiceFunction<
      object,
      T,
      {
        //  @example The garage door has been open for 10 minutes.
        message: string;
        //  @example Your Garage Door Friend
        title?: string;
        //  @example platform specific @constraints  object: multiple: false
        data?: object;
      }
    >;
    // Sends a notification message using the mobile_app_shans_s25 integration.
    mobileAppShansS25: ServiceFunction<
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
  climate: {
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    setHvacMode: ServiceFunction<
      object,
      T,
      {
        //  @constraints  state: hide_states: unavailable,unknown, multiple: false
        hvac_mode?: unknown;
      }
    >;
    // undefined
    setPresetMode: ServiceFunction<
      object,
      T,
      {
        //  @example away
        preset_mode: string;
      }
    >;
    // undefined
    setTemperature: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        temperature?: number;
        //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        target_temp_high?: number;
        //  @constraints  number: min: 0, max: 250, step: 0.1, mode: box
        target_temp_low?: number;
        //
        hvac_mode?: "off" | "auto" | "cool" | "dry" | "fan_only" | "heat_cool" | "heat";
      }
    >;
    // undefined
    setHumidity: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 30, max: 99, unit_of_measurement: %, step: 1, mode: slider
        humidity: number;
      }
    >;
    // undefined
    setFanMode: ServiceFunction<
      object,
      T,
      {
        //  @example low
        fan_mode: string;
      }
    >;
    // undefined
    setSwingMode: ServiceFunction<
      object,
      T,
      {
        //  @example on
        swing_mode: string;
      }
    >;
    // undefined
    setSwingHorizontalMode: ServiceFunction<
      object,
      T,
      {
        //  @example on
        swing_horizontal_mode: string;
      }
    >;
  };
  deviceTracker: {
    // undefined
    see: ServiceFunction<
      object,
      T,
      {
        //  @example FF:FF:FF:FF:FF:FF
        mac?: string;
        //  @example phonedave
        dev_id?: string;
        //  @example Dave
        host_name?: string;
        //  @example home
        location_name?: string;
        //  @example [51.509802, -0.086692] @constraints  object: multiple: false
        gps?: object;
        //  @constraints  number: min: 0, mode: box, unit_of_measurement: m, step: 1
        gps_accuracy?: number;
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        battery?: number;
      }
    >;
  };
  button: {
    // undefined
    press: ServiceFunction<object, T, object>;
  };
  number: {
    // undefined
    setValue: ServiceFunction<
      object,
      T,
      {
        //  @example 42
        value: string;
      }
    >;
  };
  select: {
    // undefined
    selectFirst: ServiceFunction<object, T, object>;
    // undefined
    selectLast: ServiceFunction<object, T, object>;
    // undefined
    selectNext: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        cycle?: boolean;
      }
    >;
    // undefined
    selectOption: ServiceFunction<
      object,
      T,
      {
        //  @example 'Item A' @constraints  state: hide_states: unavailable,unknown, multiple: false
        option: unknown;
      }
    >;
    // undefined
    selectPrevious: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        cycle?: boolean;
      }
    >;
  };
  text: {
    // undefined
    setValue: ServiceFunction<
      object,
      T,
      {
        //  @example Hello world!
        value: string;
      }
    >;
  };
  siren: {
    // undefined
    turnOn: ServiceFunction<
      object,
      T,
      {
        //  @example fire
        tone?: string;
        //  @example 0.5 @constraints  number: min: 0, max: 1, step: 0.05, mode: slider
        volume_level?: number;
        //  @example 15
        duration?: string;
      }
    >;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
  };
  remote: {
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<
      object,
      T,
      {
        //  @example BedroomTV
        activity?: string;
      }
    >;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    sendCommand: ServiceFunction<
      object,
      T,
      {
        //  @example 32756745
        device?: string;
        //  @example Play @constraints  object: multiple: false
        command: object;
        //  @constraints  number: min: 0, max: 255, step: 1, mode: slider
        num_repeats?: number;
        //  @constraints  number: min: 0, max: 60, step: 0.1, unit_of_measurement: seconds, mode: slider
        delay_secs?: number;
        //  @constraints  number: min: 0, max: 60, step: 0.1, unit_of_measurement: seconds, mode: slider
        hold_secs?: number;
      }
    >;
    // undefined
    learnCommand: ServiceFunction<
      object,
      T,
      {
        //  @example television
        device?: string;
        //  @example Turn on @constraints  object: multiple: false
        command?: object;
        //
        command_type?: "ir" | "rf";
        //  @constraints  boolean:
        alternative?: boolean;
        //  @constraints  number: min: 0, max: 60, step: 5, unit_of_measurement: seconds, mode: slider
        timeout?: number;
      }
    >;
    // undefined
    deleteCommand: ServiceFunction<
      object,
      T,
      {
        //  @example television
        device?: string;
        //  @example Mute @constraints  object: multiple: false
        command: object;
      }
    >;
  };
  fan: {
    // undefined
    turnOn: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        percentage?: number;
        //  @example auto
        preset_mode?: string;
      }
    >;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    increaseSpeed: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        percentage_step?: number;
      }
    >;
    // undefined
    decreaseSpeed: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        percentage_step?: number;
      }
    >;
    // undefined
    oscillate: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        oscillating: boolean;
      }
    >;
    // undefined
    setDirection: ServiceFunction<
      object,
      T,
      {
        //
        direction: "forward" | "reverse";
      }
    >;
    // undefined
    setPercentage: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        percentage: number;
      }
    >;
    // undefined
    setPresetMode: ServiceFunction<
      object,
      T,
      {
        //  @example auto
        preset_mode: string;
      }
    >;
  };
  humidifier: {
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    setMode: ServiceFunction<
      object,
      T,
      {
        //  @example away
        mode: string;
      }
    >;
    // undefined
    setHumidity: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 100, unit_of_measurement: %, step: 1, mode: slider
        humidity: number;
      }
    >;
  };
  waterHeater: {
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<object, T, object>;
    // undefined
    setAwayMode: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        away_mode: boolean;
      }
    >;
    // undefined
    setTemperature: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 250, step: 0.5, mode: box, unit_of_measurement: °
        temperature: number;
        //  @example eco
        operation_mode?: string;
      }
    >;
    // undefined
    setOperationMode: ServiceFunction<
      object,
      T,
      {
        //  @example eco
        operation_mode: string;
      }
    >;
  };
  weather: {
    // undefined
    getForecasts: ServiceFunction<
      object,
      T,
      {
        //
        type: "daily" | "hourly" | "twice_daily";
      }
    >;
  };
  onvif: {
    // undefined
    ptz: ServiceFunction<
      object,
      T,
      {
        //
        tilt?: "DOWN" | "UP";
        //
        pan?: "LEFT" | "RIGHT";
        //
        zoom?: "ZOOM_IN" | "ZOOM_OUT";
        //  @constraints  number: min: 0, max: 1, step: 0.01, mode: slider
        distance?: number;
        //  @constraints  number: min: 0, max: 1, step: 0.01, mode: slider
        speed?: number;
        //  @constraints  number: min: 0, max: 1, step: 0.01, mode: slider
        continuous_duration?: number;
        //  @example 1
        preset?: string;
        //
        move_mode?: "AbsoluteMove" | "ContinuousMove" | "GotoPreset" | "RelativeMove" | "Stop";
      }
    >;
  };
  google: {
    // undefined
    createEvent: ServiceFunction<
      object,
      T,
      {
        //  @example Bowling
        summary: string;
        //  @example Birthday bowling
        description?: string;
        //  @example 2022-03-22 20:00:00
        start_date_time?: string;
        //  @example 2022-03-22 22:00:00
        end_date_time?: string;
        //  @example 2022-03-10
        start_date?: string;
        //  @example 2022-03-11
        end_date?: string;
        //  @example 'days': 2 or 'weeks': 2 @constraints  object: multiple: false
        in?: object;
        //  @example Conference Room - F123, Bldg. 002
        location?: string;
      }
    >;
  };
  automation: {
    // undefined
    trigger: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        skip_condition?: boolean;
      }
    >;
    // undefined
    toggle: ServiceFunction<object, T, object>;
    // undefined
    turnOn: ServiceFunction<object, T, object>;
    // undefined
    turnOff: ServiceFunction<
      object,
      T,
      {
        //  @constraints  boolean:
        stop_actions?: boolean;
      }
    >;
    // undefined
    reload: ServiceFunction<object, T, object>;
  };
  zha: {
    // undefined
    permit: ServiceFunction<
      object,
      T,
      {
        //  @constraints  number: min: 0, max: 254, unit_of_measurement: seconds, step: 1, mode: slider
        duration?: number;
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee?: string;
        //  @example 00:0a:bf:00:01:10:23:35
        source_ieee?: string;
        //  @example 1234-5678-1234-5678-AABB-CCDD-AABB-CCDD-EEFF
        install_code?: string;
        //  @example Z:000D6FFFFED4163B$I:52797BF4A5084DAA8E1712B61741CA024051
        qr_code?: string;
      }
    >;
    // undefined
    remove: ServiceFunction<
      object,
      T,
      {
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
      }
    >;
    // undefined
    setZigbeeClusterAttribute: ServiceFunction<
      object,
      T,
      {
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        //  @constraints  number: min: 1, max: 65535, mode: box, step: 1
        endpoint_id: number;
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        cluster_id: number;
        //
        cluster_type?: "in" | "out";
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        attribute: number;
        //  @example 1
        value: string;
        //  @example 252
        manufacturer?: string;
      }
    >;
    // undefined
    issueZigbeeClusterCommand: ServiceFunction<
      object,
      T,
      {
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        endpoint_id: number;
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        cluster_id: number;
        //
        cluster_type?: "in" | "out";
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        command: number;
        //
        command_type: "client" | "server";
        //  @example [arg1, arg2, argN] @constraints  object: multiple: false
        args?: object;
        //  @constraints  object: multiple: false
        params?: object;
        //  @example 252
        manufacturer?: string;
      }
    >;
    // undefined
    issueZigbeeGroupCommand: ServiceFunction<
      object,
      T,
      {
        //  @example 546
        group: string;
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        cluster_id: number;
        //
        cluster_type?: "in" | "out";
        //  @constraints  number: min: 1, max: 65535, step: 1, mode: slider
        command: number;
        //  @example [arg1, arg2, argN] @constraints  object: multiple: false
        args?: object;
        //  @example 252
        manufacturer?: string;
      }
    >;
    // undefined
    warningDeviceSquawk: ServiceFunction<
      object,
      T,
      {
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        //  @constraints  number: min: 0, max: 1, mode: box, step: 1
        mode?: number;
        //  @constraints  number: min: 0, max: 1, mode: box, step: 1
        strobe?: number;
        //  @constraints  number: min: 0, max: 3, mode: box, step: 1
        level?: number;
      }
    >;
    // undefined
    warningDeviceWarn: ServiceFunction<
      object,
      T,
      {
        //  @example 00:0d:6f:00:05:7d:2d:34
        ieee: string;
        //  @constraints  number: min: 0, max: 6, mode: box, step: 1
        mode?: number;
        //  @constraints  number: min: 0, max: 1, mode: box, step: 1
        strobe?: number;
        //  @constraints  number: min: 0, max: 3, mode: box, step: 1
        level?: number;
        //  @constraints  number: min: 0, max: 65535, unit_of_measurement: seconds, step: 1, mode: slider
        duration?: number;
        //  @constraints  number: min: 0, max: 100, step: 10, mode: slider
        duty_cycle?: number;
        //  @constraints  number: min: 0, max: 3, mode: box, step: 1
        intensity?: number;
      }
    >;
    // undefined
    setLockUserCode: ServiceFunction<
      object,
      T,
      {
        //  @example 1
        code_slot: string;
        //  @example 1234
        user_code: string;
      }
    >;
    // undefined
    enableLockUserCode: ServiceFunction<
      object,
      T,
      {
        //  @example 1
        code_slot: string;
      }
    >;
    // undefined
    disableLockUserCode: ServiceFunction<
      object,
      T,
      {
        //  @example 1
        code_slot: string;
      }
    >;
    // undefined
    clearLockUserCode: ServiceFunction<
      object,
      T,
      {
        //  @example 1
        code_slot: string;
      }
    >;
  };
}
