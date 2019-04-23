import { a as _isArray } from './chunk-7273d013.js';
import _isString from 'lodash-es/isString';
import _reduce from 'lodash-es/reduce';

var deps = {
  isString: _isString,
  isArray: _isArray,
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

export { deps as a, getPathToString as b };
