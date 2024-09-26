# 4.0.3

## @hakit/components
- No functional changes, just updated to locales
## @hakit/core
- No functional changes, just updated to locales

# 4.0.2
## @hakit/components
- BUGFIX - All cards using `modalProps` previously will spread the values first, and then provide internal defaults, making it impossible to overwrite values for the modal in some cases, additionally the MediaPlayerCard modal props were never spread through to the modal [discussion](https://github.com/shannonhochkins/ha-component-kit/discussions/159)

## @hakit/core
- NEW - useTemplate - a new hook to subscribe to changes for a custom template, processed exactly the same way that home assistant does when providing templates to yaml code
- NEW - LOCALES - locales updated based on home assistant updates. [issue](https://github.com/shannonhochkins/ha-component-kit/issues/158)

# 4.0.0
## @hakit/components
- NEW - [AlarmCard](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-cards-alarmcard--docs)  - A new card to interact with alarm entities, this has a custom popup with keypad control and automate `features` added to the code when a `defaultCode` is present. [issue](https://github.com/shannonhochkins/ha-component-kit/issues/148)
- NEW - [AlarmControls](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/components-shared-entity-alarm-alarmcontrols--docs) component to use independently of the AlarmCard
- NEW - MULTILINGAL - The entire codebase has been refactored to use the new `localize` method from `@hakit/core` which will display previously hard coded values in english, as well as much more in the language of your choice, this can be configured by simply changing the language in your home assistant instance, or by providing it to HassConnect. As values may change in your language of choice, the layouts may also change to what you're expecting - please report any issues. [issue](https://github.com/shannonhochkins/ha-component-kit/issues/135)
- NEW/BREAKING - ThemeProvider - There's now variations for rgba values for the `-ha-info-color` and other success/warning/error colors, this is also a breaking change as the variables were renamed slightly [issue](https://github.com/shannonhochkins/ha-component-kit/issues/152)
```
  background-color: var(--ha-alert-info-color);
   <--> this becomes -->
  background-color: var(--ha-info-color);
```
- NEW - CardBase - This is the component that every other Card extends, it has had some great upgrades
  - new `features` prop that accepts `FeatureEntity` or `FeatureEntity[]` as a type to render actions as part of the "footer" of the card, this has already been introduced into the ClimateCard, AlarmCard & CameraCard, this is similar in terms of functionality to what Home Assistant provided for its "features"
  - new `relatedEntities` prop that accepts `ReleatedEntity` or `ReleatedEntity[]` that has pre-calculated zones for position which will just overlay ontop of the card container, ie if the position prop is set to `right top` it will position the element in the right top most part of the container, the AlarmCard demo shows this through the use of the the battery icon, useful to display the battery level of an entity in a separate entity card.
  - new `graph` prop which will allow you to show a graph like the "SensorCard" does by adding the `graph` to the bottom of the card, you can also control how the graph displays it's history, styles, position and more.
  - new `resizeDetectorProps` - allows you to tap into the resizer to retrieve the size of the card in pixels from a callback for either width, height or both at once and more, this is currently throttled by 50ms, this is useful if your card needs to know it's own size
- NEW - TimeCard - will no longer depend on `sensor.time` and `sensor.date` as entities, by default it will still use these, but now you can also just use the system clock of the browser running the instance, which opens up additional functionality to format the date/time values with a simple format string with the `dateFormat` and `timeFormat` props and also a custom formatting option as a callback for both date and time too. You can also control how often the update occurs by changing the `throttleTime` prop (defaults to 1000ms), also, `iconProps` was introduced here too.
- NEW - VacuumCard - design changed slightly as it now extends the ButtonCard component, the `Fab` of the button card is now the animated vacuum image.
- NEW - WeatherCard - `iconProps` added, internally, performance update made to use the global resize detector 
- NEW - TriggerCard - `iconProps` and `sliderIconProps` added to style the icons independently
- NEW - ButtonCard - `fabProps` added to style the wrapping element of the icon within the card, this allows you to change the background color amongst other things for the Fab element.
- NEW - ButtonCard - `unitOfMeasurement` prop added to allow users the ability to change the displayed unit of measurement on entities.
- NEW - ButtonCard - `customRenderState` - new prop added as a function to allow you to render the state within the card however you like, by default it will just render the state of the entity.
- NEW - ButtonCard - `hideToggle` prop added to hide the toggle button in the default layout type.
- NEW - ButtonCard - `hideIcon` - new prop to ide the icon
- NEW - EntitiesCard - I've started to introduce custom "action" components based on the entity type used, for example a switch entity will now display a "toggle" that's clickable and will automatically trigger the "toggle" service when clicked, similar to home assistant. I've introduced toggle, climate and sensor so far as custom state parts of each row. More to come later like cover controls for example.
- NEW - EntitiesCardRow - added `iconProps` to provide additional styles to the icon.
- NEW - ClimateCard - `showHvacModeLabels` - add this prob to display the locale label of the mode in the feature buttons - note this may only be useful if you're displaying one or two hvac modes.
- NEW - VacuumControls - added `locateNode` prop, the text/node to render when locating @default 'Locate...' in preferred language, added `buttonGroupProps` to adjust how the buttons are displayed.
- NEW - TextField - new component to render a text field in the browser, currently used by the keypad for the AlarmCard
- NEW - ButtonBar - added `layoutType` prop which now supports "bubble" and "grouped", grouped is the default and is what it was previously, bubble is what's used by the "features" within the cards. ButtonBar also supports new props to change the alignment within, like gap, and flex properties.
- NEW - ButtonGroup - new `gap` property to adjust the spacing between the children, new `maintainAspectRatio` prop which is enabled by default to maintain the 1/1 ratio of the buttons.
- NEW - ButtonGroupButton - Now accepts children, typically used to show a label if need be, `disabled`, `iconProps` and `disableScaleEffect` also now introduced.
- NEW - ButtonBarButton - `hideActiveBorder` - when in bubble layoutType you can hide the bottom border of the button.
- NEW - Modal popups are now loaded asynchronously, this should improve performance when rendering the popup and now the dashboard by default won't be required to load these assets on load.
- NEW - PictureCard - `iconProps` added
- NEW - ClimateControls - new prop `hvacModeLabels` to customize the hvac mode labels from the default, this can be passed down from the ClimateCard through the `modalProps` prop.
- BREAKING - ClimateCard - technically it's not a breaking change, previously by default the card would display the temperature controls by default, now they're hidden by default as I figured it's more likely a seasonal change that's made and if temperature needs to be changed it can be done in the popup by long pressing the card, if you want to add them back in simply add the `showTemperatureControls` prop
- BREAKING - ButtonCard - `defaultLayout` prop renamed to `layoutType`, to fix this, simply find and replace `defaultLayout` and replace with `layoutType`.
- BREAKING - AllCards - `iconColor` renamed to `iconProps` to expose more functionality to the user to re-style the icon element.
Previously, you'd provide an `iconColor` prop with a string which was available on all cards, below is an example of how to convert this to the new `iconProps` prop:
```
  <ButtonCard iconColor="red" />
  <!-- convert to: -->
  <ButtonCard iconProps={{
    style: {
      color: "red" 
    }
  }} />
```
BREAKING - ButtonCard - swapped title and description on ButtonCard, it's always bothered me that the title is actually the "second" element on the button, this has been changed, to fix this if you're using either the description or the title prop or both, simply invert the names. Fixes [issue](https://github.com/shannonhochkins/ha-component-kit/issues/150)
```
<ButtonCard entity="switch.something" title="A description" description="A Title" />
<-- This now changes to -->
<ButtonCard entity="switch.something" description="A description" title="A Title" />
```
- DEPRECATED - Removed RoomCard alias, this was previously renamed to AreaCard, if you're using RoomCard, you'll need to change this to AreaCard.
- BREAKING/NEW - Potential breaking change, AlarmCard, SensorCard, ClimateCard & VacuumCard now all extend the ButtonCard component instead of the CardBase, this introduces new shared properties, allows new layouts for AlarmCard, SensorCard, ClimateCard & VacuumCard and extends more functionality to these cards.
- BUGFIX - Scale effect on mouse down on cards was broken in the previous release
- BUGFIX - Fixed a few font-family issues where some cards weren't honouring changes to the default font family through the css variable.
- BUGFIX - ThemeProvider - There is new hsla variables exposed, and some of the colours didn't expose these values - this has been fixed, additionally an [issue](https://github.com/shannonhochkins/ha-component-kit/issues/154) as been fixed that was causing a flashing effect with the controls.

## @hakit/core
- BUGFIX - Fixed a bug where the hassUrl provided may have contained a trailing slash and was stored without it, it will now sanitize the input url to ensure it's stored correctly. [issue](https://github.com/shannonhochkins/,ha-component-kit/issues/146#issuecomment-2138352567), the `useTranslations` hook has also been removed.
- NEW - `useLocale`, `useLocales` - a hook to retrieve the locales, useLocale is similar in nature to the `locale` function, useLocales will return all available locales from home assistant.
- DEPRECATED/BREAKING - Removed `fetchTranslations` and replaced with multilingual support, this was previously used to fetch translations from home assistant, now this is done automatically through the `localize` method.
- DEPRECATED/BREAKING - Removed `useTranslations` as this is now handled with the `localize` method.
- NEW - HassConnect - Now accepts a `hassToken` property which will allow you to bypass the login screen [fixes](https://github.com/shannonhochkins/ha-component-kit/issues/147)
- NEW - HassConnect - now accepts a locale property, by default it will retrieve the language from home assistant, but if you want to overwrite this you can here.
- NEW - HassConnect - now accepts a `portalRoot` property, AreaCard, Tooltip, Modal - now have the ability to change the portal root, meaning if you're rendering within an iframe, you can change the root of the portal to render these elements in the correct location. This is configurable from HassConnect through the `portalRoot` option.
- BUGFIX - Issue with the color calculations caused a floating point value for the RGBA values to cause unwanted re-renders as the value was technically changing by 5 decimal places whilst it's transitioning or animating whilst turning on, the values are now rounded so we don't get updates on the floating point values.
- NEW - `useDevice` a hook to retrieve extended information about a device from home assistant. [issue](https://github.com/shannonhochkins/ha-component-kit/issues/151)
- NEW - `computeAttributeDisplay` a method that will format the attribute value based on the entity you're accessing it from, it will suffix it with expected units, or format dates/numbers automatically for you.
- NEW - `computeAttributeDisplay` a function that will convert a domain name into a localized title
- NEW - `computeStateDisplay` - a function that will format the values of the state depending on the entity attributes and entity type.
- NEW - `formatDate`, `formatTime`, `formatDateTime` - helper functions to convert a time value based on the config of the home assistant instance.
- NEW - `timeAgo` - exposing `timeAgo` function that displays the relative time from now from a date string, ie 8 hours ago, 2 days ago etc.
## create-hakit
- NEW - package will new prefer the `hassToken` option as a default and will prompt you to enter the token if you don't provide it.
## Storybook
- BUGFIX - Previously, whenever you interacted with a card on the demo page it would trigger a re-render of EVERY other card which made the demo feel clunky, this has been fixed to align with what actually happens on a real dashboard.
- BUGFIX - Fixing issue on the demo page where it wasn't stretching to full width
- DEPLOYMENT DOCS - updated to use the Advanced SSH and Web Terminal addon ([issue](https://github.com/shannonhochkins/ha-component-kit/issues/153))





# 3.2.0
## @hakit/components
- NEW VacuumCard - A new card to interact with vacuum entities, this card will show the current state of the vacuum, the battery level, the current cleaning status and the ability to start, pause, stop and return to dock. It provides the ability to create custom shortcuts and much more, you can long press on the card to display the new custom popup. Demo available on the main [demo](https://shannonhochkins.github.io/ha-component-kit/iframe.html?args=&id=introduction-demo--default&viewMode=story#) page.
- NEW - ModalProvider - a new provider to wrap your application to control global animations, full examples and information is available in the [documentation](https://shannonhochkins.github.io/ha-component-kit) link. Here you can also provide custom animations for the modals, disable complex animations, animate the modal, header and content of the modal independently with framer-motion.
- BUGFIX - Modal animations were broken in the previous version, this has been fixed and now the animations are working as expected. Additionally, the documentation mentioned the default duration of animations was 0.25s however I noticed the default was actually set to 1s making animations and interactions feel sluggish and slow.
- BUGFIX - Modal animations previously had a glitch where it was expanding and zooming in whilst closing, this has been fixed
- BUGFIX - Modal animations with round edges previously weren't animating correctly and i noticed that this is because framer-motion cannot transition border radius with rem values so this has been fixed to transition to pixels instead.
- NEW - `useModalOptions` hook to retrieve the modal store values, not really necessary for general use so wasn't documented in storybook, however this is available from the components package.
- NEW - Modal now has the ability to hide the logbook option
- NEW - SidebarCard, Group - These now have the ability to disable the collapsible functionality, Thanks to @kdkavanagh for this contribution!
- NEW - WeatherCard - now has the ability to add rows to the forecast, ability to hide the forecast, day and title and the forecast toggle. Thanks to @kdkavanagh for this contribution!
- BREAKING - potential breaking change if users have custom styles on the ButtonBar component as the base class was changed from `button-group` to `button-bar` to align with the rest of the components.

## @hakit/core
- NEW useTranslations hook - this hook will return translations from your home assistant instance, this may be useful if you intend to display content in your own language, to add more categories to fetch, update HassConnect to include the required categories. NOTE - this currently isn't wired into the entire application, there's currently no way to fetch the common language from home assistant via websockets and I've opened an [issue](https://github.com/home-assistant/frontend/issues/20769) with home assistant to fix this issue.
- NEW - HassConnect - option to add additional translation categories to fetch from home assistant, all available options/categories are typed in typescript so it's easy to see what's available. This will be available when using the `useTranslations` hook within your application.
- NEW - localize - a new helper method to retrieve a value from the fetched translations, this can be used anywhere in your application and doesn't need to abide by react hook rules, you can fetch and also search/replace values with this helper method.


## Storybook
- Fixed bug that wasn't showing the interaction/actions panel on stories
- Rearranged sidebar so COMPONENTS is before HOOKS

## General
- Fixed multiple typescript issues


# 3.1.5
## @hakit/components
- Previously all react props passed to the component were rendering as props on output elements, this wasn't visible with vite as it strips these out compile time, webpack however does not and some other bundlers don't either, now the cards will only render valid html props passed to components.
- few issues with nextjs where window was used in the incorrect context, this has been fixed
- Removed lazy import for the PersonControls popup as this is ignored as the popup uses static exports that are not dynamically exported
- ThemeProvider - now accepts children which will allow you to pass props to the emotion CacheProvider if need be, this means you can perform tasks like telling hakit to change the container where styles are created by default if you're serving your dashboard within an iframe.
- Now supports tree shaking - the library setup with the bundler is much more sophisticated now and will now bundle only the components you use in your application, this should reduce the size of the bundle significantly and should allow bundlers to perform caching mechanisms on the components.

## @hakit/core
- HassConnect - complete refactor to the authentication service, adding error logs and better error handling, simplified the token storage to remove the local cache which doesn't make sense why i included it to begin with! Should hopefully resolve issues raised: [issue 123](https://github.com/shannonhochkins/ha-component-kit/issues/123)
- HassConnect now wrapped with memo from react - issues raised after testing with applications that render when HassConnect is NOT the root component, now should only re-render when props passed to HassConnect change.
- Fixed some typescript problems with components returning JSX.Element instead of React.ReactNode
- After the refactor of HassConnect the page no longer flickers with a secondary reload after authentication.
- HassConnect will now allow you to change the hassUrl and ask you to re-login after it's changed, tokens are now stored by the hassUrl, previously if you changed your URL it would just fail to render and not ask you to login. Now when urls are different it'll ask you to login again.
- Now supports tree shaking - the library setup with the bundler is much more sophisticated now and will now bundle only the components you use in your application, this should reduce the size of the bundle significantly and should allow bundlers to perform caching mechanisms on the components.

## create-hakit v1.1.3
- Fixed issue where node > 18 was causing the type sync and deploy script to fail: [issue 120](https://github.com/shannonhochkins/ha-component-kit/issues/120)
- Added .nvmrc with the generated template to help indicate desired node version
- Added default haUrl value
- Better feedback / instructions in the terminal

## Storybook
- Fixed bug on FamilyCard where image wasn't rendering
- Added "person" entity to storybook to test new popup
- Added new demo for FamilyCard to show custom columns
- Documented "EntitiesCardRow" in storybook
- Upgraded storybook from 7 -> 8
- Added new logo to storybook

## General
- New logo! Linked to the repo and storybook
- Updated and tested most of the packages used within the repo that aren't peer dependencies
- Created new Discord server! [Join here](https://discord.gg/agQr9JKk)
- Updated the readme to include the new logo as well as links to the new discord server


# 3.1.4
## @hakit/components
- NEW - FamilyCard - a card that allows multiple person entities to render in a single card, this will also allow the user to long press and show the location of the person. Huge thanks to @jensea for introducing this feature!
- The same "location / map" functionality is also available when long pressing a row in the EntitiesCard if the entity entered is a "person" entity.
- BUGFIX - types for GarbageCollectionCard subtypes were previously not exported, now exported under GarbageCollectionCardTypes
- BUGFIX - automatic titles in modal have been fixed to convert to title case as well as allowing an override in the "modalProps" attribute for all cards.

## @hakit/core
- updating provider to allow global style overrides for new cards (FamilyCard, PersonCard)

# 3.1.4
## @hakit/components
- NEW - FamilyCard - a card that allows multiple person entities to render in a single card, this will also allow the user to long press and show the location of the person. Huge thanks to @jensea for introducing this feature!
- The same "location / map" functionality is also available when long pressing a row in the EntitiesCard if the entity entered is a "person" entity.
- BUGFIX - types for GarbageCollectionCard subtypes were previously not exported, now exported under GarbageCollectionCardTypes
- BUGFIX - automatic titles in modal have been fixed to convert to title case as well as allowing an override in the "modalProps" attribute for all cards.

## @hakit/core
- updating provider to allow global style overrides for new cards (FamilyCard, PersonCard)

# 3.1.3
## @hakit/components
- No changes here - aligning semantic versions

## @hakit/core
- BUGFIX - entities that have a custom icon defined in HA will now show and take priority over icons derived from the state of the entity
- BUGFIX - previously, once the icon was set for an entity, it would never update, this has been fixed and will now update when the entity state changes thanks to @Brewno88 for reporting this one

# 3.1.2
## @hakit/components
- Licence.md file updated
- ClimateCard - small changes to classes
- SidebarCard - sortSidebarMenuItems - now accepts a function to sort the menu items before they render
- Automatic typed introduced ValveEntity

## @hakit/core
- updating base ha types
- some properties of auto generated types are now strictly typed and will no longer generate from the schema which has these properties defined as the incorrect type (xy_color, media_content_id, white, kelvin, color_temp) - there will most likely be more of these corrections in the future

# 3.1.1
## @hakit/components
- NEW - ClimateCard - completely rebuilt to match home assistant controls, as the original climate control was far too primitive, it supports everything the current climate card supports in home assistant. (Goodbye react-thermostat, sorry old shannon but it's just not good enough)
- NEW - ThemeProvider now accepts global styles for most cards, this is useful if you want to update the style globally for every instance of the same component, ie, change all modal backgrounds to red for example.
- NEW - Menu - a simple shared component that allows you to wrap any component and turn it into a clickable item that launches a menu
- NEW - ControlSliderCircular - a new shared component similar to the home assistant slider used for climate / humidity entities
- NEW - Modal animation changes - contents of the modal are now rendered after the modal animation has complete, which will then trigger the modal to animate
the children into the view.

## @hakit/core
- BUGFIX - useAreas - was previously returning a deviceEntities property - this has now been removed as it was showing literally every available device on the instance.
- UPGRADE - home assistant web socket - upgraded to match new types 

# 3.1.0
Upgrading all packages, leaving CJS stack trace in place so we can monitor updates of packages that haven't been upgraded to ESM only yet, type fixes
## @hakit/components
- No code changes aside from base package upgrades

## @hakit/core
- BUGFIX - BIG Thanks to @koriwi - the useArea hook will now match related devices/entities where entities are indirectly related to an area (device is in the area but a sub entity is not)
- BUGFIX - HassConnect was previously returning React.ReactNode as the return type, but i've removed this and left it to type inference as there's a bug with typescript < 5.1 where it doesn't properly work with React.
- BUGFIX - Test framework working again for @core only, still need to work on client side.


# 1.1.2
## create-hakit
- BUGFIX - deploy script wasn't working correctly, this has been fixed

# 1.1.1
## create-hakit
- Adjustments to deploy script
- Adjustments to base template

# 3.0.5
## @hakit/components
- BUGFIX - Fixing bug for MediaPlayerCard where groups aren't available it was not rendering the cards

## @hakit/core
- CHANGE - useAreas now has a new returned value called `deviceEntities` which are related children for a matched device. You can merge entities and deviceEntities if you want to display them all.


# 3.0.4
## @hakit/components
- NEW - Thanks to @yann510 for introducing new functionality for media players to show additional controls for speaker groups on the card - there's now a popup that will launch allowing you to join/unjoin speakers from a group and control individual volume of speakers. Storybook demonstrates this feature popup however the functionality will not work in the demo.
- NEW - AreaCard - previously the full screen popup was rendered alongside the card it self, this is now using portals and will ensure it's always rendered full screen as the popup is now rendered alongside the body, you can now optionally disable the card if need be as well.
- BUFIX - modalProps on cards - now accepts the correct types, now you can trigger or disable the modal by passing through the props.

## @hakit/core
- NEW - useAreas - some of this code was copied directly from home assistant, however i noticed it wasn't retrieving all entities that I had included in the area, there's a bug in their source code which i've fixed and now this hook will return all entities that are included in an area.
- BUGFIX - useLowDevices - found another bug with the blacklist logic but it seems to be resolved now
- BUGFIX - callService - when calling any service, if sending multiple targets and one of them was a duplicate it was previously failing, will now correctly process the request.


# 3.0.3
## @hakit/components
- NEW - Icons! Massive changes here, the icons are now much more dynamic, previously it only showed a default domain, or an icon that was picked for the entity inside home assistant, Now, a picked icon in home assistant will take priority,  `state` & `attribute` values will determine what icon to show depending on the state of the entity, and if none of these are available, it will fall back to the domain icon.
- BUGFIX - the previous release caused hover effects to disappear on most cards - this has been fixed


## @hakit/core
- BREAKING - Removed deprecated `api` property under an entity, these are now available under `service` proxy object.
- BUGFIX - useLowDevices - blacklist wasn't working correctly, can now provide partial entity names as part of the blacklist to exclude certain devices.
- BUGFIX - history object can now contain values from entities that do not include numerical state (things like weather history where the state value is a string)
- NEW - useEntity - if an icon is picked for an entity in home assistant, this value will be provided under `attributes.icon`, if it's not picked it will determine a   smart icon to use based on the domain, attributes and state values.

# 3.0.2
## @hakit/components
- BREAKING - WeatherCard - details prop has been converted to accept a WeatherCardDetail component rather than an array of objects, this allows better typescript intellisense for services if you want to add your own custom details / actions.
- NEW - WeatherCard now subscribes to websocket updates with the weather rather than the attribute updates as this has been marked as deprecated in future versions.
- BUGFIX - Animations in the last version were a little broken due to the scale of changes, i simply missed this, i believe these should be fixed now
- NEW - long press on weather card will open the popup with a larger version of the card showing additional information
- NEW - Popup when long pressing a card now has a springy animation

## @hakit/core
- BREAKING - useHash - hook as been removed, and now moved to the store, both the hash and setHash value are available from useHass()
  ```
    const { useStore } = useHass();
    const setHash = useStore(store => store.setHash);
    const hash = useStore(store => store.hash);
  ```
- NEW - useWeather - a hook to return the weather entity which is subscribed to weather updates, this will add an additional property called "forecast" to the entity.
- BUGFIX - Previously, certain scenarios would allow multiple web socket connections instead of re-using the same connection, this has been fixed and should improve performance.
- BUGFIX - routes weren't being activated properly which prompted the removal of the useHash hook, now the activation of the hash as well as the routes are in sync and working as expected.

# 3.0.0
## Storybook
- BUGFIX - bug was preventing some props from being displayed in the props table, this has been fixed
- NEW - Demo has been updated to include some demos of the new responsive layout options
- NEW - page outlining how to use the responsive props

## @hakit/components
### Breaking Changes
- mq - If you were using the `mq` function from @hakit/components, this has now changed to accept the breakpoint name rather than device name. Previously, you would use `mq('mobile')` to determine if the device was mobile, this has now changed to `mq('sm')` to determine if the device is small. This is to align with the new breakpoints that have been introduced.
- useDevice has been renamed to useBreakpoint, and similarly to `mq`` changes, it will now return breakpoint key/value pairs if the breakpoint is active.
- CameraCard - headerSensors will now only accept ButtonBarButton components rather than an array of props, this was changed as the intellisense wasn't available when using objects as there's no way to extract the generic type of the entity to provide proper intellisense, this also provides more control over what you want to render.
- EntitiesCard - entities prop has been removed, and will now accept `EntitiesCardRow` as children for the card, this is to align with the other cards and provide more control over what you want to render:
  ```
    <EntitiesCard>
      <EntitiesCardRow entity="light.some_light" />
    </EntitiesCard>
  ```
### New Changes
- NEW - CameraCard will now show the Live stream (if available) in the popup for the card
- NEW - Responsive Props - previously, cards had predefined width values, this has been changed to a 12 column grid system, each card still has a predefined column assigned at different breakpoints however these are all configurable per card.
- NEW - ThemeProvider - breakpoints are configurable from the theme provider, this is used by the responsive props to determine the column width at different breakpoints.
- NEW - Massive overhaul to base styles of cards & functionality, ALL cards now share the same base styles and functionality, meaning popups, click events, ripples, scale effects etc are all available on every single card where necessary.
- NEW - ButtonBar - a new shared component to display entity buttons in a bar, this is currently used by the CameraCard and the ClimateCard
- NEW - ButtonGroup - a new shared component to display entity buttons in a bar, this is currently used by the Switch popup modal
- NEW - ClimateCard - now has the ability to control temperature from the base card, as well as some styling changes, it will also display additional information about the current temperature in the description of the card.
- NEW - cards using a switch entity, will now show a new controller UI element in the Popup
- NEW - Cards using a cover entity will now have control over the cover position, tilt and more from the popup of the card.
- NEW - Popups now render the attributes in the popup (similar to home assistant), useful for debugging or if you want to visualize the exact properties of the entity.
- NEW - Logs - Logs are now rendered in the popup for cards that use entities, this will show recent events related to the entity.
- NEW - ControlToggle - a new UI component to display a toggle switch, this is used by the Switch popup modal.
- NEW - Overhaul to the ModalByEntityDomain component to make it simpler to integrate further UI controls by domain. All Layouts for every popup by domain are now also available as a shared component.
- NEW - EntityAttributes - a new component to render entity attributes in a Group component.
- NEW - LogBookRenderer - a component to render the logs of an entity in a list.

### Bugfixes
- BUGFIX - Long Pressing a card was previously activating on mobile as you would swipe on an element to scroll for too long, this has been fixed and scroll movement is will not trigger the popup.
- BUGFIX - Massive changes to styles across the board, which has fixed multiple styling bugs.
- BUGFIX - Memory performance fixes with the ThemeProvider, previously the ThemeProvider was re-rendering on every state change, this has been fixed and should improve performance.


## @hakit/core
- BREAKING - `HassEntityWithApi` typescript helper has been renamed to `HassEntityWithService`
- NEW - breakpoints values are now available from the store
- NEW - useLogs - hook to return the logs for an entity

## Storybook
- BUGFIX - Many properties weren't displayed in the component props tables, this has been fixed and now you should have much better visibility on what's available.

## create-hakit - v1.1.0
- added a lot more redundancy checks to the deploy script
- updated documentation
- fixed multiple bugs
- thanks to @yann510 for making some improvements to create script
- prettier introduced
- updated dependencies
- deploy script was previously broken and not even linked, this has been fixed
- vite.config.ts updates with correct base path to build & deploy to home assistant.

# 2.3.0
## @hakit/components
- NEW - CameraCard - a component to render / preview a camera entity in home assistant, it supports live, motion and rolling poster views, this is a very complicated component and I'd love feedback if you have issues or even if it works for you!
- NEW - AreaCard & PictureCard now preload the image with a loader, the preloaderProps are also configurable from these cards
- BUGFIX - AreaCard wasn't stretching when inside a Row or Column in stretch mode, this has been fixed
- NEW - FabCard - now changes border radius automatically when providing children to use as a normal button, this may trigger the component to be renamed to something more suitable later on
- BUGFIX - SensorCard - wasn't allowing manual historyOptions to update
- BREAKING - SidebarCard & TimeCard - includeIcon and includeDate have been renamed to hideIcon and hideDate to align with other component prop names - if you're using these properties you'll have to invert your logic
- NEW - TimeCard - you can now hide individual elements on the card making it completely custom
- NEW - GroupCard - you can now add an optional description to the group which will appear under the title
- BUGFIX - ButtonGroup - wasn't stretching when inside a row/column with stretch
- NEW - Row/Column now also adds the classes of the flex layout properties to the element for styling purposes
- NEW - PreloadImage - a shared component allowing you to preload any image, this is used by AreaCard and PictureCard

## @hakit/core
- BREAKING - useEntity - previously was subsribing to history updates for every entity, this has been disabled for performance reasons, this now needs to be opted into subscription:
  ```
  const lightStrip = useEntity('light.office_striplight', {
    returnNullIfNotFound: true,
    history: {
      disable: false,
      hoursToShow: 96 // defaults to 24
    }
  });
  ```
- NEW - useCamera - a hook to return all the complex logic of fetching / retrieving poster, stream and mjpeg urls in a very simple hook.
- NEW - joinHassUrl - a function exposed from useHass() that allows you to provide a pathname to an asset on your home assistant instance, and join it with your home assistant url. If your entity has a local path to an image, you can use this to request it from your instance.
- BUGFIX - There's a bug with the route addition causing the page to completely freeze recursively due to the nature of hash updates and react updates not syncing correctly, this has been fixed
- BUGFIX - callApi second argument options is now optional and will perform a GET request by default
- BUGFIX - useAreas now returns a fully qualified picture url to your home assistant instance, this was previously returning a local path
- NEW - there's a few other functions exposed from core to help with camera entites:
  - fetchCameraPrefs
  - isCameraMediaSource
  - getEntityIdFromCameraMediaSource
  - computeMJPEGStreamUrl
  - fetchThumbnailUrlWithCache
  - fetchStreamUrl

# 2.2.0
## @hakit/components
- BREAKING - renamed RoomCard to AreaCard to align with naming convention of home assistant seeing as they use "areas" rather than "rooms". RoomCard is still available but marked as deprecated, this will be removed in future releases.
- BUGFIX - styles with calendar card have been fixed for a few issues
- BUGFIX - CalendarCard was previously requesting events multiple times initially on load.
- NEW - added loading indicator to CalendarCard
- BUGFIX - styles for GroupCard were too generic and inheriting on child components, this has been fixed.
- BUGFIX - SensorCard will now only show the pointer cursor if the onClick prop is provided.
- NEW - SensorCard now has the ability to hide the graph similar to home assistant.
## @hakit/core
- BREAKING - useApi renamed to useService - the previous name is misleading as it isn't the rest api but rather a proxy for websocket services, this is now renamed to useService to align with the home assistant api. useApi is still available but will be removed in future versions as this will in the future be the actual rest api helper hook.
- BREAKING - useEntity still returns the .api property to toggle actions and marked as deprecated, however this has been renamed to .service to align with it's core functionality which is triggering services.
- NEW - Added useAreas hook to retrieve all areas from home assistant including related devices, entities and services, all information in home assistant is available from the picture, name down to the devices and entities, this hook uses three subscription models to achieve this which are also available from core:
  - NEW - subscribeAreaRegistry - a subscription model to return all areas from home assistant
  - NEW - subscribeEntityRegistry - a subscription model to return all entities from home assistant
  - NEW - subscribeDeviceRegistry - a subscription model to return all devices from home assistant
- BUGFIX - useHistory hook which is used by every component behind the scenes, was previously subscribing far too many times, this has been fixed and should improve performance and less invalid socket connections.

# 2.1.2
## @hakit/components
- NEW - CalendarCard - A new component that replicates the same functionality as home assistants calendar
- NEW - ButtonGroup - A shared component to group buttons together, this is used by the CalendarCard for the views
- BUGFIX - ButtonCard / FabCard on click will now return the event in the onClick callback
- BUGFIX - ButtonCard / FabCard - "active" color now changed to accent color so it's clear what's active
- NEW - FabCard - can now specify the borderRadius as a prop which also updates the ripple

## @hakit/core
- NEW - callApi - a new function returned from useHass() to trigger an api request! This requires some setup in the configuration.yaml file which is documented in the docs.
- Updated home-assistant-js-websocket to latest version
- BUGFIX - The auth flow with home assistant the first time triggers a bad request with the auth token, however a simple refresh fixes this so i've included this into the workflow to ensure the first time you authenticate, it will refresh the page to ensure the auth token is valid.

## @hakit/create
- fixed a few small bugs where missing dependencies weren't included by default

# 2.1.1
## @hakit/components
- Small style fixes for the new button card layouts
- updating some documentation
## @hakit/core
- Updating types after latest home assistant release
# 2.1.0

## @hakit/components
- NEW - ButtonCard - slim and slim-vertical layout options added (preview available on the storybook home page) - These mimic the styles of the Mushroom cards from home assistant, additionally in preparation for the HA addon, there's now more customizable props to hide / show certain information on the card.
- NEW - ThemeProvider - globalStyles - a new prop available to pass a string literal of css to be applied globally to the document, this is useful for adding fonts or other global styles.
- NEW - cssStyles - a prop available on every single component to provide custom isolated styles for individual components, this supports styled css, meaning you can write selectors similar to scss, ie:
```
  cssStyles={`
    .my-custom-class {
      background-color: var(--ha-S50);
      .something-else {
        color: var(--ha-S50-contrast);
      }
    }
  `}
```
  This feature was added for part of a feature that will be added to the home assistant addon so users can write css in the UI.
- NEW - classNames - have been added to nearly every element as an identifier in preparation for the css overrides prop above, this will allow you to target specific elements and override the styles.
- HOTFIX - Modal - previously, if you included two ButtonCards with the same entity, the modals would clash and the animations were failing to render correctly, this can now be fixed by providing and id attribute as well as the entity.
- HOTFIX - There was many components who's types didn't have the correct extended props not allowing you to add standard HTML properties which has been fixed.

## @hakit/core
- NEW - serviceWhitelist and serviceBlacklist added to syncTypes script, this allows you to filter out services that you don't want to sync to your local types.
- HOTFIX - CLI script had a few missing params for options which have been addressed.
- HOTFIX - Types for Row/Column were previously littered with every available prop from react/emotion which has been addressed.



# 2.0.3
## @hakit/components
- Small improvements to Tooltip and Modal to provide better classnames for elements for re-styling
## @hakit/core - no changes

## @hakit/core
- NEW - serviceWhitelist and serviceBlacklist added to syncTypes script, this allows you to filter out services that you don't want to sync to your local types.
- HOTFIX - CLI script had a few missing params for options which have been addressed.
- HOTFIX - Types for Row/Column were previously littered with every available prop from react/emotion which has been addressed.

# 2.0.1
## @hakit/components
- BUGFIX - sensor card demo wasn't displaying the mock data correctly to indicate how it behaves, now generates random data for this particular demo
- BUGFIX - sensor card previously was showing the scale animation and ripple effect when clicking on the card, this has been removed unless the onClick function is provided.
- NEW - WeatherCard - now has the ability to provide additional sensors/details via the new details prop
- NEW - WeatherCard - previously if the forecast was set to daily, it was trying to cram 24 hours worth of data into the card, this has been limited to 10 items for desktop and 7 for mobile (for hourly & daily)
- NEW - WeatherCard - the time can be included in the forecast under the day value by default now, this can be removed by providing the includeTime as false
- NEW - WeatherCard - now has the "feels like" or "apparent temperature" value displayed in the card if available, there's calculations to determine this if it's not available using wind / chill index. By default, this attempts to read the "apparent_temperature" attribute on the weather entity, if this property is different for you then you can provide the "apparentTemperatureAttribute" prop to override this.
- BUGFIX - RoomCard / Modal previously had some padding issues for mobile, I've removed the inner padding on modals and popups and allowing the user to decide if padding should be included in the template within.
## @hakit/core - no changes

# 2.0.0

## @hakit/components
- NEW - Sensor card - Very similar to the home assistant SensorCard, this card will display the current state of the sensor, additionally you can add a graph to display the history of the sensor, this is a very powerful card and can be used for many different sensors.
- CHANGE - Another change to responsive layouts, previously under the theme object, you could control the width of cards, this has been removed in favor of responsive design, the cards have been specifically designed to fill the available space and will automatically layout in columns / rows with a default nice fluid width
- BUGFIX - fixed bug with RangeSlider which was causing flickering with media player card.
## @hakit/core
- BREAKING CHANGES - Complete refactor of the main core providers, after introducing history i noticed that every component was being re-rendered even when the entity used on a card/component wasn't changing, it was also causing child components to unmount and remount unexpectedly on every state change.
  1. HassConnect previously allowed a throttle value, this has been removed and moved to be controlled from the useEntity hook instead which has a default throttle of 150ms, this means that individual components can subscribe to updates either faster or slower than others.
  2. The store pattern is now using zustand to subscribe to updates which makes updates much more performant as we're only updating the state to values that we're subscribed to, this follows through to all hooks which means significant performance improvements.
  3. previously, the Provider had multiple useEffects causing multiple updates to the store values, this has been optimised dramatically.
  4. useHass - this was previously allowing access to internal store values, this has been refactored so only documented methods are available from useHass to avoid any mistaken use of the hook / store values, getEntity has also been removed from useHass in favor of the new hook useSubscribeEntity which will only update the component when the entity changes.
  5. NEW - useSubscribeEntity - a replacement for the getEntity function that was previously provided in useHass, logically it's also changed as you can only retrieve one entity with this hook so that it can subscribe to updates for an individual entity. If you need to retrieve multiple entities, you can retrieve the entities from the store, 
  ```
      const { getAllEntities } = useHass();
      // extract what you need from entities
      const entities = getAllEntities();
      // this is not the most optimal way to retrieve multiple entities as it will cause a rerender
      // on the component every time any entity changes
      
  ```
  6. NEW - useHistory - a hook to retrieve history for an entity, in it's raw form, it may be difficult to understand, so i've converted values to coordinates if you want to plot your own data.
  7. Fixed countless memory leaks
  8. useRoute has been renamed to getRoute from useHass.
  9. SceneCard has been removed and renamed to TriggerCard
  10. useEntity will now by default return history for the entity, you can control the options for this in the options object as the second argument.

# 1.1.1
## @hakit/components
 - Massive changes to responsive layout, all cards / components now have changes to styles based on screen size.
 - Fixed a few layout bugs
 - introduced mq and useDevice - mq is a helper for media queries, and useDevice returns an object with the current device size and a boolean if the device is active.

## @hakit/core
 - no changes

# @hakit/components
## 1.1.0
- NEW - Massive changes to the core styles for components, ThemeProvider now accepts hue, saturation, lightness, tint, contrastThreshold and darkMode as props, light/dark mode fully supported, interactive color sliders to visualize the theme changes on the overview page and on every single storybook component page. The default colors have also been changed which is why this has been released as a new minor release. If you prefer the grayscale look of previous versions, set the "tint" prop to 0 for ThemeProvider
- CHANGE - ClimateCard - now has tooltips for hvac actions, and more information displayed under the title at a glance.
- NEW - scroll-bars have been re-themed and supported in more browsers
- NEW - RangeSlider - a simple slider to get/set values between a min/max range
- NEW - Title - a new component to display titles which has been connected to some components by default to help display more information about the entities.
- BUGFIX - multiple styling bug fixes, every component has been touched at some point during this refactor to ensure the styles are consistent and work as expected for the new Theme controls.
- BUGFIX - animations with sidebar were really jumpy before, this has been fixed.
- BUGFIX - RoomCard popup never had overflow set when the content was larger than the screen, this has been fixed, additionally by default content is now aligned to the top not the center.
- BREAKING - the entire theme module has been rebuilt, if you were using any of the default css variables like --ha-text or --ha-primary-x or --ha-secondary-x etc, these have been deprecated.

# @hakit/core
## 1.1.0
- NEW - color theme variables connected to the getCssColor value, if you're not using @hakit/components you'll need to provide these yourself.

# @hakit/core
## 1.0.26
### Patch Changes
- BUGFIX - useLowDevices hook was performing too many state updates
# @hakit/components
## 1.0.31
- BUGFIX - ButtonCard & FabCard click events we're triggering on mobile devices due to the useLongPress hook, this has been fixed.

# @hakit/components
## 1.0.30
- NEW - GarbageCollectionCard - a new card to display the upcoming garbage bin collection times, useful for those like myself who always forget...
- CHANGE - TimeCard no longer retrieves the timeZone from the hass config, there was no need for this as the
  sensor.date value is just 2023-07-19 with no timezone offsets, and also already calculated by timezone of the configuration.
# @hakit/components
## 1.0.29
- BUGFIX - media player card was not sending correct entities for join action
# @hakit/core
## 1.0.24
- bumped version


# @hakit/components
## 1.0.28
- BUGFIX - styles with media card
- BUGFIX - seek now implemented in mock api
- BUGFIX - few cards when wrapped in a Row with stretch enabled, weren't filling available space
- BUGFIX - entities card was missing key in map
- BUGFIX - setting preventPropagation to false on ripples as default

# Storybook
- added new demo landing page dashboard
- fixed multiple styles
- adding demo gif

# @hakit/core
## 1.0.23
- NEW - MediaPlayer now has custom types available
- NEW - supported-services.ts now updates on every release to ensure the latest services/domains are available for users that don't use the type-sync functionality.
- NEW - @hakit/core/sync now updated to handle blacklist/whitelist for domains
- NEW - default support for lawnMower, waterHeater, calendar and ring doorbells for users developing without the typescript
- BUGFIX - fixed bug with useEntity where some types were't populating correctly
- BUGFIX - fixed bug with service data where the entity only allowed a string, now allows all target types
- NEW - exports supportsFeatureFromAttributes which uses the same functionality to calculate supported features using the bitwise operator as home assistant does.


# @hakit/components
## 1.0.27
- NEW - MediaPlayerCard - an awesome new addition! This card is similar to the mini-media-player available in HACS, it provides most of the core functionality you'd expect from a media player.
- BUGFIX - ClimateCard - previously clicking on the Fab buttons within the card, the whole card would scale, this has been fixed
- BUGFIX - fixed some styles with the FabCard where propagation was causing weird distortion effects


# @hakit/components
## 1.0.25

### Patch Changes

- fixed onclick bug for FabCard and ButtonCard
# @hakit/components
## 1.0.24
- TriggerCard - wide range of new props to make this card more configurable, previously this card was updated automatically based on the last updated or last triggered value, now it will deactivate after a period of time, there's also description, icon changes, text changes props and more, see storybook for more details.

# @hakit/core
## 1.0.21
- entity.custom now has a timeDiff property available in milliseconds representing the time difference between now and the last updated time of the entity.
# @hakit/core
## 1.0.20

### Patch Changes
- Fixing bug with api types on snake domains, previously useEntity('media_player').api was not returning available services
# @hakit/components
## 1.0.23
- bumping dependency version
# @hakit/core
## 1.0.19
# @ hakit/components
## 1.0.22

### Patch Changes

- cbf9c5c: @hakit/core

  - fixed types for vacuum entities, matched with home assistant repository
  - Adding error handling for when time/date sensors are unavailable (pointed out by @dhruvpandeysm), additionally the useEntity hook will no longer throw this error when the time sensor is unavailable
  - added FilterByDomain type helper to filter EntityName by a specific domain

  @hakit/components

  - BREAKING - This is a breaking change for all those using the SceneCard which has been renamed to TriggerCard to support other entities like automations, scripts etc. that you may want to trigger once, it will no longer automatically call 'turnOn', this is now expected to be handled via the onClick handler which returns the entity with the api attached, eg `onClick={(entity) => entity.api.turnOn()}` the SceneCard is still available and marked as Deprecated in the docs, it will be removed in the next few releases.
  - NEW - components will now show buttons in a disabled mode when the entity is unavailable or unknown
  - NEW - ErrorBoundaries - every component is now wrapped in a higher order component that will catch errors, previously when one component failed, the whole page will fail to render, now individual cards/components that render with an error will display the error on screen for you to debug the issue.
  - NEW - TimeCard will now display a necessary configuration change to support this card when the sensor.time or sensor.date is unavailable
  - NEW - most components will no render in a disabled state by default when the entity is unavailable from home assistant
  - NEW - most components that support an entity now have an disabled prop available to re-style the component in a disabled state
  - NEW - withErrorBoundary HOC - you can now wrap any component with the withErrorBoundary HOC to catch errors, this is useful if you're creating your own custom components and want to catch errors, this is exported from @hakit/components
  - NEW - EntitiesCard - similar to the Entities Card in home assistant, you have full control over each row that's displayed
  - NEW - Alert - a shared component to display warnings or alerts, currently used by the ErrorBoundaries that have been introduced
  - NEW - components that use single domain entities (eg ClimateCard or ColorPicker etc) will now have correct intellisense on available entities if the types are synced.
  - BUGFIX - RoomCard wasn't activating in certain scenarios, this has been fixed


# v.1.0.18
#### @hakit/core
- added new types for vacuum entities

# v.1.0.21
#### @hakit/components
- fixed some types for weather

# v.1.0.20
#### @hakit/components
- documentation updated
- few small bug fixes

# v.1.0.17
#### @hakit/core
- documentation updated
- few small bug fixes

# v.1.0.04
#### create-hakit
- Released `npm create hakit@latest` to scaffold a new project with vite, react, typescript and hakit

# v.1.0.19
#### @hakit/components
- Fixed bug with nested buttons for the ClimateCard
- NEW - GroupCard now has collapsible props allowing you to collapse or expand sections of cards easily, there has also been some style changes here.
- Fixed bug with sidebar card, header should align with expanded RoomCards now
- ClimateCard and Scene Card now match the same height as ButtonCards with the use of aspect-ratio

# v.1.0.16
#### @hakit/core
- Fixed bug with HassConnect as it was attempting to double tap the authentication request
- NEW - HassConnect - children will now fade in once authenticated
- BREAKING CHANGE - HassConnect - default loader added, "fallback" prop now renamed to "loader", suggested to set the background of your app to the same color as the primary background color from the ThemeProvider (#1a1a1a)

# v.1.0.18
#### @hakit/components
- Fixed bug with storybook previewer not rendering emotion components
- linking new types for entities as mentioned below

# v.1.0.15
#### @hakit/core
- NEW - there's now a lot more types available for domains, i've written a script that syncs these types from the home assistant repository and it's now made the following domains available and typed the same way that home assistant is using them:
 - AlarmControlPanelEntity
 - AutomationEntity
 - CameraEntity
 - ClimateEntity
 - CoverEntity
 - FanEntity
 - GroupEntity
 - HumidifierEntity
 - ImageEntity
 - InputSelectEntity
 - LawnMowerEntity
 - LightEntity
 - LockEntity
 - MediaPlayerEntity
 - RemoteEntity
 - SceneEntity
 - ScriptEntity
 - SelectEntity
 - TextEntity
 - TimerEntity
 - UpdateEntity
 - VacuumEntity
 - WaterHeaterEntity
 - WeatherEntity
- Documentation added on how to extend the domain types for an entity if you want to add your own custom types for a domain that isn't listed above, you can find this information at the bottom of the "TypescriptSync" page.
- Fixed bug where i intended to output the vite package under commonjs but accidentally generated in umd.
- improved output code for the cli script and node script to generate user types.


# v.1.0.15
#### @hakit/components
- Rebuilt types, no longer bundled into one giant file and now split into multiple files for each component, this should make it easier to use the types in your own projects when investigating available types.
- sourcemaps now included in package
- improved developer experience

# v.1.0.13
#### @hakit/core
- Rebuilt bundlers and output, types are now categorized to make it easier to use in your own projects.
- updated documentation
- typeSync script updated with more options
- sourcemaps now included in package
- improved developer experience

# v.1.0.14
#### @hakit/components
- Handling missing window/location properties for nextjs where they're not available in server components.

# v.1.0.12
#### @hakit/core
- Handling missing window/location properties for nextjs where they're not available in server components.

# v.1.0.12
#### @hakit/components
- Types have been re-built to handle module augmentation for services/entities
# v.1.0.10
#### @hakit/core
- NEW - typescript sync script and cli command added to ensure all types are up to date with the latest home assistant types, this will be run before every release to ensure the types are up to date.
- NEW - With the new typescript sync feature, all components will have intellisense of the entities and services relative to your home assistant instance.
- Types have been re-built to handle module augmentation for services/entities

# v.1.0.9
#### @hakit/core
- Refactored HassConnect authentication as sometimes it was not rendering the children until a manual refresh was performed.
- NEW - HassConnect - options prop added to pass down options to the provider
   - throttle - determine the default throttle amount to use for all entity updates (default is 150ms)
   - allowNonSecure - allow non https urls to authenticate (default is false), localhost is accepted by default
   - preloadConfiguration - if the configuration object should fetch before children render (default is false)
- loadTokens, saveTokens logic is identical to the home assistant auth flow, this is to ensure the tokens are saved correctly and can be used in the future, these functions are exposed from core under loadTokens and saveTokens
- Adding more error handling to the authentication flow
- NEW - returning logout method from useHass hook, this will clear the tokens and force a re-authentication
- Previously, authentication was checking the current url last authenticated with, this may have been causing issues with the authentication flow, this has been removed and will authenticate correctly if there's tokens present in local storage.
# v1.0.11
#### @hakit/components
- adding new dark theme color scheme for scroll bars / other browser specific changes
- adding theme properties for scroll bars
- NEW - Added climate control modal for climate ButtonCard / FabCard / ClimateCard
- NEW - Added ClimateCard shared component to display climate entities
- NEW - ModalByEntityDomain shared component now accepts all props from the domain modal component
# v.1.0.8
#### @hakit/core
- Updated types for climate to be more specific for entities and services (HvacAction, HvacMode) types also exported from core and the state is now typed too

# v.1.0.10
#### @hakit/components
##### released - 03/08/2023
- NEW - ButtonCard/FabCard with a light as the entity now has the ability to "long press" on the ButtonCard/FabCard to bring up options similar to the light entity in home assistant, there is absolutely no setup, if you already have a light attached to a ButtonCard/FabCard it will launch the popup when you long press on the ButtonCard/FabCard. You can control brightness, color and temperature if the light supports it.
- NEW - ColorPicker - added individual component for a color picker which can be used by any light entity if supported.
- NEW - TemperaturePicker - added individual component for a temperature picker which can be used by any light entity if supported.
- NEW - ControlSlider - A more generic slider component to return a value between a minimum/maximum value, useful for curtains, blinds etc, this control slider can be used horizontally or vertically.
- NEW - Modal - an easy way to create a custom popup, please note this isn't perfect and will be improved over time, but it's a good start.
- All cards are now motion elements from framer-motion to add some nice animations
- Few bug fixes with styles/animations

# v.1.0.7
#### @hakit/core
##### released - 03/08/2023
- NEW - light services now have typed values of expected service data
- NEW - useLightBrightness, useLightColor, useLightTemperature hooks added, i haven't documented these and probably wont as they're used internally for the light options modal.
- NEW - many new helper functions exposed relating to colors:
  - temperature2rgb
  - rgbww2rgb
  - rgbw2rgb
  - hex2rgb
  - rgb2hex
  - rgb2lab
  - lab2rgb
  - lab2hex
  - rgb2hsv
  - hsv2rgb
  - rgb2hs
  - hs2rgb
  - lightSupportsColorMode
  - lightIsInColorMode
  - lightSupportsColor
  - lightSupportsBrightness
  - getLightCurrentModeRgbColor
  - LIGHT_COLOR_MODES
# v.1.0.9
#### @hakit/components
##### released - 03/08/2023
- no code updates, just adding readme to the package
# v.1.0.6
#### @hakit/core
##### released - 03/08/2023
- no code updates, just adding readme to the package
# v.1.0.8
#### @hakit/components
##### released - 03/08/2023
- SidebarCard - an automated easy way to interact with RoomCards and other custom functionality, it's recommended to ensure your page fills the height/width of the window to ensure the Sidebar fills correctly.
- added multiple tests for multiple components
- Few bugFixes to the RoomCard
- converting pixel values to rem in the theme object.


# v.1.0.5
#### @hakit/core
##### released - 03/08/2023
- useRoute, addRoute added to useHass() hook, useRoute may be the only function you'll need to use however addRoute will automatically add the a menu item to the sidebar.
- allowing "unknown" as an entity type when it's not provided which will return null on hooks that are expecting to return an entity.


#### @hakit/core
- added `useHash` hook to set/get the window hash, this is currently used to automate the state for the RoomCard
# v.1.0.4
##### released - 21/07/2023
#### @hakit/core
- added `useHash` hook to set/get the window hash, this is currently used to automate the state for the RoomCard

# v.1.0.7
##### released - 21/07/2023
#### @hakit/components
- Added FabCard - Exactly the same functionality as ButtonCard however this will display a simple icon button and change the colour when active
- Added RoomCard - This is an awesome new addition which will allow you to wrap a set of other components with a RoomCard, and when clicked it will show all those components in a nice popup, this is also hashed meaning if you refresh the page the "room" will become active again.
- Introducing framer-motion for the RoomCard to add some nice animations when opening
- Added PictureCard component to display a picture / title / icon, useful for cameras or other media, this card is also used for the RoomCard

# v.1.0.6
#### @hakit/components
- Added TimeCard component to display the current time and date easily, this is retrieved from the home assistant sensors provided for every home assistant instance.
- Updated docs to include default values
- Updated Group component to use the new Column/Row components
- Added Row/Column components to easily layout child components
- Added Ripple component to easily add a ripple effect to any custom component
- Added focus/active animation on ButtonCard and SceneCard
- renamed disableForecast and disableCurrent to includeCurrent and includeForecast for WeatherCard

# v.1.0.5
#### @hakit/components
##### released - 18/07/2023
- Adding WeatherCard component, this will retrieve information from the weather entity, it looks and behaves very similar to the standard WeatherCard in lovelace.


--- These were previous releases from the old package
# v.1.0.14
- Deprecating this package in favor of scoped packages to isolate certain "features" of this kit, now available under @hakit/core and @hakit/components
# v.1.0.13
##### released - 09/07/2023
- useApi hook redesigned, still works like it always has, however you can now just call useApi with no arguments `const api = useApi(); api('light').toggle('light.entity'), api('mediaPlayer').turnOn('mediaPlayer.entity')` etc
- useApi integrated into useEntity, so you can now call `const entity = useEntity('light.office_downlight'); console.info(entity.api.turnOn())`, this is the best way to utilize calls to home assistant as in almost every cause you'll want the entity as well as the api.
- domain name values can now be snake or camel case eg media_player.living_room_tv or mediaPlayer.living_room_tv
- services will remain as camelCase as we chain these methods together, eg `entity.api.turnOn()` and i think this is nicer
- refactored some of the type helpers
- Adding tests for some of the more complex hooks to ensure they continue to work
- callService now supports snake and camel case service names and domain names
- updating docs
- added a new layout prop to ButtonCard, removed "IconBackgroundColor" as this is controlled via css variables

# v.1.0.12
##### released - 08/07/2023
- cleaning up typing exports, upgraded package to correctly resolve pathnames from alias's
# v.1.0.11
##### released - 07/07/2023
- removing useTimeDifference hook, this is now handled by the useEntity hook and available on all entities under the "custom" object, eg `const entity = useEntity('some_entity'); console.info(entity.custom.relativeTime)`

# v.1.0.10
##### released - 07/07/2023
- ButtonCard no longer needs the "domain" prop, this is now inferred from the entity name, full type validation is still available, if you add entity="mediaPlayer.living_room_tv" the service prop will be validated with all the available services for the media_player domain.
- ButtonCard - now highlights the current colour of the light over the icon and behind the icon
- ButtonCard - has a small layout change to make it more compact
- useEntity - will now return a "custom" object on the HassEntity object containing additional information, for a light, you'll get a bunch of css variables related to the attributes of the colour value of the light, eg brightness, rgba, rgb, and hex values, additionally the "1 minute ago" time value is also available here.

# v.1.0.9
##### released - 06/07/2023
- Fixing bug with externals :|

# v.1.0.8
##### released - 05/07/2023
- Reducing output size by defining externals for vite export

# v1.0.7
##### released - 05/07/2023

- Introducing sensor.time as a method of producing time based updated to "last activated" time values, this makes cards refresh every minute with the last time they were activated.
- Starting to integrate a thermostat / Air conditioner controller
- FakeHassConnect added with multiple fake entities so the playground on storybook has interactive demos
- Fixing some severity issues with npm, some unsolvable without downgrading storybook.
-
# v.1.0.6
##### released - 04/07/2023

- Simple changes to the "http://localhost:8123" entities for storybook to render different times
- Adjusted the useTimeDifference hook to have all the same "now" values.

# v1.0.5
##### released - 04/07/2023
- Adding "SceneCard" component to trigger scenes
- Adding "useTimeDifference" hook to get the "time ago" value from the entities
- Integrated the useTimeDifference hook into the ButtonCard and SceneCard
- Added "useEntityIcon" hook to retrieve the icon used in home assistant if set, this is also linked to the SceneCard and ButtonCard
# v1.0.5
##### released - 04/07/2023
- Fixed bug with typing exports in package.json
- Fixed bug with icon not retrieving by domain
- Updated some documentation

# v1.0.4
##### released - 04/07/2023
- Introducing `ButtonCard` component, to connect this together all we need is the domain, service and entity name and it'll automatically call the correct service and display it's state, name and group in the button with active states. Additionally this button can be manually controlled by providing the available props, see the docs for more details.
- Introducing more hooks (`useIcon`, `useIconByDomain`)
- Introducing `ThemeProvider` to apply a theme to all components
- introducing `Group` component to group multiple cards together