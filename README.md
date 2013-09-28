Auto NPM
--------

Automatically update NPM packages when making commits.

When you make a commit that changes the version in `package.json` it'll tag and publish to NPM, or
if you include `[publish]` in the commit subject it'll increment the patch number then tag and
publish.

### Install
`npm install -g auto_npm`

### Usage
```
auto_npm <command> [options]
```

#### Commands
- `enable` Enables Auto NPM in the current repo
- `disable` Disables Auto NPM in the current repo
- `update` Updates the NPM package in the current repo and creates a Git tag for it

#### Options
- `--force`, `-f` Force Auto NPM to rewrite any conflicting Git hooks
- `--help`, `-h` Display the help dialog

### Notes
- There hasn't been much success using `git commit -a` but `but commit -m` works most of the time.
