import _merge from 'lodash-es/merge';
import _iteratee from 'lodash-es/iteratee';
import _isObject from 'lodash-es/isObject';
import _clone from 'lodash-es/clone';
import _set from 'lodash-es/set';
import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    iteratee: _iteratee,
    isObject: _isObject,
    clone: _clone,
    set: _set,
  },
  eachDeepDeps
);

export default deps;
