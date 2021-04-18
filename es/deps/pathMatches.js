import _merge from 'lodash-es/merge.js';
import _isString from 'lodash-es/isString.js';
import _toPath from 'lodash-es/toPath.js';
import _isEqual from 'lodash-es/isEqual.js';
import _takeRight from 'lodash-es/takeRight.js';
import _cloneDeep from 'lodash-es/cloneDeep.js';

import pathToStringDeps from './pathToString.js';

var deps = _merge(
  {
    isString: _isString,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
    cloneDeep: _cloneDeep,
  },
  pathToStringDeps
);

export default deps;
