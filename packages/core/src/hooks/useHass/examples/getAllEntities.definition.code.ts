import { useHass } from "@hakit/core";

export function GetAllEntitiesDefinitionExample() {
  const { helpers } = useHass.getState();
  const entities = helpers.getAllEntities();
  console.debug("entities", Object.keys(entities).length);
  return null;
}
