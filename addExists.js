'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getExists = require('./getExists.js');

/* build/tpl */

function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
}

module.exports = addExists;
