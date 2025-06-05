import { Title, Description, Primary, ArgTypes, useOf } from "@storybook/addon-docs/blocks";
import React from "react";
import { ImportExample } from "./components/importExample";
import { AfterDescription } from "./components/afterDescription";
import { AfterPrimary } from "./components/afterPrimary";
import './global.css';

export function Page() {
  const meta = useOf('meta', ['meta']);
  const hidePrimary = meta?.preparedMeta?.parameters?.hidePrimary;
  const hideComponentProps = meta?.preparedMeta?.parameters?.hideComponentProps;
  return (<>
    <Title />
    <Description />
    <AfterDescription />
    <ImportExample />
    {!hidePrimary && <Primary />}
    <AfterPrimary />
    {!hideComponentProps && <>
      <h2>Component Props</h2>
      <ArgTypes />
    </>}
  </>)
}