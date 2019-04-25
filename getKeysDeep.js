'use strict';

var getPaths = require('./getPaths.js');

function getKeysDeep(_) {
  return getPaths(_);
}

module.exports = getKeysDeep;
