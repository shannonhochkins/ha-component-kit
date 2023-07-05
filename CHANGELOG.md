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

- Simple changes to the "fake" entities for storybook to render different times
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