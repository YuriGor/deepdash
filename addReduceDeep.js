'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getReduceDeep = require('./getReduceDeep.js');

function addReduceDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_));
}

module.exports = addReduceDeep;
