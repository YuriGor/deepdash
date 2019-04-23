'use strict';

var __chunk_1 = require('./chunk-46374642.js');
var getExists = require('./getExists.js');

function addExists(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), false);
}

module.exports = addExists;
