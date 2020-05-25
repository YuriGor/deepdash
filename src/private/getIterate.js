import getPathToString from './../getPathToString';
import getHasChildren from './getHasChildren';

export default function getIterate(_) {
  const pathToString = getPathToString(_);
  const hasChildren = getHasChildren(_);
  const _each = _.each || _.forArray;

  /* item: {
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
  } */
  function iterate(item) {
    const stack = [];
    while (item) {
      if (item.options['break']) break;
      if (!item.inited) {
        item.inited = true;
        applyDefaults(item);
        item.scope = getScope(item);
        item.res = invokeCallback(item);
        if (item.res !== false) {
          item.childrenItems = getChildrenItems(item);
        }
        item.currentChildIndex = -1;
      }

      if (
        item.childrenItems &&
        item.currentChildIndex < item.childrenItems.length - 1
      ) {
        item.currentChildIndex++;
        stack.push(item);
        item = item.childrenItems[item.currentChildIndex];
        continue;
      }

      invokeCallback(item, true);

      item = stack.pop();
    }
  }

  return iterate;

  function applyDefaults(it) {
    if (!it.depth) {
      it.depth = 0;
    }
    if (!it.parents) {
      it.parents = [];
    }
  }

  function getScope(it) {
    const scope = {
      currentObj: {
        value: it.value,
        key: it.key,
        path:
          it.options.pathFormat == 'array'
            ? it.path
            : it.strPath || pathToString(it.path),
        parent: it.parent,
      },

      circular: checkCircular(it.value, it.options, it.parents),
    };

    scope.isLeaf =
      !_.isObject(it.value) ||
      _.isEmpty(it.value) ||
      scope.circular.isCircular ||
      (it.options.childrenPath !== undefined &&
        !hasChildren(it.value, it.options.childrenPath));

    scope.needCallback =
      (it.depth || it.options.includeRoot) &&
      (!it.options.leavesOnly || scope.isLeaf);

    scope.currentParents = [...it.parents, scope.currentObj];

    if (scope.needCallback) {
      scope.context = {
        ...scope.circular,
        path: scope.currentObj.path,
        parent: it.parent,
        parents: it.parents,
        obj: it.obj,
        depth: it.depth,
        isLeaf: scope.isLeaf,
        "break": () => {
          it.options['break'] = true;
          return false;
        },
      };

      if (it.options.childrenPath !== undefined) {
        scope.currentObj.childrenPath =
          it.options.pathFormat == 'array'
            ? it.childrenPath
            : it.strChildrenPath;
        scope.context.childrenPath = scope.currentObj.childrenPath;
      }
    }
    return scope;
  }

  function invokeCallback(it, afterIterate) {
    if (
      it.scope.needCallback &&
      (!afterIterate || it.options.callbackAfterIterate)
    ) {
      if (afterIterate) {
        it.scope.context.afterIterate = true;
      }
      try {
        return it.callback(
          it.value,
          it.key,
          it.parent && it.parent.value,
          it.scope.context
        );
      } catch (err) {
        if (err.message) {
          err.message +=
            '\ncallback failed ' +
            (afterIterate ? 'after' : 'before') +
            ' deep iterate at:\n' +
            it.scope.context.path;
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

  function getChildrenItems(it) {
    let childrenItems = [];
    if (
      !it.options['break'] &&
      !it.scope.circular.isCircular &&
      _.isObject(it.value)
    ) {
      if (it.options.childrenPath !== undefined) {
        if (!it.depth && it.options.rootIsChildren) {
          addOwnChildren(childrenItems, it, it.value);
        } else {
          _each(it.options.childrenPath, (cp, i) => {
            const children = _.get(it.value, cp);
            const scp = it.options.strChildrenPath[i];
            if (children && _.isObject(children)) {
              addOwnChildren(childrenItems, it, children, cp, scp);
            }
          });
        }
      } else {
        addOwnChildren(childrenItems, it, it.value);
      }
    }
    return childrenItems;
  }

  function addOwnChildren(
    childrenItems,
    it,
    children,
    childrenPath = [],
    strChildrenPath = ''
  ) {
    _.forOwn(children, (childValue, childKey) => {
      if (Array.isArray(children)) {
        if (childValue === undefined && !(childKey in children)) {
          return; //empty array slot
        }
      }
      const childPath = [...(it.path || []), ...childrenPath, childKey];
      const strChildPath =
        it.options.pathFormat == 'array'
          ? pathToString([childKey], it.strPath || '', strChildrenPath)
          : undefined;
      childrenItems.push({
        value: childValue,
        callback: it.callback,
        options: it.options,
        key: childKey,
        path: childPath,
        strPath: strChildPath,
        depth: it.depth + 1,
        parent: it.scope.currentObj,
        parents: it.scope.currentParents,
        obj: it.obj,
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      });
    });
  }
}
