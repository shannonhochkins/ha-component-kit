import { type HassUser } from "home-assistant-js-websocket";
import { useHass, HassConnect } from "@hakit/core";
import { useEffect, useState } from "react";

function GetUserExample() {
  const { getUser } = useHass();
  const [user, setUser] = useState<HassUser | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, [getUser]);

  return <p>{JSON.stringify(user, null, 2)}</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <GetUserExample />
    </HassConnect>
  );
}
