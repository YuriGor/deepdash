import getPathToString from './../getPathToString';
import getHasChildren from './getHasChildren';

export default function getIterate(_) {
  const pathToString = getPathToString(_);
  const hasChildren = getHasChildren(_);
  const _each = _.each || _.forArray;
  function iterate({
    value,
    callback,
    options,
    key,
    path,
    strPath,
    depth = 0,
    parent,
    parents = [],
    obj,
    childrenPath,
    strChildrenPath,
  }) {
    if (options['break']) return;
    const currentObj = {
      value,
      key,
      path:
        options.pathFormat == 'array' ? path : strPath || pathToString(path),
      parent,
    };

    const currentParents = [...parents, currentObj];
    let isCircular;
    let circularParentIndex = undefined;
    let circularParent = undefined;
    if (options.checkCircular) {
      if (_.isObject(value) && !_.isEmpty(value)) {
        circularParentIndex = -1;
        let i = parents.length;
        while (i--) {
          if (parents[i].value === value) {
            circularParentIndex = i;
            break;
          }
        }

        circularParent = parents[circularParentIndex] || null;
      } else {
        circularParentIndex = -1;
        circularParent = null;
      }
      isCircular = circularParentIndex !== -1;
    }
    const isLeaf =
      !_.isObject(value) ||
      _.isEmpty(value) ||
      isCircular ||
      (options.childrenPath !== undefined &&
        !hasChildren(value, options.childrenPath));
    const needCallback =
      (depth || options.includeRoot) && (!options.leavesOnly || isLeaf);

    if (needCallback) {
      var context = {
        path: currentObj.path,
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
          options.pathFormat == 'array' ? childrenPath : strChildrenPath;
        context.childrenPath = currentObj.childrenPath;
      }
      try {
        var res = callback(value, key, parent && parent.value, context);
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
        const forChildren = function(children, cp, scp) {
          if (children && _.isObject(children)) {
            _.forOwn(children, function(childValue, childKey) {
              const childPath = [...(path || []), ...(cp || []), childKey];
              const strChildPath =
                options.pathFormat == 'array'
                  ? pathToString([childKey], strPath || '', scp || '')
                  : undefined;
              iterate({
                value: childValue,
                callback,
                options,
                key: childKey,
                path: childPath,
                strPath: strChildPath,
                depth: depth + 1,
                parent: currentObj,
                parents: currentParents,
                obj,
                childrenPath: cp,
                strChildrenPath: scp,
              });
            });
          }
        };

        if (!depth && options.rootIsChildren) {
          if (Array.isArray(value)) {
            forChildren(value);
          } else {
            _.forOwn(value, function(childValue, childKey) {
              iterate({
                value: childValue,
                callback,
                options,
                key: childKey,
                path: [childKey],
                strPath: pathToString([childKey]),
                depth: depth + 1,
                parent: currentObj,
                parents: currentParents,
                obj,
              });
            });
          }
        } else {
          _each(options.childrenPath, function(cp, i) {
            const children = _.get(value, cp);
            forChildren(children, cp, options.strChildrenPath[i]);
          });
        }
      } else {
        _.forOwn(value, function(childValue, childKey) {
          if (Array.isArray(value)) {
            if (childValue === undefined && !(childKey in value)) {
              return; //empty slot
            }
          }

          const childPath = [...(path || []), childKey];
          const strChildPath =
            options.pathFormat == 'array'
              ? pathToString([childKey], strPath || '')
              : undefined;

          iterate({
            value: childValue,
            callback,
            options,
            key: childKey,
            path: childPath,
            strPath: strChildPath,
            depth: depth + 1,
            parent: currentObj,
            parents: currentParents,
            obj,
          });
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
