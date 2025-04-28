import { Modal, FabCard } from "@hakit/components";
import { useState } from "react";
export function CustomButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <-- The trigger element can be any motion element, in this case we use a FabCard which is a motion.button element --> */}
      <FabCard onClick={() => setOpen(true)} icon="mdi:cog" />
      <Modal
        open={open}
        title="Settings"
        onClose={() => {
          setOpen(false);
        }}
      >
        Add your settings here!
      </Modal>
    </>
  );
}
