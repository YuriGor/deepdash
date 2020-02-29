'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getExists = require('./getExists.js');

//console.log('getExists',getExists.notChainable);
function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
}

module.exports = addExists;
