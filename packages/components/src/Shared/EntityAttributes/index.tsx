import { useEntity, type EntityName } from '@hakit/core';
import { Group, type GroupProps } from '@components';
import styled from '@emotion/styled';
import { useMemo } from 'react';

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

export function EntityAttributes({
  entity,
  title,
  ...rest
}: EntityAttributesProps) {
  const _entity = useEntity(entity);
  const memoizedAttributes = useMemo(() => Object.entries(_entity.attributes), [_entity]);

  return <Group collapsed cssStyles={`
    background-color: var(--ha-S300);
    color: var(--ha-S300-contrast);
    margin: 1rem 0;
  `} layout="column" alignItems="flex-start" title={title ?? 'Attributes'} {...rest}>
    {memoizedAttributes.map(([key, value]) => (
      <Entry key={key}>
        <Key>{key}</Key>
        <Value>{Array.isArray(value) ? value.join(', ') : typeof value === 'object' || typeof value === 'boolean' ? JSON.stringify(value) : value}</Value>
      </Entry>
    ))}
  </Group>
}