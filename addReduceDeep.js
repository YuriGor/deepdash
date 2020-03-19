'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getReduceDeep = require('./getReduceDeep.js');

/* build/tpl */

function addReduceDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_), !getReduceDeep.notChainable);
}

module.exports = addReduceDeep;
