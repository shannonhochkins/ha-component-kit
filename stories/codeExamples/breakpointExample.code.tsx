import { HassConnect } from '@hakit/core';
import { ThemeProvider } from '@hakit/components';

export function ThemeProviderExample() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider breakpoints={{
      xxs: 600,
      xs: 900,
      sm: 1200,
      md: 1536,
      lg: 1700,
    }} />
  </HassConnect>
}
