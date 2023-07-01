

import { useRef, useCallback } from 'react';
// import Ripples from 'react-ripples'
import styled from '@emotion/styled';
import type { DomainName, DomainService, Target } from '../../../types/supported-services';
import { useApi, useHass } from '../../../hooks';
import { Ripples } from '../../Shared/Ripple';
import { useEntity } from '../../../hooks/useEntity';

const Category = styled.div``;
const Name = styled.div``;


const StyledDeviceButton = styled.button`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  aspect-ratio: 1 / 1;
  max-width: var(--ha-device-button-max-width);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0,0,0,.1);
  transition: all .2s cubic-bezier(.06,.67,.37,.99);

  &:hover, &:focus, &:active {
    box-shadow: 0px 4px 4px rgba(0,0,0,.1);
  }
  
  ${Category} {

  }
  ${Name} {
    
  }
`

interface DeviceButtonProps<D extends DomainName> {
  domain: D;
  service: DomainService<D>;
  entity?: string
}

export function DeviceButton<D extends DomainName>({ domain, service, entity }: DeviceButtonProps<D>) {
  // const { getEntity } = useHass();
  // const apiService = useApi(domain);
  // TODO - create subset components, one to just render the state by some default props,
  // another to automatically call the service when an entity is provided.
  // const _entity = useEntity(entity);
  // service[service]
  // const onClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // apiService[service](target);
  // }, [])

  return <Ripples borderRadius="1rem">
    <StyledDeviceButton>
      WIP
    </StyledDeviceButton>
  </Ripples>
}