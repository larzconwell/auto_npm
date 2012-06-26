//
// Dependencies
var fs   = require('fs')
  , path = require('path');

//
// Vars
var cd       = process.cwd()
  , hookDir  = path.join(cd, '.git', 'hooks')
  , hookFile = path.join(hookDir, 'post-commit')
  , hookContent;

// Content to be written to hookFile
hookContent = [
    '#!/bin/sh'
  , 'exec auto_npm --update'
  , ''
].join('\n');

//
// Write the 'post-commit' hook the hook content
exports.writeHook = function() {
  fs.writeFile(hookFile, hookContent, 'utf8', function(err) {
    if(err) throw err;

    fs.chmodSync(hookFile, 0755);
    console.log('Auto NPM is enabled in "' + cd + '". To disable it run `auto_npm -d`');
  });
};

//
// Deletes a `post-commit` hook
exports.deleteHook = function() {
  fs.open(hookFile, 'w', function(err) {
    if(err) throw err;

    fs.unlinkSync(hookFile);
  });
};

//
// Install the hook file
exports.enable = function(options) {
  options = options || {};

  // Throw error if no .git directory is present
  var gitDir = path.existsSync(path.join(cd, '.git'));
  if(!gitDir) throw new Error('The Directory "' + cd + '" is not a git repo.');

  // If hooks directory can't be found, create it
  if(!path.existsSync(hookDir)) fs.mkdirSync(hookDir);

  // If hookFile exists check if it's ours and if theres a force option, rewrite it
  if(path.existsSync(hookFile)) {
    fs.readFile(hookFile, 'utf8', function(err, content) {
      if(err) throw err;

      // If force option is given write the hook
      if(options.force) {
        exports.writeHook();
      }
      // Check if it's ours then exit
      else {
        if(content === hookContent) {
          console.log('Auto NPM is already installed for "' + cd + '"');
          process.exit(0);
        } else {
          console.log('There is a Git hook that conflicts with Auto NPM, please delete "' +
            hookFile +
            '" if you\'d like to use Auto NPM.');
          process.exit(1);
        }
      }
    });
  } else exports.writeHook();
};

//
// Remove the hook file
exports.disable = function(options) {
  options = options || {};

  if(path.existsSync(hookFile)) {
    // If force option is given then delete it no matter what
    if(options.force) {
      exports.deleteHook();
    }
    // Delete file if it's our hook file
    else {
      fs.readFile(hookFile, 'utf8', function(err, content) {
        if(content === hookContent) {
          fs.open(hookFile, 'w', function(err) {
            if(err) throw err;

            fs.unlinkSync(hookFile);
          });

          console.log('Auto NPM has been disabled for "' + cd + '"');
        }
      });
    }
  } else console.log("Auto NPM is not enabled for this repo, so there's nothing to do.");
};

//
// Updated NPM packages
exports.update = function() {
  console.log('Test');
};
