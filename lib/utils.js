var fs   = require('fs')
  , path = require('path');

var cwd = process.cwd();

// Kill the process with the given exit code and print the message
exports.kill = function (message, code) {
  message = message || '';

  if ((typeof code === 'undefined') || code === null) {
    code = 1;
  }

  console.log(message);
  process.exit(code);
};

// Check if the current directory is a git repo
exports.isGitRepo = function () {
  var gitDir = path.join(cwd, '.git');

  if (fs.existsSync(gitDir)) {
    return true;
  }

  return false;
}
