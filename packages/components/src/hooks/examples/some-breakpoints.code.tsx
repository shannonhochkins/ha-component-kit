import { HassConnect } from "@hakit/core";
import { useBreakpoint, ThemeProvider } from "@hakit/components";

export function Component() {
  const bp = useBreakpoint();
  return (
    <div>
      {bp.xxs && <p>xxs active</p>}
      {bp.xs && <p>xs active</p>}
      {bp.sm && <p>sm active</p>}
      {bp.md && <p>md active</p>}
      {bp.lg && <p>lg active</p>}
      {bp.xlg && <p>xlg active</p>}
    </div>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider
        breakpoints={{
          xs: 576,
          lg: 1200,
        }}
      />
      <Component />
    </HassConnect>
  );
}
