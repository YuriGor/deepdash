import _merge from 'lodash-es/merge.js';
import _clone from 'lodash-es/clone.js';
import _cloneDeep from 'lodash-es/cloneDeep.js';
import _isObject from 'lodash-es/isObject.js';
import _each from 'lodash-es/each.js';
import _eachRight from 'lodash-es/eachRight.js';
import _has from 'lodash-es/has.js';
import _set from 'lodash-es/set.js';
import _unset from 'lodash-es/unset.js';
import _isPlainObject from 'lodash-es/isPlainObject.js';
import _iteratee from 'lodash-es/iteratee.js';
import _get from 'lodash-es/get.js';
import eachDeepDeps from './eachDeep.js';
import condenseDeepDeps from './condenseDeep.js';

var deps = _merge(
  {
    merge: _merge,
    clone: _clone,
    cloneDeep: _cloneDeep,
    isObject: _isObject,
    each: _each,
    eachRight: _eachRight,
    has: _has,
    set: _set,
    unset: _unset,
    isPlainObject: _isPlainObject,
    iteratee: _iteratee,
    get: _get,
  },
  eachDeepDeps,
  condenseDeepDeps
);

export default deps;
