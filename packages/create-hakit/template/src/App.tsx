import { ThemeProvider } from '@hakit/components';
import { HassConnect } from '@hakit/core';
import Dashboard from './Dashboard';

function App() {
  return <>
    <HassConnect hassUrl={import.meta.env.VITE_HA_URL} hassToken={import.meta.env.VITE_HA_TOKEN}>
      <ThemeProvider includeThemeControls />
      <Dashboard />
    </HassConnect>
  </>
}

export default App;