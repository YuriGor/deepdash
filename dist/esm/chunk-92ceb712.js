import { b as condenseDeps, a as getCondense } from './chunk-2a1edeff.js';
import _merge from 'lodash-es/merge';
import { a as _isArray } from './chunk-7273d013.js';
import { a as forArray, b as eachDeepDeps, c as getEachDeep } from './chunk-eaa89b2d.js';

var deps = _merge(
  {
    merge: _merge,
    isArray: _isArray,
    forArray: forArray,
  },
  condenseDeps,
  eachDeepDeps
);

function getCondenseDeep(_) {
  var eachDeep = getEachDeep(_);
  var condense = getCondense(_);
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

export { getCondenseDeep as a, deps as b };
