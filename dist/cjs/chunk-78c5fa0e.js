'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _get = _interopDefault(require('lodash/get'));

var deps = { get: _get };

function getObtain(_) {
  function obtain(obj, path) {
    if (path === undefined) {
      return obj;
    }
    return _.get(obj, path);
  }
  return obtain;
}

exports.deps = deps;
exports.getObtain = getObtain;
