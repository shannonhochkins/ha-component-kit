import { ThemeProvider, TimeCard, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";

export function Component() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <TimeCard
        timeFormat={(date) => {
          return <span>Time: {date.toLocaleTimeString().replace(/:/g, "-")}</span>;
        }}
        hideDate
      />
    </HassConnect>
  );
}
