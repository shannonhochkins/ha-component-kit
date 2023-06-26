import type { Meta } from '@storybook/react';
import { useHass } from '.';

const meta = {
  title: 'Hooks/useHass',
  component: useHass,
  argTypes: {
    hassUrl:{
      name: 'hassUrl',
      type: { name: 'string', required: true },
      description: 'The url to your home assistant instance',
      defaultValue: 'http://homeassistant.local:8123',
    }
  },
} satisfies Meta<typeof useHass>;

export default meta;
