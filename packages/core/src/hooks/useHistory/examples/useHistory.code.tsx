
import { HassConnect, useHistory } from '@hakit/core';

function Office() {
  const history = useHistory('light.some_light');
  // can now access all properties relating to the history for this light.
  return history.loading ? <p>Loading</p> : <p>History: {history.timeline.map((state, index) => {
    return <p key={index}>{state.state}: {state.last_changed};</p>;
  })}</p>;
}
export function App() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <Office />
  </HassConnect>
}