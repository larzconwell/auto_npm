#!/usr/bin/env node

//
// Deps
var path    = require('path')
  , autoNPM = require('../lib/auto_npm')
  , pkg     = require('../package');

//
// Vars
var cwd     = process.cwd()
  , args    = process.argv.slice(2)
  , enable  = false
  , update  = false
  , disable = false
  , force   = false
  , help    = ''
  , arg     = '';

//
// Help dialog
help = [
    pkg.name + ' ' + pkg.version
  , ''
  , 'Description'
  , '  ' + pkg.description
  , ''
  , 'Usage'
  , '  auto_npm <command> [options]'
  , ''
  , '  When you make a commit that manually changes the version'
  , '    it will create a Git tag and publish it to NPM.'
  , '  If you make a commit that has [publish] in the subject'
  , '    it will increment your patch number, create'
  , '    a Git tag and publish it to NPM.'
  , ''
  , 'Commands'
  , '  enable  # Enable Auto NPM in the current repo'
  , '  disable # Disable Auto NPM in the current repo'
  , '  update  # Update the NPM pkg and create Git tags for'
  , '            the current repo.'
  , ''
  , 'Options'
  , '  --force, -f # Force Auto NPM to overwrite any conflicting'
  , '                Git hooks'
  , '  --help, -h  # Display this help dialog'
  , ''
].join('\n');

// Show help dialog if no arguments are given
if (args.length <= 0) {
  autoNPM.utils.kill(help, 0);
}

//
// Get CLI arguments
while (args.length) {
  arg = args.shift();

  switch (arg) {
  case '-h':
  case '--help':
    autoNPM.utils.kill(help, 0);
    break;
  case '-f':
  case '--force':
    force = true;
    break;
  case 'enable':
    enable = true;
    break;
  case 'disable':
    disable = true;
    break;
  case 'update':
    update = true;
    break;

  /*
   * Deprecated options
  */
  case '-e':
  case '--enable':
    autoNPM.errors.deprecationError('Enable option will be removed by 1.0 ' +
      'in favor of the enable command.');
    enable = true;
    break;
  case '-d':
  case '--disable':
    autoNPM.errors.deprecationError('Disable option will be removed by 1.0 ' +
      'in favor of the disable command.');
    disable = true;
    break;
  case '-u':
  case '--update':
    autoNPM.errors.deprecationError('Update option will be removed by 1.0 ' +
      'in favor of the update command.');
    update = true;
    break;

  default:
    console.log('Unknown argument ' + arg);
    break;
  }
}

// Kill with error if cwd is not a git repo
if (!autoNPM.utils.isGitRepo()) {
  autoNPM.utils.kill('The directory ' + cwd + ' is not a Git repo.', 1);
}

//
// Manage CLI commands
if (update) {
  autoNPM.update();
}

if (disable) {
  autoNPM.disable({force: force});
}

if (enable) {
  autoNPM.enable({force: force});
}