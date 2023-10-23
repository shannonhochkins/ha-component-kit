# Overview

This repository contains functionality to easily generate custom dashboards for Home Assistant using the official web socket connection that the standard lovelace dashboards use.

Try it out now! [Demo](https://shannonhochkins.github.io/ha-component-kit/iframe.html?args=&id=introduction-overview--default&viewMode=story#)


If you like anything here, be sure to 🌟 [my repo!](https://github.com/shannonhochkins/ha-component-kit)

![DEMO](https://github.com/shannonhochkins/ha-component-kit/blob/master/stories/hakit-demo.gif?raw=true)

## Help me out?

I've spent a lot of time on this, you're free to use it but would appreciate a small donation if you're feeling generous! Buy me a coffee!

[Buy me a coffee!](https://www.buymeacoffee.com/jinglezzz)

### Get Started
There's an npm create command which will setup react, typescript, vite & hakit automatically for you with a terminal wizard!
```
  npm create hakit@latest
```

Or, if you want to install [@hakit/core](https://www.npmjs.com/package/@hakit/core) or [@hakit/components](https://www.npmjs.com/package/@hakit/components) manually on an existing project:
```
  npm install @hakit/core @hakit/components
```

There's extensive [documentation](https://shannonhochkins.github.io/ha-component-kit) which should give you all the information you need to get started!

### NEWS!

I'm working on a home assistant addon to create dashboards with these components, also making it easier to introduce custom components from the public and making it easier to apply style changes

[Home Assistant Addon](https://github.com/shannonhochkins/hakit) - 🌟 it if you're interested

### Supported Cards
1. [ButtonCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-buttoncard--docs)
2. [ClimateCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-climatecard--docs)
3. [EntitiesCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-entitiescard--docs)
4. [FabCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-fabcard--docs)
5. [GarbageCollectionCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-garbagecollectioncard--docs)
6. [MediaPlayerCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-mediaplayercard--docs)
7. [PictureCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-picturecard--docs)
8. [AreaCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-areacard--docs)
9. [SensorCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-sensorcard--docs)
10. [SidebarCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-sidebarcard--docs)
11. [TimeCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-timecard--docs)
12. [TriggerCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-triggercard--docs)
13. [WeatherCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-weathercard--docs)
14. [CalendarCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-calendarcard--docs)

### Other Useful Components
1. [Group](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-group--docs) - a component that allows collapsible sections for other cards/components
2. [Alert](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-alert--docs) - Display warnings, errors, success and general information
3. [Column](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-column--docs) - A card to layout components in a column with all flex properties available
4. [ControlSlider](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-controlslider--docs) - If you're used to the slider to control brightness, curtain position in home assistant, this is identical 
5. [Row](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-row--docs) - A card to layout components in a Row supporting all flex properties
6. [RangeSlider](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-rangeslider--docs) - A simple slider similar to a volume slider 
7. [Tooltip](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-tooltip--docs) - A simple tooltip component to wrap around anything and provide more information on hover
8. [Modal](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-modal--docs) - A Popup/Modal to show more information, can be triggered by any action

### Known Issues
- Anything else? Please, if you notice anything that doesn't feel / look right, please report it, i rely on user testing to make improvements.

### What's next?

There's a Roadmap.md file with a few things i'm working on!
Have your say! Vote for what you'd like to see next in [upcoming features!](https://github.com/shannonhochkins/ha-component-kit/discussions/28), here's a few other small ideas i have!

- WeatherCard - Add more detailed options for related sensors like UV Index, wind chill, humidity etc
- EntitiesCard - Add Toggle for entities that support "toggle" service to allow an easy way to toggle/turnon/turnoff devices
- ButtonCard - Different layout designs, including slider indicator for brightness and curtain position etc
- ClimateCard - control temperature from initial card (popup already has this but it's something that users may want at a glance)
- AreaCard - Allow alternate layouts, users may not just want a picture of the area but rather an icon / name layout
- History - include existing history information on all cards as popup similar to home assistant

### Vision

homeassistant hacs integration - an integration that behaves similar to the lovelace dashboard, drag & drop, resizing, fluid containers using [react-grid-layoutd](https://github.com/react-grid-layout/react-grid-layout) - storing the layouts inside home assistant, card picker for slots, would be a game changer! I would love some help with this part whilst im improving and adding cards / functionality

### Contributors!

I welcome anyone who's willing to contribute to the package, if you're interested in helping out or have some suggestions to changes, please feel free to open a PR or an issue!

There's detailed instructions on how to get started if you want to introduce a new feature to the repository [here](CONTRIBUTING.md).


