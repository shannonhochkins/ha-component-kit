import { ThemeProvider } from '@hakit/components';
import { HassConnect } from '@hakit/core';
import Dashboard from './Dashboard';

function App() {
  return <>
    <ThemeProvider includeThemeControls />
    <HassConnect hassUrl={import.meta.env.VITE_HA_URL}>
      <Dashboard />
    </HassConnect>
  </>
}

export default App;