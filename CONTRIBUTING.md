#### Local Development / Contribution
If you want to contribute, fix bugs, integrate new features you can work with @hakit locally with your own dashboard

##### Clone the repisitory
```shell
git clone https://github.com/shannonhochkins/ha-component-kit.git
cd ha-component-kit
npm install
```

#### Local Storybook
To spin up the storybook interface, run the following command from the root of the repository, changes in the components src will reflect in storybook, core is a little bit more complicated (explained below):

**Note:** You will have to build @hakit/core at least once, @hakit/core isn't pulled from the local dev but rather from the distrubutable files from the package, i haven't figured out how to resolve this yet as @hakit/core has a lot of complexities wrapped around it, but run `npm run build:core` and then you should be able to run `npm start` to kick off the local development storybook server.

```bash
npm start
```

To introduce a new feature to the component package, follow the same file structure as the other components, there must be a Stories.tsx file and an index.tsx file, the exported component should be wrapped in an ErrorBoundary to avoid dashboards crashing when an individual component fails to render. The `components/src/index.ts` file should export the types and components relevant to the feature so the types and components are exported with the package.

There's load's of reference examples already built, however please reach out if you get stuck or have any questions, it's a complicated project with a lot of moving parts and functionality.

To introduce a new core feature, unfortunately the only way to test this within storybook, is to first run `npm run watch:build:core`, then run `npm start` in a separate terminal, as the components package depends on a built core package to run.

##### Prep for local development with a test dashboard
This will simply build everything locally and setup workspace links:

```shell  
npm run build && npm link -ws
```
Now that you've built the packages and setup links, you can either run `npm run watch:build:core` or `npm run watch:build:components` to watch for changes in the core or components packages respectively.

```shell
npm run watch:build:core
```

##### Link @hakit to your local dashboard
Now you can link your local @hakit packages to your dashboard. This will allow you to make changes to the core or components packages and see them reflected in your dashboard, run the following command in your local dashboard

```shell
npm link @hakit/core @hakit/components
```
If you now navigate to your node_modules under @hakit, you should see the packages linked to your local @hakit packages and changes you make in hakit should reflect on your dashboard.

Now whenever you make changes in either core or components, the changes should reflect on your local test dashboard.


### Demo Gif
I've been using quick time to record the screen to mov, then using ffmpeg to convert the mov to gif

```
ffmpeg -i input.mov -filter_complex "[0:v] fps=12,scale=840:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" output.gif

```