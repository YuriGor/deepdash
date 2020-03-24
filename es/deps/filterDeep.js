import _merge from 'lodash-es/merge';
import _clone from 'lodash-es/clone';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';
import _each from 'lodash-es/each';
import _eachRight from 'lodash-es/eachRight';
import _has from 'lodash-es/has';
import _set from 'lodash-es/set';
import _unset from 'lodash-es/unset';
import _isPlainObject from 'lodash-es/isPlainObject';
import _iteratee from 'lodash-es/iteratee';
import _get from 'lodash-es/get';
import eachDeepDeps from './eachDeep';
import pathToStringDeps from './pathToString';
import condenseDeepDeps from './condenseDeep';
import existsDeps from './exists';

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
  pathToStringDeps,
  condenseDeepDeps,
  existsDeps
);

export default deps;
