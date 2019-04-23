import _isArray from './own/isArray';
import _clone from 'lodash-es/clone';
import _toPath from 'lodash-es/toPath';
import _get from 'lodash-es/get';

var deps = {
  isArray: _isArray,
  clone: _clone,
  toPath: _toPath,
  get: _get,
};

export default deps;
