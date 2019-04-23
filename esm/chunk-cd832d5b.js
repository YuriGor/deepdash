import _merge from 'lodash/merge';
import _isArray from './isArray.js';
import _isObject from 'lodash/isObject';
import { a as eachDeepDeps } from './chunk-e6b54344.js';
import { a as deps$1 } from './chunk-a813a230.js';
import { a as condenseDeepDeps } from './chunk-e9df2a61.js';
import _clone from 'lodash/clone';
import { a as existsDeps } from './chunk-82c13228.js';
import _cloneDeep from 'lodash/cloneDeep';
import _each from 'lodash/each';
import _eachRight from 'lodash/eachRight';
import _has from 'lodash/has';
import _set from 'lodash/set';
import _unset from 'lodash/unset';
import _isPlainObject from 'lodash/isPlainObject';
import _iteratee from 'lodash/iteratee';
import { a as deps$2 } from './chunk-5d77fba7.js';

var deps = _merge(
  {
    merge: _merge,
    clone: _clone,
    cloneDeep: _cloneDeep,
    isArray: _isArray,
    isObject: _isObject,
    each: _each,
    eachRight: _eachRight,
    has: _has,
    set: _set,
    unset: _unset,
    isPlainObject: _isPlainObject,
    iteratee: _iteratee,
  },
  eachDeepDeps,
  deps$1,
  deps$2,
  condenseDeepDeps,
  existsDeps
);

export { deps as a };
