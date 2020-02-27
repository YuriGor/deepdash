'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getCondense = require('./getCondense.js');

function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense());
}

module.exports = addCondense;
