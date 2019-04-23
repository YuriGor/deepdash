'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_2 = require('./chunk-6127be9d.js');
var _isString = _interopDefault(require('lodash/isString'));
var _toPath = _interopDefault(require('lodash/toPath'));
var __chunk_4 = require('./chunk-40280356.js');
var _isEqual = _interopDefault(require('lodash/isEqual'));
var _takeRight = _interopDefault(require('lodash/takeRight'));

var deps = _merge(
  {
    isString: _isString,
    isArray: __chunk_2._isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
  },
  __chunk_4.deps
);

function getPathMatches(_) {
  var pathToString = __chunk_4.getPathToString(_);
  function pathMatches(path, paths) {
    var pathString;
    var pathArray;
    if (_.isString(path)) {
      pathString = path;
    } else {
      pathArray = path;
    }
    if (!_.isArray(paths)) {
      paths = [paths];
    }
    for (var i = 0; i < paths.length; i++) {
      if (_.isString(paths[i])) {
        paths[i] = _.toPath(paths[i]);
      }
      if (_.isArray(paths[i])) {
        if (pathArray === undefined) {
          pathArray = _.toPath(pathString);
        }
        if (
          pathArray.length >= paths[i].length &&
          _.isEqual(_.takeRight(pathArray, paths[i].length), paths[i])
        ) {
          // console.log('path matched');
          return paths[i];
        }
      } else if (paths[i] instanceof RegExp) {
        if (pathString === undefined) {
          pathString = pathToString(path);
        }
        if (paths[i].test(pathString)) {
          // console.log('regex matched', paths[i]);
          return paths[i];
        }
      } else {
        throw new Error(
          'To match path use only string/regex or array of them.'
        );
      }
    }
    // console.log('matched nothing');
    return false;
  }
  return pathMatches;
}

exports.deps = deps;
exports.getPathMatches = getPathMatches;
