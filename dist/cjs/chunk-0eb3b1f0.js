'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __chunk_1 = require('./chunk-069d3b9a.js');
var _merge = _interopDefault(require('lodash/merge'));
var __chunk_2 = require('./chunk-6127be9d.js');
var __chunk_3 = require('./chunk-c93e6c1a.js');

var deps = _merge(
  {
    merge: _merge,
    isArray: __chunk_2._isArray,
    forArray: __chunk_3.forArray,
  },
  __chunk_1.condenseDeps,
  __chunk_3.eachDeepDeps
);

function getCondenseDeep(_) {
  var eachDeep = __chunk_3.getEachDeep(_);
  var condense = __chunk_1.getCondense(_);
  var _each = _.each || _.forArray;
  function condenseDeep(obj, options) {
    options = _.merge(
      {
        checkCircular: false,
      },
      options || {}
    );
    var eachDeepOptions = {
      checkCircular: options.checkCircular,
    };
    var arrays = [];
    //console.log('condenseDeep → eachDeep');
    eachDeep(
      obj,
      function(value, key, parent, context) {
        if (!context.isCircular && _.isArray(value)) arrays.push(value);
      },
      eachDeepOptions
    );
    if (_.isArray(obj)) arrays.push(obj);
    _each(arrays, condense);
    return obj;
  }
  return condenseDeep;
}

exports.condenseDeepDeps = deps;
exports.getCondenseDeep = getCondenseDeep;
