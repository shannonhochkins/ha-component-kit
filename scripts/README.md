## Generate API hook
This simply reads the "services.json" file and converts this to useable typescript types to work with the react hooks.

This is something that will most likely be removed in the near future and the types/supported-services file will just be
maintained manually.

However, if your home assistant instance is very different to what i have already exported, this script should generate the types for you.

The services file was generated from the `getServices` response under the useHass hook, you can call this and replace it to generate your own set of types to use with your project.

```bash
  npm run build:
```

## Sync HA helpers

Home assistant clearly has a bunch of code for the UI that generates color pickers and converts light colour to css colors etc. To save us time and to enforce accuracy on the conversion of hass entities to valid colour values, we'll reuse what they're using in the UI.

```
npm run sync-ha-helpers