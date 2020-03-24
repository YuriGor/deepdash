import _merge from 'lodash-es/merge';
import _forArray from './own/forArray';

import condenseDeps from './condense';
import eachDeepDeps from './eachDeep';

var deps = _merge(
  {
    merge: _merge,
    forArray: _forArray,
  },
  condenseDeps,
  eachDeepDeps
);

export default deps;
