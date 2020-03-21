import _merge from 'lodash-es/merge';
import _iteratee from 'lodash-es/iteratee';
import _isArray from './own/isArray';
import _isObject from './own/isObject';
import _clone from 'lodash-es/clone';
import _set from 'lodash-es/set';
import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    iteratee: _iteratee,
    isArray: _isArray,
    isObject: _isObject,
    clone: _clone,
    set: _set,
  },
  eachDeepDeps
);

export default deps;
