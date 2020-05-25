import getPathToString from './../getPathToString';
import getHasChildren from './getHasChildren';

export default function getIterate(_) {
  const pathToString = getPathToString(_);
  const hasChildren = getHasChildren(_);
  const _each = _.each || _.forArray;

  function iterate(args) {
    while (args) {
      if (args.options['break']) break;

      defaults(args);

      const scope = getScope(args);

      var res = invokeCallback(args, scope);

      if (res !== false) {
        var nextLevel = getNextLevel(args, scope);
        _each(nextLevel, iterate);
      }

      invokeCallback(args, scope, true);
      break;
    }
  }

  return iterate;

  function defaults(args) {
    if (!args.depth) {
      args.depth = 0;
    }
    if (!args.parents) {
      args.parents = [];
    }
  }

  function getScope(args) {
    const scope = {
      currentObj: {
        value: args.value,
        key: args.key,
        path:
          args.options.pathFormat == 'array'
            ? args.path
            : args.strPath || pathToString(args.path),
        parent: args.parent,
      },

      circular: checkCircular(args.value, args.options, args.parents),
    };

    scope.isLeaf =
      !_.isObject(args.value) ||
      _.isEmpty(args.value) ||
      scope.circular.isCircular ||
      (args.options.childrenPath !== undefined &&
        !hasChildren(args.value, args.options.childrenPath));

    scope.needCallback =
      (args.depth || args.options.includeRoot) &&
      (!args.options.leavesOnly || scope.isLeaf);

    scope.currentParents = [...args.parents, scope.currentObj];

    if (scope.needCallback) {
      scope.context = {
        ...scope.circular,
        path: scope.currentObj.path,
        parent: args.parent,
        parents: args.parents,
        obj: args.obj,
        depth: args.depth,
        isLeaf: scope.isLeaf,
        "break": () => {
          args.options['break'] = true;
          return false;
        },
      };

      if (args.options.childrenPath !== undefined) {
        scope.currentObj.childrenPath =
          args.options.pathFormat == 'array'
            ? args.childrenPath
            : args.strChildrenPath;
        scope.context.childrenPath = scope.currentObj.childrenPath;
      }
    }
    return scope;
  }

  function invokeCallback(args, scope, afterIterate) {
    if (
      scope.needCallback &&
      (!afterIterate || args.options.callbackAfterIterate)
    ) {
      if (afterIterate) {
        scope.context.afterIterate = true;
      }
      try {
        return args.callback(
          args.value,
          args.key,
          args.parent && args.parent.value,
          scope.context
        );
      } catch (err) {
        if (err.message) {
          err.message +=
            '\ncallback failed ' +
            (afterIterate ? 'after' : 'before') +
            ' deep iterate at:\n' +
            scope.context.path;
        }
        throw err;
      }
    }
  }

  function checkCircular(value, options, parents) {
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
    return { isCircular, circularParentIndex, circularParent };
  }

  function getNextLevel(args, scope) {
    const nextLevel = [];
    if (
      !args.options['break'] &&
      !scope.circular.isCircular &&
      _.isObject(args.value)
    ) {
      if (args.options.childrenPath !== undefined) {
        if (!args.depth && args.options.rootIsChildren) {
          if (Array.isArray(args.value)) {
            _.forOwn(args.value, function (childValue, childKey) {
              const childPath = [...(args.path || []), childKey];
              const strChildPath =
                args.options.pathFormat == 'array'
                  ? pathToString([childKey], args.strPath || '')
                  : undefined;
              nextLevel.push({
                value: childValue,
                callback: args.callback,
                options: args.options,
                key: childKey,
                path: childPath,
                strPath: strChildPath,
                depth: args.depth + 1,
                parent: scope.currentObj,
                parents: scope.currentParents,
                obj: args.obj,
              });
            });
          } else {
            _.forOwn(args.value, function (childValue, childKey) {
              nextLevel.push({
                value: childValue,
                callback: args.callback,
                options: args.options,
                key: childKey,
                path: [childKey],
                strPath: pathToString([childKey]),
                depth: args.depth + 1,
                parent: scope.currentObj,
                parents: scope.currentParents,
                obj: args.obj,
              });
            });
          }
        } else {
          _each(args.options.childrenPath, function (cp, i) {
            const children = _.get(args.value, cp);
            const scp = args.options.strChildrenPath[i];
            if (children && _.isObject(children)) {
              _.forOwn(children, function (childValue, childKey) {
                const childPath = [...(args.path || []), ...cp, childKey];
                const strChildPath =
                  args.options.pathFormat == 'array'
                    ? pathToString([childKey], args.strPath || '', scp)
                    : undefined;
                nextLevel.push({
                  value: childValue,
                  callback: args.callback,
                  options: args.options,
                  key: childKey,
                  path: childPath,
                  strPath: strChildPath,
                  depth: args.depth + 1,
                  parent: scope.currentObj,
                  parents: scope.currentParents,
                  obj: args.obj,
                  childrenPath: cp,
                  strChildrenPath: scp,
                });
              });
            }
          });
        }
      } else {
        _.forOwn(args.value, function (childValue, childKey) {
          if (Array.isArray(args.value)) {
            if (childValue === undefined && !(childKey in args.value)) {
              return; //empty array slot
            }
          }

          const childPath = [...(args.path || []), childKey];
          const strChildPath =
            args.options.pathFormat == 'array'
              ? pathToString([childKey], args.strPath || '')
              : undefined;
          nextLevel.push({
            value: childValue,
            callback: args.callback,
            options: args.options,
            key: childKey,
            path: childPath,
            strPath: strChildPath,
            depth: args.depth + 1,
            parent: scope.currentObj,
            parents: scope.currentParents,
            obj: args.obj,
          });
        });
      }
    }
    return nextLevel;
  }
}
