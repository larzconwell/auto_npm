var utils = require('./utils');

var cwd = process.cwd();

exports.gitError = function () {
  utils.kill('The directory ' + cwd + ' is not a Git repo.', 1);
}
