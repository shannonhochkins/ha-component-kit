import { useOf } from '@storybook/blocks';

export function AfterDescription() {
  const meta = useOf('meta', ['meta']);
  const afterDescription = meta?.preparedMeta?.parameters?.afterDescription;
  return afterDescription ?? null;
};