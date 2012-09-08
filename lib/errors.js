//
// Deps
var utils = require('./utils');

//
// Vars
var cwd = process.cwd();

//
// Git error
exports.gitError = function () {
  utils.kill('The directory ' + cwd + ' is not a Git repo.', 1)
};

//
// Deprecation error
exports.deprecationError = function (msg) {
  if (!msg) {
    msg = '';
  }

  console.log('Deprecation: ' + msg);
};