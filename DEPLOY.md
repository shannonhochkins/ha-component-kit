## Overview
I'm using changesets to manage this monorepo as there's a few packages that need to be deployed at the same time or individually.

### Deploying
Deploying is relatively simple, run the following command:
```bash
npx changeset
```
This command will pickup all packages within the workspace and prompt which ones need to be deployed, it will then create a changeset file containing data about the versions and packages that will be updated.

Press enter when it asks for a bump that you are not wanting to use (eg major, press enter to use minor).

### Versioning
Once the changesets command has been run, you can run the following command to translate the changeset changes to the packages:
```bash
npx changeset version
```

This command will also automatically update any inter-dependencies between packages, eg @hakit/components depends on the latest version of @hakit/core, this will update automatically.

Once you've done this, commit your changes, build packages if necessary, then run:

```bash
npx changeset publish
```

#### Change status
Optionally, to see the changes that will be deployed, you can run the following command:
```bash
npx changeset status --verbose
```