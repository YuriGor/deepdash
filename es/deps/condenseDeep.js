import _merge from 'lodash-es/merge.js';
import _forArray from './own/forArray.js';

import condenseDeps from './condense.js';
import eachDeepDeps from './eachDeep.js';

var deps = _merge(
  {
    merge: _merge,
    forArray: _forArray,
  },
  condenseDeps,
  eachDeepDeps
);

export default deps;
