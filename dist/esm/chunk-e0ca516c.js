import _merge from 'lodash-es/merge';
import { a as _isArray } from './chunk-7273d013.js';
import _isString from 'lodash-es/isString';
import _toPath from 'lodash-es/toPath';
import { a as deps$1, b as getPathToString } from './chunk-7536e034.js';
import _isEqual from 'lodash-es/isEqual';
import _takeRight from 'lodash-es/takeRight';

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

function getPathMatches(_) {
  var pathToString = getPathToString(_);
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

export { deps as a, getPathMatches as b };
