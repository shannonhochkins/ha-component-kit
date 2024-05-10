This file holds the mocked entities to use with storybook, obviously the storybook isn't a direct connection to a home assistant instance, so we have to mock the entities and connections for the api.

If you want to add a new entity and the domain isn't supported, it's pretty simple! Just follow the same format as the other entities and add it to the mockEntities file, if you're unsure of the available properties for the HassEntity, you can console log the entity once you've connected to the api, however keep in mind that the properties on the entity at the time, may not be everything that's actually available!

Additionally, the api that's also mocked (HassConnectFake.tsx), does NOT contain updates for every available action, this is time consuming and sometimes irrelevant for storybook to render and "preview" the component, however if you want to indicate what the component is capable of, you can follow the same path as some of the other domains that have been mocked, eg "climate" or "light".

turnOn, turnOff and toggle have been mocked by default but this is it.