import { useEntity, type EntityName } from "@hakit/core";
import { fallback, Group, type GroupProps } from "@components";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface EntityAttributesProps extends Partial<GroupProps> {
  /** the entity name to show the attributes for */
  entity: EntityName;
}

const Key = styled.div`
  flex-grow: 1;
`;
const Value = styled.div`
  max-width: 60%;
  overflow-wrap: break-word;
  text-align: right;
`;
const Entry = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--ha-S400);
`;

function _EntityAttributes({ entity, title, ...rest }: EntityAttributesProps) {
  const _entity = useEntity(entity);
  const memoizedAttributes = useMemo(() => [...Object.entries(_entity.attributes), ["state", _entity.state]], [_entity]);

  return (
    <Group
      collapsed
      cssStyles={`
    background-color: var(--ha-S300);
    color: var(--ha-S300-contrast);
    margin: 1rem 0;
  `}
      layout="column"
      alignItems="flex-start"
      title={title ?? "Attributes & State"}
      {...rest}
    >
      {memoizedAttributes.map(([key, value]) => (
        <Entry key={key}>
          <Key>{key}</Key>
          <Value>
            {Array.isArray(value)
              ? value.join(", ")
              : typeof value === "object" || typeof value === "boolean"
              ? JSON.stringify(value)
              : value}
          </Value>
        </Entry>
      ))}
    </Group>
  );
}

/** A component that will render entity attributes in a simple table like display, This is useful for debugging or simply just wanting to visualize all the available properties and values.
 *
 * This is currently used in the Popup for all cards that support popups.
 */
export function EntityAttributes(props: EntityAttributesProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "EntityAttributes" })}>
      <_EntityAttributes {...props} />
    </ErrorBoundary>
  );
}
