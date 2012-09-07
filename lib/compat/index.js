var fs   = require('fs')
  , path = require('path');

exports.existsSync = (typeof fs.existsSync === 'function') ? fs.existsSync : path.existsSync;
