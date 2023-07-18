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