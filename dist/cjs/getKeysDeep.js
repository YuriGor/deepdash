'use strict';

require('./getPathToString.js');
require('./getEachDeep.js');
var getPaths = require('./getPaths.js');

function getKeysDeep(_) {
  return getPaths(_);
}

module.exports = getKeysDeep;
