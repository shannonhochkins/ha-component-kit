# Overview

This repository contains functionality to easily generate custom dashboards for Home Assistant using the official web socket connection that the standard lovelace dashboards use.

Try it out now! [Demo](https://shannonhochkins.github.io/ha-component-kit/iframe.html?args=&id=introduction-overview--default&viewMode=story#)


If you like anything here, be sure to 🌟 [my repo!](https://github.com/shannonhochkins/ha-component-kit)

![DEMO](https://github.com/shannonhochkins/ha-component-kit/blob/master/stories/hakit-demo.gif?raw=true)

## Help me out?

Please, as you can probably tell, 100s of hours have gone into this! I'd really appreciate a small donation as it will help me validate that my time is well spent and will guarantee future additional changes :) [Buy me a coffee!](https://www.buymeacoffee.com/jinglezzz)

### Get Started
There's an npm create command which will setup react, typescript, vite & hakit automatically for you with a terminal wizard!

```
  npm create hakit@latest
```

Or, if you want to install [@hakit/core](https://www.npmjs.com/package/@hakit/core) [![npm version](https://badge.fury.io/js/@hakit%2Fcore.svg)](https://www.npmjs.com/package/@hakit/core)  or [@hakit/components](https://www.npmjs.com/package/@hakit/components) [![npm version](https://badge.fury.io/js/@hakit%2Fcomponents.svg)](https://www.npmjs.com/package/@hakit/components) manually on an existing project:
```
  npm install @hakit/core @hakit/components
```

There's extensive [documentation](https://shannonhochkins.github.io/ha-component-kit) which should give you all the information you need to get started!

### WIP - Next Release

- Theming - allow individual components to display different theme control, either by a hue shift or global change
 - WeatherCard - add more information in the popup, adjust the forecast functionality to align with the new upcoming [release](https://www.home-assistant.io/blog/2023/09/06/release-20239/#:~:text=With%20this%20change%2C%20the%20forecast,being%20updated%20all%20the%20time), will also convert the details prop to align with other cards, to accept children rather than a configuration object.

[Home Assistant Addon](https://github.com/shannonhochkins/hakit) - 🌟 it if you're interested

### Supported Cards
- [AreaCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-areacard--docs)
- [ButtonCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-buttoncard--docs)
- [ClimateCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-climatecard--docs)
- NEW [CameraCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-cameracard--docs)
- NEW [CalendarCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-calendarcard--docs)
- [EntitiesCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-entitiescard--docs)
- [FabCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-fabcard--docs)
- [GarbageCollectionCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-garbagecollectioncard--docs)
- [MediaPlayerCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-mediaplayercard--docs)
- [PictureCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-picturecard--docs)
- [SensorCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-sensorcard--docs)
- [SidebarCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-sidebarcard--docs)
- [TimeCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-timecard--docs)
- [TriggerCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-triggercard--docs)
- [WeatherCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-weathercard--docs)

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
Have your say! Vote for what you'd like to see next in [upcoming features!](https://github.com/shannonhochkins/ha-component-kit/discussions/28)

### Vision

homeassistant hacs integration - an integration that behaves similar to the lovelace dashboard, drag & drop, resizing, fluid containers using [react-grid-layoutd](https://github.com/react-grid-layout/react-grid-layout) - storing the layouts inside home assistant, card picker for slots, would be a game changer! I would love some help with this part whilst im improving and adding cards / functionality

### Contributors!

I welcome anyone who's willing to contribute to the package, if you're interested in helping out or have some suggestions to changes, please feel free to open a PR or an issue!

There's detailed instructions on how to get started if you want to introduce a new feature to the repository [here](CONTRIBUTING.md).


