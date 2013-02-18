var fs     = require('fs')
  , path   = require('path')
  , exec   = require('child_process').exec
  , utils  = require('./utils')
  , errors = require('./errors')

var cwd         = process.cwd()
  , packagePath = path.join(cwd, 'package.json')
  , gitDir      = path.join(cwd, '.git')
  , hookDir     = path.join(gitDir, 'hooks')
  , hookFile    = path.join(hookDir, 'post-commit')
  , hookContent = '';

// Content to be written to hookFile
hookContent = [
    '#!/bin/sh'
  , 'exec auto_npm update'
  , ''
].join('\n');

// Expose utils
exports.utils = utils;

// Expose errors
exports.errors = errors;

// Write the 'post-commit' hook the hook content
exports.writeHook = function () {
  fs.writeFileSync(hookFile, hookContent, 'utf8');
  fs.chmodSync(hookFile, 0755);

  utils.kill('Auto NPM is now enabled in this repo.', 0);
};

// Deletes a `post-commit` hook
exports.deleteHook = function () {
  fs.unlinkSync(hookFile);

  utils.kill('Auto NPM has been disabled for this repo.', 0);
};

// Returns the commit information from the last commit
exports.getCommit = function (callback) {
  var gitCMD = 'git --git-dir=' + gitDir + ' log -1'
    , subjectCMD = gitCMD + ' --pretty=format:"%s"'
    , diffCMD = gitCMD + ' -p'
    , subject = ''
    , diff = '';

  exec(subjectCMD, function (err, stdout) {
    if (err) {
      callback && callback(err, undefined, undefined);
    }

    subject = stdout;
    exec(diffCMD, function (err, stdout) {
      if (err) {
        callback && callback(err, undefined, undefined);
      }

      diff = stdout;
      callback && callback(undefined, diff, subject);
    });
  });
};

// Get package.json in the current directory
exports.getPackage = function () {
  return require(packagePath);
};

// Install the hook file
exports.enable = function (options) {
  var opts = options || {};

  // Kill with error we're not in a Git repo
  if (!utils.isGitRepo()) {
    errors.gitError();
  }

  // Create hooks directory is it doesn't exist
  if (!fs.existsSync(hookDir)) {
    fs.mkdirSync(hookDir);
  }

  // If write hook if needed
  if (fs.existsSync(hookFile)) {
    // Write the hook if we're forcing it
    if (opts.force) {
      exports.writeHook();
    }

    var content = fs.readFileSync(hookFile, 'utf8');

    // If the hook is ours then it's already enabled
    if (content === hookContent) {
      utils.kill('Auto NPM is already installed in this repo.', 0);
    }

    // Check if the hook is the old option based version
    if (content.match(/--update/)) {
      exports.writeHook();
    }

    // Not ours so kill with message
    var msg = [
        'There is a conflicting Git hook, to use Auto NPM please delete'
      , 'the post-commit hook or use the --force option.'
    ].join(' ');
    utils.kill(msg, 1);
  } else {
    exports.writeHook();
  }
};

// Remove the hook file
exports.disable = function (options) {
  var opts = options || {};

  if (fs.existsSync(hookFile)) {
    if (opts.force) {
      exports.deleteHook();
    }

    var content = fs.readFileSync(hookFile, 'utf8');

    // If the hook is ours then it's safe to remove
    if (content === hookContent) {
      exports.deleteHook();
    }

    // Check if the hook is the old option based version
    if (content.match(/--update/)) {
      exports.deleteHook();
    }

    var msg = [
        'Couldn\'t remove Git hook as it\'s not for Auto NPM, use the'
      , '--force option if you\'d like to remove it anyway.'
    ].join(' ');
    utils.kill(msg, 1);
  } else {
    utils.kill('Auto NPM is not enabled for this repo.', 0);
  }
};

// Updated NPM packages
exports.update = function () {
  // Kill with error we're not in a Git repo
  if (!utils.isGitRepo()) {
    errors.gitError();
  }

  var subjectPat       = /\[publish\]/i
    , versionPat       = /"version*":.*/i
    , pkg              = exports.getPackage()
    , pkgVersion       = pkg.version
    , cmds             = []
    , incrementAndPush = {}
    , tagAndPublish    = {};

  // Increment version write it to package.json then push to server
  incrementAndPush = function () {
    var nums = pkgVersion.split('.')
      , cmd  = '';

    // Increment patch number
    nums[2] = Number(nums[2]) + 1
    pkgVersion = pkg.version = nums.join('.');

    // Write package info back to package.json
    fs.writeFileSync(packagePath, JSON.stringify(pkg, true, 2));

    // Push to the server
    cmd = 'git commit package.json -m "Version ' + pkgVersion + '"';
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        throw err;
      }

      console.log(stdout);
    });
  };

  // Create annotated tag and publish to NPM
  tagAndPublish = function () {
    cmds = [
        // Create annotated tag
        'git tag -a v' + pkgVersion + ' -m "Version ' + pkgVersion + '"'
        // Push new tag to server
      , 'git push origin v' + pkgVersion
        // Publish package to NPM
      , 'sudo npm publish'
    ];

    cmds.forEach(function(v) {
      exec(v, function(err, stdout, stderr) {
        if (err) {
          throw err;
        }

        console.log(stdout);
      });
    });
  };

  exports.getCommit(function (err, diff, subject) {
    if (err) {
      utils.kill(err, 1);
    }

    // If subject includes [publish] increment and push update
    if (subject.match(subjectPat)) {
      incrementAndPush();
      tagAndPublish();
    }

    // If version has been updated in package.json just update NPM package and set up tags
    if (diff.match(versionPat) && diff.match("package.json")) {
      tagAndPublish();
    }
    process.exit(0);
  });
};
