'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getCondense = require('./getCondense.js');

/* build/tpl */

function addCondense(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense(), !getCondense.notChainable);
}

module.exports = addCondense;
