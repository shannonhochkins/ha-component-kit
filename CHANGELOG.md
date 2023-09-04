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
- useApi integrated into useEntity, so you can now call `const entity = useEntity('light.office_downlight'); console.log(entity.api.turnOn())`, this is the best way to utilize calls to home assistant as in almost every cause you'll want the entity as well as the api.
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
- removing useTimeDifference hook, this is now handled by the useEntity hook and available on all entities under the "custom" object, eg `const entity = useEntity('some_entity'); console.log(entity.custom.relativeTime)`

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