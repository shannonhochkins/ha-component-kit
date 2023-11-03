## Overview
I'm using changesets to manage this monorepo as there's a few packages that need to be deployed at the same time or individually and this will automatically manage sub dependencies.

I'm not using changesets to actually publish as they require payment to do so.

### Deploying
- Deploying to storybook just requires the PR to be merged to master and it will kickoff a github action to deploy.

### Tagging & Releasing

Releasing is relatively simple.

These commands will build everything needed to deploy before it actually releases, so no need to run these before the release.

This is the release process is a bit manual but it works for now.
```bash
# Step 1: Make sure your local master is up-to-date with the remote, merge master into development if need be
git fetch origin && git checkout master && git pull

# Step 2: Checkout development branch, pull latest, Create a release branch
git flow release start "1.0.0"
# ... perform any final adjustments on the release branch, bump version numbers, etc. ...
npx changeset
npx changeset version
## release core or components or create-hakit
npm run release:core
npm run release:components
npm run release:create-hakit
# commit files
# Step 3: Push the tag to the remote
git flow release finish "1.0.0"
# Step 4: Push all branches and tags to remote
git push origin master
git push --tags
```

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

It will also create a changelog under each package, these should not be included as there's a main changelog.md in the root of the repository.

Once you've done this, commit your changes, then run:

```bash
npm run release:core
npm run release:components
```


