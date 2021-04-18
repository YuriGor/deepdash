import _merge from 'lodash-es/merge.js';
import _iteratee from 'lodash-es/iteratee.js';
import _isObject from 'lodash-es/isObject.js';
import _clone from 'lodash-es/clone.js';
import _set from 'lodash-es/set.js';
import eachDeepDeps from './eachDeep.js';

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
