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

### Creating a new release in GIT (after all the above is done)

https://github.com/shannonhochkins/ha-component-kit/releases - go here, click on "Draft new release" - pick related tag, add release notes, publish release.

### Changeset explained

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


### Canary Releases

1. Bump the package versions in core/components, and suffix with `-canary.0` for example in the package.json files.
2. Run the canary release command, this will run build first, then publish the canary versions to npm:
```bash
npm run release:core:canary
npm run release:components:canary
```
3. Verify it's not public or the latest version in npm, you can do this by running:
```bash
npm dist-tag ls @hakit/core
npm dist-tag ls @hakit/components
```
4. Ask users to install or test the canary version by running:
```bash
npm install @hakit/core@canary
npm install @hakit/components@canary
```
or the specific version:
```bash
npm install @hakit/core@1.0.0-canary.0
npm install @hakit/components@1.0.0-canary.0
```
