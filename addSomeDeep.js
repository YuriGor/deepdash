'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getSomeDeep = require('./getSomeDeep.js');

function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_));
}

module.exports = addFindDeep;
