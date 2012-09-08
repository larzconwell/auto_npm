//
// Deps
var fs   = require('fs')
  , path = require('path');

//
// Vars
var cwd = process.cwd();

//
// Compatibility for 0.6 - 0.8
exports.existsSync = (typeof fs.existsSync === 'function') ? fs.existsSync : path.existsSync;

//
// Kill the process with the given exit code and print the message
exports.kill = function (message, code) {
  if (!message) {
    message = '';
  }
  if ((typeof code === 'undefined') || code === null) {
    code = 1;
  }

  console.log(message);
  process.exit(code);
};

//
// Check if the current directory is a git repo
exports.isGitRepo = function () {
  var gitDir = path.join(cwd, '.git');

  if (exports.existsSync(gitDir)) {
    return true;
  }

  return false;
}