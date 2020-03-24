import _merge from 'lodash-es/merge';
import _has from 'lodash-es/has';
import _unset from 'lodash-es/unset';
import _cloneDeep from 'lodash-es/cloneDeep';

import mapValuesDeepDeps from './mapValuesDeep';

var deps = _merge(
  {
    cloneDeep: _cloneDeep,
    has: _has,
    unset: _unset,
  },
  mapValuesDeepDeps
);

export default deps;
