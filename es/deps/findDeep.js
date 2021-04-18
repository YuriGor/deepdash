import _merge from 'lodash-es/merge.js';
import _cloneDeep from 'lodash-es/cloneDeep.js';
import _iteratee from 'lodash-es/iteratee.js';
import eachDeepDeps from './eachDeep.js';

var deps = _merge(
  {
    iteratee: _iteratee,
    cloneDeep: _cloneDeep,
    merge: _merge,
  },
  eachDeepDeps
);

export default deps;
