# Overview

This package is designed to be a template for creating custom dashboards for Home Assistant using react.

[![npm version](https://badge.fury.io/js/ha-component-kit.svg)](https://badge.fury.io/js/ha-component-kit)

It provides components for you to use to create your own custom react Home Assistant dashboard.

### Get Started

There's detailed [documentation](https://shannonhochkins.github.io/ha-component-kit) which should give you all the information you need to get started, a quick rundown to get you started:


1. You must install the package:

```bash
npm i ha-component-kit
```
2. import the required components to authenticate with Home Assistant:

```ts
import { HassConnect, ThemeProvider } from 'ha-component-kit';
function App() {
  return <HassConnect hassUrl={HASS_URL}>
    <ThemeProvider />
    We are authenticated!
  </HassConnect>
}
```

3. That's it! You can now use the components to create your own custom dashboard for Home Assistant, see the [documentation](https://shannonhochkins.github.io/ha-component-kit) for more details.


This is still a **WIP** and is subject to change, I will be making changes to this over the next few months to have a workable solution for multiple dashboards.

### Local Development / Contribution
To spin up the local server, run the following command from the root of the repository:

```bash
npm i && npm start
```
