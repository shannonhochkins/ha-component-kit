import { HassConnect, useUsers } from "@hakit/core";
import { useState } from "react";

export function Component() {
  const users = useUsers({ includeInactiveUsers: true });
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  const filtered = showInactiveOnly ? users.filter((u) => !u.is_active) : users;

  return (
    <div>
      <button onClick={() => setShowInactiveOnly((v) => !v)}>{showInactiveOnly ? "Show All" : "Show Inactive Only"}</button>
      <ul>
        {filtered.map((user) => (
          <li key={user.id}>
            {user.name}
            {user.is_active ? "" : " (inactive)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
