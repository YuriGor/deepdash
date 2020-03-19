'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFilterDeep = require('./getFilterDeep.js');

/* build/tpl */

function addFilterDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_), !getFilterDeep.notChainable);
}

module.exports = addFilterDeep;
