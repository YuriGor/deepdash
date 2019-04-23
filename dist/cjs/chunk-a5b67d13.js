'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __chunk_2 = require('./chunk-6127be9d.js');
var _toPath = _interopDefault(require('lodash/toPath'));
var _get = _interopDefault(require('lodash/get'));
var _clone = _interopDefault(require('lodash/clone'));

var deps = {
  isArray: __chunk_2._isArray,
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

exports.existsDeps = deps;
exports.getExists = getExists;
