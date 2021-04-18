import _merge from 'lodash-es/merge.js';
import _has from 'lodash-es/has.js';
import _unset from 'lodash-es/unset.js';
import _cloneDeep from 'lodash-es/cloneDeep.js';

import mapValuesDeepDeps from './mapValuesDeep.js';

var deps = _merge(
  {
    cloneDeep: _cloneDeep,
    has: _has,
    unset: _unset,
  },
  mapValuesDeepDeps
);

export default deps;
