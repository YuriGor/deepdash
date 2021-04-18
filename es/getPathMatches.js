import getPathToString from './getPathToString.js';

export default function getPathMatches(_) {
  var pathToString = getPathToString(_);
  function pathMatches(path, paths) {
    var pathString;
    var pathArray;
    if (_.isString(path)) {
      pathString = path;
    } else {
      pathArray = path;
    }
    if (!Array.isArray(paths)) {
      paths = [paths];
    } else {
      paths = _.cloneDeep(paths);
    }
    for (var i = 0; i < paths.length; i++) {
      if (_.isString(paths[i])) {
        paths[i] = _.toPath(paths[i]);
      }
      if (Array.isArray(paths[i])) {
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

getPathMatches.notChainable = true;
