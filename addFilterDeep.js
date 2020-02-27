'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFilterDeep = require('./getFilterDeep.js');

function addFilterDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_));
}

module.exports = addFilterDeep;
