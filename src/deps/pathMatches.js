import _merge from 'lodash-es/merge';
import _isString from 'lodash-es/isString';
import _toPath from 'lodash-es/toPath';
import _isEqual from 'lodash-es/isEqual';
import _takeRight from 'lodash-es/takeRight';
import _cloneDeep from 'lodash-es/cloneDeep';

import pathToStringDeps from './pathToString';

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
