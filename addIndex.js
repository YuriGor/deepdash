'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getIndex = require('./getIndex.js');

/* build/tpl */

function addIndex(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('index', getIndex(_), !getIndex.notChainable);
}

module.exports = addIndex;
