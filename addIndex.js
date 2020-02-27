'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getIndex = require('./getIndex.js');

function addIndex(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('index', getIndex(_));
}

module.exports = addIndex;
