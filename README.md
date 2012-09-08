Auto NPM
--------

Automatically update NPM packages and create Git tags when your commit updates the version number or you include [publish] in the message

###Usage
Auto NPM is a command line tool, it's very simple to use and once you enable it in a Git repo, you don't have to do anything at all to use it.
```
auto_npm <command> [options]
```

####Commands
- `enable` Enables Auto NPM in the current repo
- `disable` Disables Auto NPM in the current repo
- `update` Updates the NPM package in the current repo and creates a Git tag for it

####Options
- `--force`, `-f` Force Auto NPM to rewrite any conflicting Git hooks
- `--help`, `-h` Display the help dialog


_Note_: There hasn't been much success using `git commit -a`, but `git commit -m` works fine.
