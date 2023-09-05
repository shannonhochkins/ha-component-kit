# Overview

This repository contains functionality to easily generate custom dashboards for Home Assistant using the official web socket connection that the standard lovelace dashboards use.
If you like anything here, be sure to 🌟 [my repo!](https://github.com/shannonhochkins/ha-component-kit)

![DEMO](https://github.com/shannonhochkins/ha-component-kit/blob/master/stories/hakit-demo.gif?raw=true)

## Help me out?

I've spent a lot of time on this, you're free to use it but would appreciate a small donation if you're feeling generous! Buy me a coffee!

[Buy me a coffee!](https://www.buymeacoffee.com/jinglezzz)

### Get Started

```
  npm install @hakit/core @hakit/components -D
```

There's extensive [documentation](https://shannonhochkins.github.io/ha-component-kit) which should give you all the information you need to get started!

### What's next?
Have your say! Vote for what you'd like to see next in [upcoming features!](https://github.com/shannonhochkins/ha-component-kit/discussions/28)

### Contributors!

#### Local Storybook
To spin up the storybook interface, run the following command from the root of the repository:

```bash
npm install && npm start
```

#### Local Development / Contribution
If you want to contribute, fix bugs, integrate new features you can work with @hakit locally with your own dashboard

##### 1. Clone the repisitory
```shell
git clone https://github.com/shannonhochkins/ha-component-kit.git
cd ha-component-kit
npm install
```

##### 2. Prep for local development
This will simply build everything locally and setup workspace links:

```shell  
npm run build && npm link -ws
```
Now that you've built the packages and setup links, you can either run `npm run watch:build:core` or `npm run watch:build:components` to watch for changes in the core or components packages respectively.

```shell
npm run watch:build:core
```

##### 3. Link @hakit to your local dashboard
Now you can link your local @hakit packages to your dashboard. This will allow you to make changes to the core or components packages and see them reflected in your dashboard, run the following command in your local dashboard

```shell
npm link @hakit/core @hakit/components
```
If you now navigate to your node_modules under @hakit, you should see the packages linked to your local @hakit packages and changes you make in hakit should reflect on your dashboard.


