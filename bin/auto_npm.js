#!/usr/bin/env node

var fs      = require('fs')
  , path    = require('path')
  , package = require('../package')
  , cd      = process.cwd()
  , args    = process.argv.slice(2)
  , enabled = false
  , gitDir
  , help
  , arg;

//
// Help dialog
help = [
    ''
  , package.name + ' ' + package.version
  , ''
  , 'Description'
  , '  ' + package.description
  , ''
  , 'Usage'
  , '  --enable, -e   # Enable Auto NPM in a git repo'
  , '  --disable, -d  # Disable Auto NPM in a git repo'
  , '  --help, -h     # Dipslay this help dialog'
].join('\n');

// Show help dialog if no args are given
if(args.length === 0) {
  console.log(help);
  process.exit(0);
}

//
// Get arguments
while(args.length) {
  arg = args.shift();

  switch(arg) {
    case '-h':
    case '--help':
      console.log(help);
      process.exit(0);
      break;
    case '-e':
    case '--enable':
      enabled = true;
      break;
    case '-d':
    case '--disable':
      enabled = false;
      break;
  }
}

//
// Check if directory is a Git repo
gitDir = path.existsSync(path.join(cd, '.git'));
if(!gitDir) throw new Error('The Directory "' + cd + '" is not a git repo.');

//
// Enable Auto NPM or disable it
if(enabled) {
  // Start watching for commits
} else {
  // Disable watching for commits
}
