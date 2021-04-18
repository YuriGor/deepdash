import _merge from 'lodash-es/merge.js';
import _iteratee from 'lodash-es/iteratee.js';

import reduceDeepDeps from './reduceDeep.js';

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  reduceDeepDeps
);

export default deps;
