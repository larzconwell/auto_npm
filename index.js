var async = require('async'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    cwd = process.cwd(),
    pkgPath = path.join(cwd, 'package.json'),
    gitDir = path.join(cwd, '.git'),
    hookDir = path.join(gitDir, 'hooks'),
    hookFile = path.join(hookDir, 'post-commit'),
    subjectPat = /\[publish\]/i,
    versionPat = /"version":(\s)*"[^,]*"/i,
    pkg,
    hookContents;

pkg = require(pkgPath);
hookContents = [
  '#!/bin/sh',
  'exec auto_npm update',
  ''
].join('\n');

exports.update = function update () {
  var commit;

  async.series([
    // Get the commit
    function (done) {
      getCommit(function (err, c) {
        if (c) {
          commit = c;
        }

        done(err);
      });
    },
    // Handle creating tags and publishing
    function (done) {
      // If subject has [publish]
      if (commit.subject.match(subjectPat)) {
        async.series([increment, tag, publish], done);
        return;
      }

      // If version has been updated in package.json
      if (commit.diff.match("package.json") && commit.diff.match(versionPat)) {
        async.series([tag, publish], done);
        return;
      }

      done(null);
    }
  ], function (err) {
    var code = 0;

    if (err) {
      code = 1;
      process.stderr.write(err.toString() + "\n");
    }

    process.exit(code);
  });
};

// Remove the Git hook
exports.disable = function disable () {
  fs.unlink(hookFile, function (err) {
    if (err && err.code && err.code === 'ENOENT') {
      err = undefined;
    }
    var code = 0;

    if (err) {
      code = 1;
      process.stderr.write(err.toString() + "\n");
    } else {
      console.log('Auto NPM has been disabled.');
    }

    process.exit(code);
  });
};

// Add the Git hook
exports.enable = function enable (force) {
  var exists;

  async.series([
    // Create hooks directory
    function (done) {
      fs.mkdir(hookDir, function (err) {
        if (err && err.code && err.code === 'EEXIST') {
          err = undefined;
        }

        done(err);
      });
    },
    // Check if the post-commit hook exists
    function (done) {
      fs.exists(hookFile, function (e) {
        exists = e;
        done(null);
      });
    },
    // If it doesn't exist, just write the hook
    function (done) {
      if (exists) {
        done(null);
        return;
      }

      writeHook(done);
    },
    // If it does exist, check if force is given
    function (done) {
      if (!exists) {
        done(null);
        return;
      }

      if (force) {
        writeHook(done);
        return;
      }

      done(new Error("post-commit Git hook already exists, please remove it or use the --force" +
        " option to enable Auto NPM."));
    }
  ], function (err) {
    var code = 0;

    if (err) {
      code = 1;
      process.stderr.write(err.toString() + "\n");
    } else {
      console.log('Auto NPM is enabled.');
    }

    process.exit(code);
  });
};

// Write the hook making it executable for the user.
function writeHook (callback) {
  fs.writeFile(hookFile, hookContents, {mode: 0744}, callback);
}

// Gets the subject and diff from the last commit
function getCommit(callback) {
  var gitCmd = 'git log -1',
      subjectCmd = gitCmd + ' --pretty=format:"%s"',
      diffCmd = gitCmd + ' -p';

  async.parallel({
    subject: function (done) {
      exec(subjectCmd, function (err, stdout) {
        done(err, stdout);
      });
    },
    diff: function (done) {
      exec(diffCmd, function (err, stdout) {
        done(err, stdout);
      });
    }
  }, callback);
}

// Increment the version number for the package and commit
function increment (done) {
  var nums = pkg.version.split('.'),
      cmd = 'git commit package.json --no-verify -m "Version {{version}}"';

  nums[nums.length-1] = parseInt(nums[nums.length-1], 10) + 1;
  pkg.version = nums.join('.');
  cmd = cmd.replace('{{version}}', pkg.version);

  async.series([
    function (complete) {
      fs.writeFile(pkgPath, JSON.stringify(pkg, true, 2), complete);
    },
    function (complete) {
      exec(cmd, complete);
    }
  ], done);
}

// Create a Git tag
function tag (done) {
  async.series([
    function (complete) {
      exec('git tag -a v' + pkg.version + ' -m "Version ' + pkg.version + '"', complete);
    },
    function (complete) {
      exec('git push origin --tags', complete);
    }
  ], done);
}

// Publish to npm
function publish (done) {
  exec('npm publish', done);
}
