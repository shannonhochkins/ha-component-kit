## This script utilizes create-vite and introduces to additional sugar to create a complete working
setup with typescript/react/vite and @hakit/core & @hakit/components with very minimal effort!

This is a work in progress, it does assume you have a hosted instance of Home Assistant, the current deploy script will not work for a docker environment.

Simply just run the following:

```bash
npm create hakit@latest
```

### Local Development
`npm run dev` will run the executable locally and create the project in the current directory.

### Publishing
This is handled by [changesets](https://www.npmjs.com/package/@changesets/cli) and there is detailed documentation under the DEPLOY.md file in the ha-component-kit root.