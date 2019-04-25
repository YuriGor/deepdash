import _merge from 'lodash-es/merge';
import _iteratee from 'lodash-es/iteratee';

import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  eachDeepDeps
);

export default deps;
