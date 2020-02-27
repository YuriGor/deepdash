import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import _iteratee from 'lodash-es/iteratee';
import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    iteratee: _iteratee,
    cloneDeep: _cloneDeep,
    merge: _merge,
  },
  eachDeepDeps
);

export default deps;
