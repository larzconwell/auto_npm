Auto NPM
--------

Automatically update NPM packages and create Git tags when a commit updates the version number or increment the number if you include [publish] in the commit message

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


###Notes
- There hasn't been much success using `git commit -a` but `but commit -m` works most of the time.
- When a commit includes `[publish]` it will increment your patch number, create Git tags and publish to NPM.
- When you manually change your version number, it will create a Git tag and publish it to NPM.
- Sometimes when it asks for your password when publishing it can be a bit iffy on your shell. Not sure why it's weird so it'll be fixed as soon as I found out how to.
