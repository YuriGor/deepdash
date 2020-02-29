'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getSomeDeep = require('./getSomeDeep.js');

//console.log('getSomeDeep',getSomeDeep.notChainable);
function addSomeDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_), !getSomeDeep.notChainable);
}

module.exports = addSomeDeep;
