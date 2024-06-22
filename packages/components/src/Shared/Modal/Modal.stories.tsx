import type { Meta, StoryObj, Args } from "@storybook/react";
import styled from "@emotion/styled";
import { Source } from "@storybook/blocks";
import { useState } from "react";
import { ThemeProvider, ButtonCard, Modal, FabCard, Column, Row, ModalProvider } from "@components";
import { HassConnect } from "@hass-connect-fake";
import jsxToString from "react-element-to-jsx-string";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullWidth>
        <ButtonCard {...args} />
        <FabCard entity="light.fake_light_2" service="toggle" />
      </Row>
    </HassConnect>
  );
}

const P = styled.p`
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

const exampleSetup = `
import { Modal } from '@hakit/components';
import { useState, useId } from 'react';
function CustomButton() {
  const _id = useId();
  const [open, setOpen] = useState(false);
  return (
    <>
      <-- The trigger element can be any motion element, in this case we use a FabCard which is a motion.button element -->
      <FabCard layoutId={_id} onClick={() => setOpen(true)} icon="mdi:cog" />
      <Modal id={_id} open={open} title="Settings" onClose={() => {
        setOpen(false);
      }}>
        Add your settings here!
      </Modal>
    </>
  );

}
`;

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
      <ThemeProvider includeThemeControls />
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
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <Source dark code={exampleSetup} />
        <FabCard onClick={() => setOpen(true)} layoutId="custom-modal" icon="mdi:cog" />
        <Modal
          id="custom-modal"
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
const exampleRenderByDomain = `
  import { ModalByEntityDomain, FabCard } from '@hakit/components';
  import { motion } from 'framer-motion';
  import { useId } from 'react';
  function CustomButton() {
    const [open, setOpen] = useState(false);
    const _id = useId();
    return (
      <>
        <-- The trigger element can be any motion element, 
        in this case we use a FabCard which is a motion.button element -->
        <FabCard layoutId={_id} onClick={() => setOpen(true)} icon="mdi:cog" />
        <ModalByEntityDomain
          id={_id}
          entity="light.fake_light_1"
          open={open}
          title="Settings"
          onClose={() => {
            setOpen(false);
          }} />
      </>
    );
  
  }
`;
function RenderModalByDomain() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column fullWidth>
        <p>There's a helper component that will automatically load up pre-defined modals by entity/domain.</p>
        <p>If the entity you're using has no predefined layout, it won't render anything.</p>
        <p>
          Please note that this exact component is automatically wired up to the FabCard and ButtonCard when you long press on the buttons.
        </p>
        <Source dark code={exampleRenderByDomain} />
      </Column>
    </HassConnect>
  );
}

function TestingModalStore() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FabCard onClick={() => setOpen(true)} layoutId="custom-modal" icon="mdi:cog" cssStyles={`width: 250px`}>
        CLICK ME
      </FabCard>
      <Modal
        id="custom-modal"
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

const exampleComplex = `
<HassConnect hassUrl="http://localhost:8123">
  <ThemeProvider />
  <ModalProvider options={{
    reducedMotion: "always"
  }}>
    // Now by default, all modals rendered within the App will no longer perform the complex animations
    <App />
  </ModalProvider>  
</HassConnect>
`;

function RenderModalProviderDisableAnimation() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ModalProvider
        options={{
          reducedMotion: "always", // this will remove complex layout animations completely
        }}
      >
        <Column gap="1rem" fullWidth>
          <TestingModalStore />
          <P>
            By setting the `reducedMotion` to `always` you can disable all complex animations within the modal, this may be useful for
            devices with lower performance.
          </P>
          <Source dark code={exampleComplex} />
        </Column>
      </ModalProvider>
    </HassConnect>
  );
}

const example = `
<HassConnect hassUrl="http://localhost:8123">
  <ThemeProvider />
  <ModalProvider options={{
    animationDuration: 1,
  }}>
    // Now by default, all modals rendered within the App will have an "animationDuration" of "1" seconds
    <App />
  </ModalProvider>  
