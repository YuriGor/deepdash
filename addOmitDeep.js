'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getOmitDeep = require('./getOmitDeep.js');

/* build/tpl */

function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_), !getOmitDeep.notChainable);
}

module.exports = addOmitDeep;
