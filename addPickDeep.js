'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPickDeep = require('./getPickDeep.js');

//console.log('getPickDeep',getPickDeep.notChainable);
function addPickDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_), !getPickDeep.notChainable);
}

module.exports = addPickDeep;
