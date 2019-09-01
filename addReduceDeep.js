'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getReduceDeep = require('./getReduceDeep.js');

function addReduceDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn.default(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_));
}

module.exports = addReduceDeep;
