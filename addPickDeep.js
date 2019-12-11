'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPickDeep = require('./getPickDeep.js');

function addPickDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_));
}

module.exports = addPickDeep;
