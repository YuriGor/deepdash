import _merge from 'lodash-es/merge';

import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    merge: _merge,
  },
  eachDeepDeps
);

export default deps;
