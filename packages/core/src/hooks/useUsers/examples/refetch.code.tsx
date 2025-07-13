import { HassConnect, useUsers } from "@hakit/core";
import { useEffect, useState } from "react";

export function Component() {
  const { users, refetch } = useUsers();
  const [managedUsers, setManagedUsers] = useState(users);

  useEffect(() => {
    setManagedUsers(users);
  }, [users]);
  console.log("Users:", managedUsers);
  return (
    <button
      onClick={() => {
        refetch({ includeSystemGenerated: true, includeInactiveUsers: true })
          .then((newUsers) => {
            setManagedUsers(newUsers.users);
            console.log("Refetched Users:", newUsers.users);
          })
          .catch((error) => {
            console.error("Error refetching users:", error);
          });
      }}
    >
      REFRESH USERS
    </button>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
