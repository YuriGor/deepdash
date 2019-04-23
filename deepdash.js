'use strict';

require('./chunk-27bec025.js');
require('./getCondense.js');
var addCondense = require('./addCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
require('./getCondenseDeep.js');
var addCondenseDeep = require('./addCondenseDeep.js');
var addEachDeep = require('./addEachDeep.js');
require('./getExists.js');
var addExists = require('./addExists.js');
require('./getObtain.js');
require('./getFilterDeep.js');
var addFilterDeep = require('./addFilterDeep.js');
var addForEachDeep = require('./addForEachDeep.js');
require('./getIndex.js');
var addIndex = require('./addIndex.js');
require('./getPaths.js');
var addKeysDeep = require('./addKeysDeep.js');
var addObtain = require('./addObtain.js');
require('./getPathMatches.js');
require('./getOmitDeep.js');
var addOmitDeep = require('./addOmitDeep.js');
var addPathMatches = require('./addPathMatches.js');
var addPathToString = require('./addPathToString.js');
var addPaths = require('./addPaths.js');
require('./getPickDeep.js');
var addPickDeep = require('./addPickDeep.js');

function apply(_) {
  addPathToString(_);
  addEachDeep(_);
  addForEachDeep(_);
  addIndex(_);
  addPaths(_);
  addKeysDeep(_);
  addExists(_);
  addCondense(_);
  addCondenseDeep(_);
  addFilterDeep(_);
  addOmitDeep(_);
  addPickDeep(_);
  addObtain(_);
  addPathMatches(_);
  return _;
}

module.exports = apply;
