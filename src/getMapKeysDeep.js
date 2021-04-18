import getEachDeep from './getEachDeep.js';
import getPathToString from './getPathToString.js';

export default function getMapKeysDeep(_) {
  const eachDeep = getEachDeep(_);
  const pathToString = getPathToString(_);
  function mapKeysDeep(obj, iteratee, options = {}) {
    iteratee = _.iteratee(iteratee);
    options.cloneDeep = options.cloneDeep || _.cloneDeep;
    options.callbackAfterIterate = false;
    const newPaths = [];

    eachDeep(
      obj,
      function (value, key, parent, context) {
        if (key === undefined) {
          return;
        }
        const newKey = iteratee(value, key, parent, context) + '';
        if (newKey === key) {
          return;
        }
        const oldPath = context.path;
        const oldPathStr =
          options.pathFormat === 'array' ? JSON.stringify(oldPath) : oldPath;
        const newPath =
          options.pathFormat === 'array'
            ? [
                ...(context.parent.path || []),
                ...(context.childrenPath || []),
                newKey,
              ]
            : pathToString([newKey], context.parent.path, context.childrenPath);
        const newPathStr =
          options.pathFormat === 'array' ? JSON.stringify(newPath) : newPath;
        if (!newPaths[context.depth - 1]) {
          newPaths[context.depth - 1] = [];
        }
        newPaths[context.depth - 1].push({
          oldPath,
          oldPathStr,
          newPath,
          newPathStr,
        });
      },
      options
    );
    const res = options.cloneDeep(obj);

    let d = newPaths.length;
    while (d--) {
      if (!newPaths[d]) {
        continue;
      }
      const overwritten = {};
      newPaths[d].forEach(({ oldPath, oldPathStr, newPath, newPathStr }) => {
        let value;
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
    }
    return res;
  }
  return mapKeysDeep;
}
