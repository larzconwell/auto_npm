#!/usr/bin/env node

var argv = require('optimist').argv,
    pkg = require('./package'),
    autoNPM = require('./index'),
    path = require('path'),
    fs = require('fs'),
    cwd = process.cwd(),
    force,
    cmd,
    help;

help = [
  pkg.name + ' ' + pkg.version,
  '',
  'Usage:',
  '  auto_npm [options] <command>',
  '',
  'Commands:',
  '  enable   # Enable Auto NPM in the current repo',
  '  disable  # Disable Auto NPM in the current repo',
  '  update   # Update the NPM package in the current repo and create a Git tag',
  '',
  'Options:',
  '  --force, -f  # Force Auto NPM to overwrite any conflicting Git hooks',
  ''
].join('\n');

if (argv.help || argv.h || argv._.length === 0) {
  console.log(help)
  process.exit(0);
}

fs.exists(path.join(cwd, '.git'), function (exists) {
  if (!exists) {
    process.stderr.write("The current directory is not a Git repo\n");
    process.exit(1);
  }
  force = argv.force || argv.f;

  switch (argv._[0]) {
    case 'update':
      autoNPM.update(force);
      break;
    case 'disable':
      autoNPM.disable();
      break;
    case 'enable':
      autoNPM.enable(force);
      break;
    default:
      process.stderr.write("Unknown command " + argv._[0] +"\n");
      process.exit(1);
  }
});
