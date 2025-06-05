import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { redirectToStory } from '../.storybook/redirect';

export default {
  title: "INTRODUCTION/Responsive Layouts/CSS Classes",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `There's a range of CSS class available for responsive design.`
      }
    },
    hidePrimary: true,
    hideComponentProps: true,
    afterPrimary: <>
      <p>For every available breakpoint (see <a href="#" onClick={(e) => {
              e.preventDefault();
              redirectToStory('/docs/introduction-responsive-layouts-breakpoints--docs');
            }}>breakpoints</a> for more info) a css class is available to use to conditionally style your components.</p>
      <p>When a breakpoint is active, the current breakpoint class will be added to the body of the document, for example if we&quot;re in the range for a `lg` breakpoint, the following will apply to the body:</p>
      <Source dark code={`<body class="bp-lg">...</body>`} />

      <p>You can use these classes to change your layout/design visually within your css rules.</p>
      <Source dark code={`
.bp-xxs {
  /* Extra Extra small Screen Size, active when below the breakpoint.xxs value */
}
.bp-xs {
  /* Extra small Screen Size, active between breakpoint.xxs and breakpoint.sm */
}
.bp-sm {
  /* Small Screen Size, active between breakpoint.xs and breakpoint.sm */
}
.bp-md {
  /* Medium Screen Size, active between breakpoint.sm and breakpoint.md */
}
.bp-lg {
  /* Large Screen Size, active between breakpoint.md and breakpoint.lg */
}
.bp-xlg {
  /* Extra Large Screen Size, active above breakpoint.lg */
}

`} />
    </>
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

