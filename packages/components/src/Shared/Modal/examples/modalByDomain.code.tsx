import { ModalByEntityDomain, FabCard } from "@hakit/components";
import { useState } from "react";

export function CustomButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FabCard onClick={() => setOpen(true)} icon="mdi:cog" />
      <ModalByEntityDomain
        entity="light.fake_light_1"
        open={open}
        title="Settings"
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
