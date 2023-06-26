import type { Meta } from '@storybook/react';
import { HassConnect } from './';
export default {
  title: 'HassConnect',
  component: HassConnect,
  args: {
    fallback: null,
  },
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
} satisfies Meta<typeof HassConnect>;;