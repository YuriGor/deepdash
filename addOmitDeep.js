'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getOmitDeep = require('./getOmitDeep.js');

function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn.default(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_));
}

module.exports = addOmitDeep;
