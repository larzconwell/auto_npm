//
// Dependencies
var fs   = require('fs')
  , path = require('path');

//
// Vars
var cd       = process.cwd()
  , hookDir  = path.join(cd, '.git', 'hooks')
  , hookFile = path.join(hookDir, 'post-commit')
  , hookContent = [
      '#!/bin/sh'
    , 'exec auto_npm --update'
    , ''
  ].join('\n');

exports.enable = function() {
  var gitDir;

  // Throw error if no .git directory is present
  gitDir = path.existsSync(path.join(cd, '.git'));
  if(!gitDir) throw new Error('The Directory "' + cd + '" is not a git repo.');

  // If hooks directory can't be found, create it
  if(!path.existsSync(hookDir)) fs.mkdirSync(hookDir);

  // If post-commit hook already exists, throw error
  if(path.existsSync(hookFile)) {
    fs.readFile(hookFile, 'utf8', function(err, content) {
      if(content === hookContent) {
        console.log('Auto NPM is already installed for "' + cd + '"');
        process.exit(0);
      } else {
        console.log('There is a Git hook that conflicts with Auto NPM, please delete "' +
        hookFile +
        '" if you\'d like to use Auto NPM.');
        process.exit(1);
      }
    });
  } else {
    fs.writeFile(hookFile, hookContent, 'utf8', function(err) {
      if(err) throw err;

      fs.chmodSync(hookFile, 0755);
      console.log('Auto NPM is enabled in "' + cd + '". To disable just do `auto_npm -d`');
    });
  }
};

exports.disable = function() {
  if(path.existsSync(hookFile)) {
    // Only delete the Git hook if it's our hook
    fs.readFile(hookFile, 'utf8', function(err, content) {
      if(content === hookContent) {
        fs.open(hookFile, 'w', function(err) {
          if(err) throw err;

          fs.unlinkSync(hookFile);
        });

        console.log('Auto NPM has been disabled for "' + cd + '"');
      }
    });
  } else {
    console.log("Auto NPM is not enabled for this repo, so there's nothing to do.");
  }
};

exports.update = function() {
  console.log('updating NPM package');
};
