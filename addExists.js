'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getExists = require('./getExists.js');

function addExists(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('exists', getExists(_), false);
}

module.exports = addExists;
