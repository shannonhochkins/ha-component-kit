import { useState } from "react";
import styled from "@emotion/styled";
import { FabCard, Modal } from "@components";
import { ThemeControls } from "./ThemeControls";
import { localize } from "@hakit/core";

const ThemeControlsBox = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1;
`;

export function ThemeControlsModal() {
  const [open, setOpen] = useState(false);
  return <>
    <ThemeControlsBox>
      <FabCard onClick={() => setOpen(true)} tooltipPlacement="left" title={localize("theme")} icon="mdi:color" />
    </ThemeControlsBox>
    <Modal
      description="This interface showcases how the colors will behave and provides easy to access css variables"
      open={open}
      title={localize("theme")}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ThemeControls />
    </Modal>
  </>
}