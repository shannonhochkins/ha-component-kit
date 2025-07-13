import { HassConnect, useUsers } from "@hakit/core";

export function Component() {
  const { users } = useUsers();
  return (
    <div>
      Hey, look at all our users:{" "}
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
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
