import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { Source } from "@storybook/addon-docs/blocks";
import { useState } from "react";
import { ThemeProvider, ButtonCard, Modal, FabCard, Column, Row, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";
import jsxToString from "react-element-to-jsx-string";
import exampleRenderByDomain from "./examples/modalByDomain.code?raw";
import exampleModal from "./examples/modal.code?raw";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="1rem" fullWidth>
        <ButtonCard {...args} />
        <FabCard entity="light.fake_light_2" service="toggle" />
      </Row>
    </HassConnect>
  );
}

function ExampleModalProps() {
  return (
    <FabCard
      entity="light.fake_light_2"
      modalProps={{
        hideAttributes: true,
        hideLogbook: true,
        hideState: false,
        hideUpdated: false,
        title: "Entity Title Override",
        stateTitle: "Override the state value/text shown",
      }}
    />
  );
}

function RenderModalProps() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column fullWidth>
        <p>Modal component has a few props that you can use to customize the modal.</p>
        <Source dark code={jsxToString(ExampleModalProps())} />
        <ExampleModalProps />
        <p>The above demo will not show the logbook by default or the attributes for the entity provided.</p>
      </Column>
    </HassConnect>
  );
}

function RenderCustom() {
  const [open, setOpen] = useState(false);
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" fullWidth>
        <Source dark code={exampleModal} />
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
      </Column>
    </HassConnect>
  );
}

function RenderModalByDomain() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column fullWidth>
        <p>There&apos;s a helper component that will automatically load up pre-defined modals by entity/domain.</p>
        <p>If the entity you&apos;re using has no predefined layout, it won&apos;t render anything.</p>
        <p>
          Please note that this exact component is automatically wired up to the FabCard and ButtonCard when you long press on the buttons.
        </p>
        <Source dark code={exampleRenderByDomain} />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof Modal>;

// @ts-expect-error - fix this later
export type ModalStory = StoryObj<typeof ButtonCard<"light.fake_light_1", "toggle">>;
export const Docs: ModalStory = {
  render: Render,
  args: {
    service: "toggle",
    title: "Office Downlight",
    entity: "light.fake_light_1",
  },
};

export const CustomModal: ModalStory = {
  render: RenderCustom,
  args: {},
};

export const ModalProps: ModalStory = {
  render: RenderModalProps,
  args: {},
};

export const ModalByDomain: ModalStory = {
  render: RenderModalByDomain,
  args: {},
};
