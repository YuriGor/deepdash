'use strict';

var addCondense = require('./addCondense.js');
var addCondenseDeep = require('./addCondenseDeep.js');
var addEachDeep = require('./addEachDeep.js');
var addExists = require('./addExists.js');
var addFilterDeep = require('./addFilterDeep.js');
var addForEachDeep = require('./addForEachDeep.js');
var addIndex = require('./addIndex.js');
var addKeysDeep = require('./addKeysDeep.js');
var addMapDeep = require('./addMapDeep.js');
var addObtain = require('./addObtain.js');
var addOmitDeep = require('./addOmitDeep.js');
var addPathMatches = require('./addPathMatches.js');
var addPathToString = require('./addPathToString.js');
var addPaths = require('./addPaths.js');
var addPickDeep = require('./addPickDeep.js');
var addReduceDeep = require('./addReduceDeep.js');

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
  addReduceDeep(_);
  addMapDeep(_);
  return _;
}

module.exports = apply;
