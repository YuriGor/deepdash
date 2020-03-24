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
var addMapKeysDeep = require('./addMapKeysDeep.js');
var addMapValuesDeep = require('./addMapValuesDeep.js');
var addOmitDeep = require('./addOmitDeep.js');
var addPathMatches = require('./addPathMatches.js');
var addPathToString = require('./addPathToString.js');
var addPaths = require('./addPaths.js');
var addPickDeep = require('./addPickDeep.js');
var addReduceDeep = require('./addReduceDeep.js');
var addSomeDeep = require('./addSomeDeep.js');

/* build/tpl */

function apply(_) {
  addCondense(_);
  addCondenseDeep(_);
  addEachDeep(_);
  addExists(_);
  addFilterDeep(_);
  addFindDeep(_);
  addFindPathDeep(_);
  addFindValueDeep(_);
  addForEachDeep(_);
  addIndex(_);
  addKeysDeep(_);
  addMapDeep(_);
  addMapKeysDeep(_);
  addMapValuesDeep(_);
  addOmitDeep(_);
  addPathMatches(_);
  addPathToString(_);
  addPaths(_);
  addPickDeep(_);
  addReduceDeep(_);
  addSomeDeep(_);

  return _;
}

module.exports = apply;
