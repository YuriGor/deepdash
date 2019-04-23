'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __chunk_2 = require('./chunk-6127be9d.js');
var _isString = _interopDefault(require('lodash/isString'));
var _reduce = _interopDefault(require('lodash/reduce'));

var deps = {
  isString: _isString,
  isArray: __chunk_2._isArray,
  reduce: _reduce,
};

var rxArrIndex = /^\d+$/;
var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;

function getPathToString(_) {
  function pathToString(path) {
    if (_.isString(path)) return path;
    if (!_.isArray(path)) return undefined;
    return _.reduce(
      path,
      function(accumulator, value) {
        if (rxArrIndex.test(value)) {
          return accumulator + '[' + value + ']';
        }
        if (rxVarName.test(value)) {
          return accumulator + (accumulator ? '.' : '') + value;
        }
        return (
          accumulator + '["' + value.toString().replace(/"/g, '\\"') + '"]'
        );
      },
      ''
    );
  }
  return pathToString;
}

exports.deps = deps;
exports.getPathToString = getPathToString;
