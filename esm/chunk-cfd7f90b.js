import _merge from 'lodash/merge';
import _isArray from './isArray.js';
import _isString from 'lodash/isString';
import _toPath from 'lodash/toPath';
import { a as deps$1 } from './chunk-a813a230.js';
import _isEqual from 'lodash/isEqual';
import _takeRight from 'lodash/takeRight';

var deps = _merge(
  {
    isString: _isString,
    isArray: _isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
  },
  deps$1
);

export { deps as a };
