'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getSomeDeep = require('./getSomeDeep.js');

/* build/tpl */

function addSomeDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
}

module.exports = addSomeDeep;
