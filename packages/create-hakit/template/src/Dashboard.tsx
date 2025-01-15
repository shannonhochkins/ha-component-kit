import { Column, TimeCard } from '@hakit/components';
import { useHass } from "@hakit/core";

function Dashboard() {
  const { getAllEntities } = useHass();
  return <Column fullWidth fullHeight>
    <h2>Successfully Authenticated!</h2>
    <p>The time below will update automatically from Home Assistant.</p>
    <TimeCard />
    <p>You have <b>{Object.keys(getAllEntities()).length}</b> entities to start automating with! Have fun!</p>
  </Column>
}

export default Dashboard