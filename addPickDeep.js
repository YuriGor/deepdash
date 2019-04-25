'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getPickDeep = require('./getPickDeep.js');

function addPickDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_));
}

module.exports = addPickDeep;