</HassConnect>
`;

function RenderModalProvider() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <ModalProvider
        options={{
          animationDuration: 1,
        }}
      >
        <Column gap="1rem" fullWidth>
          <TestingModalStore />
          <Source dark code={example} />
        </Column>
      </ModalProvider>
    </HassConnect>
  );
}

const customModalAnimation = `
<HassConnect hassUrl="http://localhost:8123">
  <ThemeProvider includeThemeControls />
  <ModalProvider options={{
    animationDuration: .5,
    modalAnimation(duration) {
      return {
        content: {
          variants: {
            exit: {
              transition: {
                duration,
              },
              y: '-5%',
              scale: 0.95,
              opacity: 0
            },
            animate: {
              opacity: 1,
              scale: 1,
              y: '0%',
              transition: {
                duration,
                delay: 0.3,
              }
            },
            initial: {
              opacity: 0,
              scale: 0.9,
              y: '0%',
              transition: {
                duration,
              }
            },
          }
        },
        modal: {
          variants: {
            exit: {
              y: '-20vh',
              transition: {
                duration: 1,
                delay: 0.3,
              },
              opacity: 0
            },
            animate: {
              y: '0%',
              opacity: 1,
              transition: {
                duration,
              }
            },
            initial: {
              y: '50vh',
              opacity: 0,
              transition: {
                duration,
              }
            },
          }
        },
      };
    }
  }}>
    <Column gap="1rem" fullWidth>
      <TestingModalStore />
      <Source dark code={customModalAnimation} />
    </Column>
  </ModalProvider>
</HassConnect>
`;

function RenderModalAnimationExample() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <ModalProvider
        options={{
          animationDuration: 0.5,
          modalAnimation(duration) {
            return {
              content: {
                variants: {
                  exit: {
                    transition: {
                      duration,
                    },
                    y: "-5%",
                    scale: 0.95,
                    opacity: 0,
                  },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    y: "0%",
                    transition: {
                      duration,
                      delay: 0.3,
                    },
                  },
                  initial: {
                    opacity: 0,
                    scale: 0.9,
                    y: "0%",
                    transition: {
                      duration,
                    },
                  },
                },
              },
              modal: {
                variants: {
                  exit: {
                    y: "-20vh",
                    transition: {
                      duration: 1,
                      delay: 0.3,
                    },
                    opacity: 0,
                  },
                  animate: {
                    y: "0%",
                    opacity: 1,
                    transition: {
                      duration,
                    },
                  },
                  initial: {
                    y: "50vh",
                    opacity: 0,
                    transition: {
                      duration,
                    },
                  },
                },
              },
            };
          },
        }}
      >
        <Column gap="1rem" fullWidth alignItems="start">
          <P>
            The following will replace all modal animations with the above animation rendered within the provider, this is an awesome way to
            customize your application by providing tailored animations to suit your needs
          </P>
          <P>This animation will fade in and up and when closing it will fade out and up again.</P>
          <P>
            These modalAnimations are driven by{" "}
            <a target="_blank" href="https://www.framer.com/motion/introduction/">
              Framer Motion
            </a>
            , the{" "}
            <a target="_blank" href="https://www.framer.com/motion/animation/#variants">
              variants
            </a>{" "}
            have a preset of animate, exit and initial animation properties available and supports all properties that framer motion allows
            you to animate.
          </P>
          <P>
            You can also simply provide a `layoutId` which is what's used by default within the modal component to create the default
            animation.
          </P>
          <P>You can animate the modal, content and header separately!</P>
          <P>
            Here's some example references for animations with{" "}
            <a href="https://fireship.io/lessons/framer-motion-modal/" target="_blank">
              framer motion
            </a>
          </P>
          <P>You can also do this individually using the same `modalAnimation` prop on the modal directly.</P>
          <P>
            <b>TIP: </b>click and hold on the button to launch the modal
          </P>
          <ExampleModalProps />
          <Source dark code={customModalAnimation} />
        </Column>
      </ModalProvider>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof Modal>;

// @ts-expect-error - fix this later
export type ModalStory = StoryObj<typeof ButtonCard<"light.fake_light_1", "toggle">>;
export const ModalExample: ModalStory = {
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

export const ModalProviderExample: ModalStory = {
  render: RenderModalProvider,
  args: {},
};

export const ReplaceModalAnimation: ModalStory = {
  render: RenderModalAnimationExample,
  args: {},
};

export const DisableComplexAnimations: ModalStory = {
  render: RenderModalProviderDisableAnimation,
  args: {},
};
