'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getOmitDeep = require('./getOmitDeep.js');

function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_));
}

module.exports = addOmitDeep;
