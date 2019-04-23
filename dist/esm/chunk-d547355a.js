import { a as _isArray } from './chunk-7273d013.js';
import _toPath from 'lodash-es/toPath';
import _get from 'lodash-es/get';
import _clone from 'lodash-es/clone';

var deps = {
  isArray: _isArray,
  clone: _clone,
  toPath: _toPath,
  get: _get,
};

function getExists(_) {
  function exists(obj, path) {
    path = _.isArray(path) ? _.clone(path) : _.toPath(path);
    var key = path.pop();
    var parent = path.length ? _.get(obj, path) : obj;
    return parent !== undefined && key in parent;
  }
  return exists;
}

export { getExists as a, deps as b };
