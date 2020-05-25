'use strict';

var getPathToString = require('../getPathToString.js');
var getHasChildren = require('./getHasChildren.js');

function getIterate(_) {
  var pathToString = getPathToString(_);
  var hasChildren = getHasChildren(_);
  var _each = _.each || _.forArray;

  function iterate(item) {
    var stack = [];
    while (item) {
      if (item.options['break']) { break; }
      if (!item.inited) {
        item.inited = true;
        defaults(item);
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

  function defaults(it) {
    if (!it.depth) {
      it.depth = 0;
    }
    if (!it.parents) {
      it.parents = [];
    }
  }

  function getScope(it) {
    var scope = {
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

    scope.currentParents = ( it.parents ).concat( [scope.currentObj]);

    if (scope.needCallback) {
      scope.context = Object.assign({}, scope.circular,
        {path: scope.currentObj.path,
        parent: it.parent,
        parents: it.parents,
        obj: it.obj,
        depth: it.depth,
        isLeaf: scope.isLeaf,
        "break": function () {
          it.options['break'] = true;
          return false;
        }});

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
    var isCircular;
    var circularParentIndex = undefined;
    var circularParent = undefined;
    if (options.checkCircular) {
      if (_.isObject(value) && !_.isEmpty(value)) {
        circularParentIndex = -1;
        var i = parents.length;
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
    return { isCircular: isCircular, circularParentIndex: circularParentIndex, circularParent: circularParent };
  }

  function getChildrenItems(it) {
    var childrenItems = [];
    if (
      !it.options['break'] &&
      !it.scope.circular.isCircular &&
      _.isObject(it.value)
    ) {
      if (it.options.childrenPath !== undefined) {
        if (!it.depth && it.options.rootIsChildren) {
          if (Array.isArray(it.value)) {
            _.forOwn(it.value, function (childValue, childKey) {
              var childPath = (it.path || []).concat( [childKey]);
              var strChildPath =
                it.options.pathFormat == 'array'
                  ? pathToString([childKey], it.strPath || '')
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
              });
            });
          } else {
            _.forOwn(it.value, function (childValue, childKey) {
              childrenItems.push({
                value: childValue,
                callback: it.callback,
                options: it.options,
                key: childKey,
                path: [childKey],
                strPath: pathToString([childKey]),
                depth: it.depth + 1,
                parent: it.scope.currentObj,
                parents: it.scope.currentParents,
                obj: it.obj,
              });
            });
          }
        } else {
          _each(it.options.childrenPath, function (cp, i) {
            var children = _.get(it.value, cp);
            var scp = it.options.strChildrenPath[i];
            if (children && _.isObject(children)) {
              _.forOwn(children, function (childValue, childKey) {
                var childPath = (it.path || []).concat( cp, [childKey]);
                var strChildPath =
                  it.options.pathFormat == 'array'
                    ? pathToString([childKey], it.strPath || '', scp)
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
                  childrenPath: cp,
                  strChildrenPath: scp,
                });
              });
            }
          });
        }
      } else {
        _.forOwn(it.value, function (childValue, childKey) {
          if (Array.isArray(it.value)) {
            if (childValue === undefined && !(childKey in it.value)) {
              return; //empty array slot
            }
          }

          var childPath = (it.path || []).concat( [childKey]);
          var strChildPath =
            it.options.pathFormat == 'array'
              ? pathToString([childKey], it.strPath || '')
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
          });
        });
      }
    }
    return childrenItems;
  }
}

module.exports = getIterate;
