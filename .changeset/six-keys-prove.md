---
"create-hakit": patch
"@hakit/components": patch
"@hakit/core": patch
---

@hakit/core

- fixed types for vacuum entities, matched with home assistant repository
- Adding error handling for when time/date sensors are unavailable (pointed out by @dhruvpandeysm), additionally the useEntity hook will no longer throw this error when the time sensor is unavailable

@hakit/omponents

- BREAKING - This is a breaking change for all those using the SceneCard which has been renamed to TriggerCard to support other entities like automations, scripts etc. that you may want to trigger once, it will no longer automatically call 'turnOn', this is now expected to be handled via the onClick handler which returns the entity with the api attached, eg `onClick={(entity) => entity.api.turnOn()}`
- NEW - components will now show buttons in a disabled mode when the entity is unavailable or unknown
- NEW - ErrorBoundaries - every component is now wrapped in a higher order component that will catch errors, previously when one component failed, the whole page will fail to render, now individual cards/components that render with an error will display the error on screen for you to debug the issue.
- NEW - TimeCard will now display a necessary configuration change to support this card when the sensor.time or sensor.date is unavailable
- NEW - most components will no render in a disabled state by default when the entity is unavailable from home assistant
- NEW - most components that support an entity now have an disabled prop available to re-style the component in a disabled state
- NEW - withErrorBoundary HOC - you can now wrap any component with the withErrorBoundary HOC to catch errors, this is useful if you're creating your own custom components and want to catch errors, this is exported from @hakit/components
- NEW - EntitiesCard - similar to the Entities Card in home assistant, you have full control over each row that's displayed
- NEW - Alert - a shared component to display warnings or alerts, currently used by the ErrorBoundaries that have been introduced
