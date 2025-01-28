
import { useHass, HassConnect } from '@hakit/core';

function UseStoreExample() {
  const { useStore } = useHass();
  // there's more available on the store than displayed here, this is just an example
  const entities = useStore(store => store.entities);
  const connection = useStore(store => store.connection);
  const config = useStore(store => store.config);
  const auth = useStore(store => store.auth);
  console.log('data', {
    entities,
    connection,
    config,
    auth
  });
  return <p>{JSON.stringify(entities, null, 2)}</p>
}

export function App() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <UseStoreExample />
  </HassConnect>;
}