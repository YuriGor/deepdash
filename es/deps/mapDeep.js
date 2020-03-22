import _merge from 'lodash-es/merge';
import _iteratee from 'lodash-es/iteratee';

import reduceDeepDeps from './reduceDeep';

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  reduceDeepDeps
);

export default deps;
