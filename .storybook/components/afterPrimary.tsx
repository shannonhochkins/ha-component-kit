import { useOf } from '@storybook/blocks';

export function AfterPrimary() {
  const meta = useOf('meta', ['meta']);
  const afterPrimary = meta?.preparedMeta?.parameters?.afterPrimary;
  return afterPrimary ?? null;
};