import getPathToString from './../getPathToString';
import getHasChildren from './getHasChildren';

export default function getIterate(_) {
  var pathToString = getPathToString(_);
  var hasChildren = getHasChildren(_);
  var _each = _.each || _.forArray;
  function iterate(
    value,
    callback,
    options,
    key,
    path,
    depth,
    parent,
    parents,
    obj,
    childrenPath
  ) {
    if (options['break']) return;
    var currentObj = {
      value: value,
      key: key,
      path: options.pathFormat == 'array' ? path : pathToString(path),
      parent: parent,
    };

    var currentParents = [...parents, currentObj];

    var isCircular = undefined;
    var circularParentIndex = undefined;
    var circularParent = undefined;
    if (options.checkCircular) {
      if (_.isObject(value) && !_.isEmpty(value)) {
        circularParentIndex = _.findIndex(parents, function(v) {
          return v.value === value;
        });
        circularParent = parents[circularParentIndex] || null;
      } else {
        circularParentIndex = -1;
        circularParent = null;
      }
      isCircular = circularParentIndex !== -1;
    }
    var res;
    var isLeaf =
      !_.isObject(value) ||
      _.isEmpty(value) ||
      isCircular ||
      (options.childrenPath !== undefined &&
        !hasChildren(value, options.childrenPath));
    var needCallback =
      (depth || options.includeRoot) && (!options.leavesOnly || isLeaf);
    // console.log('needCallback?', needCallback);
    if (needCallback) {
      var context = {
        path: options.pathFormat == 'array' ? path : pathToString(path),
        parent: parent,
        parents: parents,
        obj: obj,
        depth: depth,
        isCircular: isCircular,
        circularParent: circularParent,
        circularParentIndex: circularParentIndex,
        isLeaf: isLeaf,
        "break": () => {
          options['break'] = true;
          return false;
        },
      };
      if (options.childrenPath !== undefined) {
        currentObj.childrenPath =
          options.pathFormat == 'array'
            ? childrenPath
            : pathToString(childrenPath);
        context.childrenPath = currentObj.childrenPath;
      }
      try {
        res = callback(value, key, parent && parent.value, context);
      } catch (err) {
        if (err.message) {
          err.message += `
callback failed before deep iterate at:
${context.path}`;
        }
        throw err;
      }
    }
    if (
      !options['break'] &&
      res !== false &&
      !isCircular &&
      _.isObject(value)
    ) {
      if (options.childrenPath !== undefined) {
        function forChildren(children, cp) {
          if (children && _.isObject(children)) {
            _.forOwn(children, function(childValue, childKey) {
              var childPath = [...(path || []), ...(cp || []), childKey];

              iterate(
                childValue,
                callback,
                options,
                childKey,
                childPath,
                depth + 1,
                currentObj,
                currentParents,
                obj,
                cp
              );
            });
          }
        }

        if (!depth && options.rootIsChildren) {
          forChildren(value, undefined);
        } else {
          _each(options.childrenPath, function(cp) {
            var children = _.get(value, cp);
            forChildren(children, cp);
          });
        }
      } else {
        _.forOwn(value, function(childValue, childKey) {
          if (_.isArray(value)) {
            if (childValue === undefined && !(childKey in value)) {
              return; //empty slot
            }
          }

          var childPath = [...(path || []), childKey];

          iterate(
            childValue,
            callback,
            options,
            childKey,
            childPath,
            depth + 1,
            currentObj,
            currentParents,
            obj
          );
        });
      }
    }
    if (options.callbackAfterIterate && needCallback) {
      context.afterIterate = true;
      try {
        callback(value, key, parent && parent.value, context);
      } catch (err) {
        if (err.message) {
          err.message += `
callback failed after deep iterate at:
${context.path}`;
        }
        throw err;
      }
    }
  }
  return iterate;
}
