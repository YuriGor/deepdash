'use strict';

var addCondense = require('./addCondense.js');
var addCondenseDeep = require('./addCondenseDeep.js');
var addEachDeep = require('./addEachDeep.js');
var addExists = require('./addExists.js');
var addFilterDeep = require('./addFilterDeep.js');
var addFindDeep = require('./addFindDeep.js');
var addFindPathDeep = require('./addFindPathDeep.js');
var addFindValueDeep = require('./addFindValueDeep.js');
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
var addSomeDeep = require('./addSomeDeep.js');

function apply(_) {
  addSomeDeep(_);
  addReduceDeep(_);
  addPickDeep(_);
  addPaths(_);
  addPathToString(_);
  addPathMatches(_);
  addOmitDeep(_);
  addObtain(_);
  addMapDeep(_);
  addKeysDeep(_);
  addIndex(_);
  addForEachDeep(_);
  addFindValueDeep(_);
  addFindPathDeep(_);
  addFindDeep(_);
  addFilterDeep(_);
  addExists(_);
  addEachDeep(_);
  addCondenseDeep(_);
  addCondense(_);

  return _;
}

module.exports = apply;
