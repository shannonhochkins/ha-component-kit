import { useIconByDomain, HassConnect } from "@hakit/core";

function IconExample() {
  const icon = useIconByDomain("mediaPlayer", {
    color: "red",
    style: {
      fontSize: 40,
    },
  });
  return <div>{icon}</div>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <IconExample />
    </HassConnect>
  );
}
