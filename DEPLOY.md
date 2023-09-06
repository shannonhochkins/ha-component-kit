## Overview
I'm using changesets to manage this monorepo as there's a few packages that need to be deployed at the same time or individually.

### Deploying
Deploying is relatively simple, run the following command:
```bash
npx changesets
```
This command will pickup all packages within the workspace and prompt which ones need to be deployed, it will then create a changeset file containing data about the versions and packages that will be updated.

### Versioning
Once the changesets command has been run, you can run the following command to translate the changeset changes to the packages:
```bash
npx changesets version
```

This command will also automatically update any inter-dependencies between packages, eg @hakit/components depends on the latest version of @hakit/core, this will update automatically.

Once you've done this, commit your changes, build packages if necessary, then run:

```bash
npx changesets publish
```

#### Change status
Optionally, to see the changes that will be deployed, you can run the following command:
```bash
npx changesets status --verbose
```