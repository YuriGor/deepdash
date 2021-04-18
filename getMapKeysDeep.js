'use strict';

var getPathToString = require('./getPathToString.js');
var getEachDeep = require('./getEachDeep.js');

function getMapKeysDeep(_) {
  var eachDeep = getEachDeep(_);
  var pathToString = getPathToString(_);
  function mapKeysDeep(obj, iteratee, options) {
    if ( options === void 0 ) options = {};

    iteratee = _.iteratee(iteratee);
    options.cloneDeep = options.cloneDeep || _.cloneDeep;
    options.callbackAfterIterate = false;
    var newPaths = [];

    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (key === undefined) {
          return;
        }
        var newKey = iteratee(value, key, parent, context) + '';
        if (newKey === key) {
          return;
        }
        var oldPath = context.path;
        var oldPathStr =
          options.pathFormat === 'array' ? JSON.stringify(oldPath) : oldPath;
        var newPath =
          options.pathFormat === 'array'
            ? (context.parent.path || []).concat( (context.childrenPath || []),
                [newKey] )
            : pathToString([newKey], context.parent.path, context.childrenPath);
        var newPathStr =
          options.pathFormat === 'array' ? JSON.stringify(newPath) : newPath;
        if (!newPaths[context.depth - 1]) {
          newPaths[context.depth - 1] = [];
        }
        newPaths[context.depth - 1].push({
          oldPath: oldPath,
          oldPathStr: oldPathStr,
          newPath: newPath,
          newPathStr: newPathStr,
        });
      },
      options
    );
    var res = options.cloneDeep(obj);

    var d = newPaths.length;
    var loop = function () {
      if (!newPaths[d]) {
        return;
      }
      var overwritten = {};
      newPaths[d].forEach(function (ref) {
        var oldPath = ref.oldPath;
        var oldPathStr = ref.oldPathStr;
        var newPath = ref.newPath;
        var newPathStr = ref.newPathStr;

        var value;
        if (Object.prototype.hasOwnProperty.call(overwritten, oldPathStr)) {
          value = overwritten[oldPathStr];
          delete overwritten[oldPathStr];
        } else {
          value = _.get(res, oldPath);
          if (value === undefined && !_.has(res, oldPath)) {
            return;
          }
          _.unset(res, oldPath);
        }
        if (
          _.has(res, newPath) &&
          !Object.prototype.hasOwnProperty.call(overwritten, newPathStr)
        ) {
          overwritten[newPathStr] = _.get(res, newPath);
        }
        _.set(res, newPath, value);
      });
    };

    while (d--) loop();
    return res;
  }
  return mapKeysDeep;
}

module.exports = getMapKeysDeep;
