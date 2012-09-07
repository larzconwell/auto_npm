Auto NPM
--------

Automatically update a NPM package when you make a commit that changes the version number in `package.json`, also creates a git tag for you.

####Arguments
- `--enable` or `-e` Enable Auto NPM in a git repo
- `--disable` or `-d` Disable Auto NPM in a git repo
- `--force` or `-f` Force Auto NPM to rewrite any exists Git hooks that we need
- `--update` or `-u` Update the NPM package for the current repo
- `--help` or `-h` Display the help dialog


_Note_: There hasn't been much success using `git commit -a`, but `git commit -m` works fine.
