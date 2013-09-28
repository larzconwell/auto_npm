# 1.0.0
+ `enable` no longer checks the existing hook contents, and just prints the error.
+ `disable` no longer checks the existing hook, just removes it.
+ Incrementing uses `--no-verify` for the commit, so hopefully it won't go into a hook loop.
+ Publishing doesn't use `sudo` any more.
+ Use `optimist` to parse argv.
+ Print errors to stderr.
+ Simplify file structure.
