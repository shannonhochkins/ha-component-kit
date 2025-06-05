import React from 'react';
import { Source } from "@storybook/addon-docs/blocks";
import { useOf } from '@storybook/addon-docs/blocks';

export function ImportExample() {
  const meta = useOf('meta', ['meta']);
  const isComponents = meta?.preparedMeta?.title.toLowerCase().startsWith('components/');
  const isCore = meta?.preparedMeta?.title.toLowerCase().startsWith('core/');
  const subComponents = Object.keys(meta?.preparedMeta?.subcomponents ?? {});
  const componentName = meta?.preparedMeta?.title.split('/').pop();
  const components = [componentName, ...subComponents].join(', ');

  if (meta?.preparedMeta?.parameters?.hideImportExample) return null;
  
  if (isComponents) {
    return <Source language='typescript' dark code={`import { ${components} } from "@hakit/components";`} />;
  }
  if (isCore) {
    return <Source language='typescript' dark code={`import { ${components} } from "@hakit/core";`} />;
  }
  return null;
};
