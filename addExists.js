'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getExists = require('./getExists.js');

function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), false);
}

module.exports = addExists;
