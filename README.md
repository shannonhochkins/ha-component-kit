<br />




<div align="left">



<table>
  <tr>
    <td width="127"><img src="https://cdn.discordapp.com/icons/1231534799248691252/4b6124f952f099f855b5186d8a68f33e.webp?size=100" alt="HAKIT LOGO" ></td>
    <td><h1 style="border: none">HA COMPONENT KIT</h1>
    <table>
  <tr>
    <td>
        <a aria-label="@HAKIT/CORE" href="https://www.npmjs.com/package/@hakit/core">
    <img alt="" src="https://img.shields.io/npm/v/@hakit/core.svg?style=for-the-badge&labelColor=000000&label=@hakit/CORE" align="left" height="16" width="auto">
  </a>
    </td>
    <td><a aria-label="@HAKIT/COMPONENTS" href="https://www.npmjs.com/package/@hakit/components">
    <img alt="" src="https://img.shields.io/npm/v/@hakit/components.svg?style=for-the-badge&labelColor=000000&label=@HAKIT/COMPONENTS" align="left" height="16" width="auto">
  </a></td>
  </tr>
<tr>
    <td align="left">
    <img alt="" src="https://img.shields.io/npm/dt/%40hakit%2Fcore.svg?style=flat&colorA=000000&colorB=000000&label=Downloads" align="top" height="20" width="auto">
    </td>
  <td align="left">
    <img src="https://img.shields.io/npm/dt/%40hakit%2Fcomponents.svg?style=flat&colorA=000000&colorB=000000&label=Downloads" alt="" align="top" height="20" width="auto">
  </td>
  </tr>
</table>
    </td>
  </tr>
</table>

_Beautiful, Reactive, Real-Time Smarthome UI—Powered by You._

[Demo](https://shannonhochkins.github.io/ha-component-kit/iframe.html?args=&id=introduction-demo--demo&viewMode=story) • [Documentation](https://shannonhochkins.github.io/ha-component-kit/)  • [Discord](https://discord.com/invite/cGgbmppKJZ) • [Contributing](https://github.com/shannonhochkins/ha-component-kit/blob/master/CONTRIBUTING.md)

⭐️ Having fun? Support us! [leave a star](https://github.com/shannonhochkins/ha-component-kit)!
</div>

<br /><br />
![DEMO](https://github.com/shannonhochkins/ha-component-kit/blob/master/stories/hakit-demo.gif?raw=true)
<br /><br />
## What is this?

HA component kit is a set of [React](https://react.dev/)-based packages for building highly customizable dashboards on top of [Home Assistant](https://www.home-assistant.io/).

Use it to:

- Build your own dashboard UI using familiar React patterns.
- Drop in ready-made components from [@hakit/components](https://www.npmjs.com/package/@hakit/components).
- Talk to Home Assistant via [@hakit/core](https://www.npmjs.com/package/@hakit/core), which wraps the official [Home Assistant WebSocket API](https://github.com/home-assistant/home-assistant-js-websocket) for authentication, state and actions.

Whether you just want a nicer wall tablet view or a fully bespoke control centre, HAKit gives you the building blocks.

### Key ideas

- **Flexible by design**  
  Compose your own layouts and components, or mix them with the prebuilt cards. You’re not locked into a single layout or opinionated theme.

- **Real-time, reactive dashboards**  
  State updates flow in via WebSockets, so your UI stays in sync with Home Assistant without extra glue code.

- **Easy to host**  
  Serve your dashboard from any web server, or use the [Home Assistant Add-on](https://github.com/shannonhochkins/ha-component-kit/blob/master/ADDON.md) to surface it directly in the Home Assistant sidebar.

- **Future: visual editor**  
  The current focus is on developers. The longer-term goal is a drag-and-drop UI editor, shipped via the add-on, so non-devs can build dashboards visually.

Ready to dive in? Start with the [Getting Started guide](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-getting-started--docs).

---

## Support the project

This has taken a $*#% tonne of hours to build, document, and maintain.  
If it saves you time or becomes part of your setup, a small donation goes a long way in justifying future work.

<a href="https://www.buymeacoffee.com/jinglezzz" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 40px !important;width: auto !important;">
</a>

---

### Get Started
The fastest way to spin up a new project is with the create command. It sets up React, TypeScript, Vite and HAKit with a simple terminal wizard:

```
  npm create hakit@latest
```

Or, if you want to install [@hakit/core](https://www.npmjs.com/package/@hakit/core) or [@hakit/components](https://www.npmjs.com/package/@hakit/components) manually on an existing project:
```
  npm install @hakit/core @hakit/components
```

### Home Assistant Addon
There's a [Home Assistant Addon](hakit/README.md) available which will serve your prebuilt dashboard to a new sidebar link in home assistant making it easier to access your custom dashboard.


### Contributing

Contributions are very welcome — whether it’s bug reports, new features, docs improvements, or just “this feels weird” feedback.

- Open an issue if something looks off or could be improved.
- Open a PR if you’ve got a fix or feature ready to go.

There are detailed guidelines on getting set up and adding new features in [here](CONTRIBUTING.md).



