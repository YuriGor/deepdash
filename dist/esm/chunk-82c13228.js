import _isArray from './isArray.js';
import _toPath from 'lodash/toPath';
import _get from 'lodash/get';
import _clone from 'lodash/clone';

var deps = {
  isArray: _isArray,
  clone: _clone,
  toPath: _toPath,
  get: _get,
};

export { deps as a };
