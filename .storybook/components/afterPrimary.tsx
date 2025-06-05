import { useOf } from '@storybook/addon-docs/blocks';

export function AfterPrimary() {
  const meta = useOf('meta', ['meta']);
  const afterPrimary = meta?.preparedMeta?.parameters?.afterPrimary;
  return afterPrimary ?? null;
};