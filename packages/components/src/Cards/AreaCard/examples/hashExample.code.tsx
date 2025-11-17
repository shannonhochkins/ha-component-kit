import { useHass } from "@hakit/core";
import { Row, AreaCard, ButtonCard } from "@hakit/components";
import office from "../../../assets/images/office.jpg";

export function UseHashExample() {
  const setHash = useHass((store) => store.setHash);
  return (
    <Row fullHeight fullWidth>
      <AreaCard image={office} title="Office" icon="mdi:office-chair" hash="office">
        The office is active!
      </AreaCard>
      <ButtonCard
        title="Trigger the office!"
        onClick={() => {
          setHash("office");
        }}
      />
    </Row>
  );
}
