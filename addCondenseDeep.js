'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getCondenseDeep = require('./getCondenseDeep.js');

//console.log('getCondenseDeep',getCondenseDeep.notChainable);
function addCondenseDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_), !getCondenseDeep.notChainable);
}

module.exports = addCondenseDeep;
