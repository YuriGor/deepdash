'use strict';

var getPathToString = require('../getPathToString.js');

// if (!global.perf) {
//   global.perf = {};
// }
// const perf = global.perf;

function getIterate(_) {
  // if (!perf.iterate) {
  // perf.iterate = {
  //     currentObj: 0,
  //     currentObj_c: 0,
  //     checkCircular: 0,
  //     checkCircular_c: 0,
  //     children: 0,
  //     children_c: 0,
  //     isLeaf: 0,
  //     isLeaf_c: 0,
  //     needCallback: 0,
  //     needCallback_c: 0,
  //     currentParents: 0,
  //     currentParents_c: 0,
  //     context: 0,
  //     context_c: 0,
  //     invokeCallback: 0,
  //     invokeCallback_c: 0,
  //     addOwnChildren: 0,
  //     addOwnChildren_c: 0,
  //     push: 0,
  //     push_c: 0,
  //   };
  // perf.invokeCallback = {
  //     before: 0,
  //     before_c: 0,
  //   };
  // perf.addOwnChildren = {
  //     emptySlot: 0,
  //     emptySlot_c: 0,
  //     childPath: 0,
  //     childPath_c: 0,
  //     strChildPath: 0,
  //     strChildPath_c: 0,
  //     push: 0,
  //     push_c: 0,
  //   };
  // }
  var pathToString = getPathToString(_);

  function iterate(item) {
    var options = item.options;
    var obj = item.obj;
    var callback = item.callback;
    options.pathFormatArray = options.pathFormat == 'array';
    if (options.pathFormatArray) {
      item.strPath = pathToString(item.path);
    }
    item.depth = 0;
    item.parents = [];

    var broken = false;
    var breakIt = function () {
      broken = true;
      return false;
    };

    // let start;
    while (item) {
      if (broken) { break; }
      if (!item.inited) {
        // start = Date.now();
        item.inited = true;
        var itemIsObject = _.isObject(item.value);
        var itemIsEmpty = _.isEmpty(item.value);

        item.currentObj = {
          value: item.value,
          key: item.key,
          path: options.pathFormatArray ? item.path : item.strPath,
          parent: item.parent,
        };
        // perf.iterate.currentObj += Date.now() - start;
        // perf.iterate.currentObj_c++;
        // start = Date.now();
        if (options.checkCircular) {
          item.circularParentIndex = -1;
          item.circularParent = null;
          item.isCircular = false;
          if (itemIsObject && !itemIsEmpty) {
            var i = item.parents.length;
            while (i--) {
              if (item.parents[i].value === item.value) {
                item.circularParentIndex = i;
                item.circularParent = item.parents[i];
                item.isCircular = true;
                break;
              }
            }
          }
        }
        // perf.iterate.checkCircular += Date.now() - start;
        // perf.iterate.checkCircular_c++;
        // start = Date.now();
        item.children = [];
        if (options.childrenPath) {
          options.childrenPath.forEach(function (cp, i) {
            var children = _.get(item.value, cp);
            if (!_.isEmpty(children)) {
              item.children.push([cp, options.strChildrenPath[i], children]);
            }
          });
        }
        // perf.iterate.children += Date.now() - start;
        // perf.iterate.children_c++;
        // start = Date.now();
        item.isLeaf =
          item.isCircular ||
          (options.childrenPath !== undefined && !item.children.length) ||
          !itemIsObject ||
          itemIsEmpty;

        // perf.iterate.isLeaf += Date.now() - start;
        // perf.iterate.isLeaf_c++;
        // start = Date.now();
        item.needCallback =
          (item.depth || options.includeRoot) &&
          (!options.leavesOnly || item.isLeaf);

        // perf.iterate.needCallback += Date.now() - start;
        // perf.iterate.needCallback_c++;
        // start = Date.now();

        item.currentParents = ( item.parents ).concat( [item.currentObj]);

        // perf.iterate.currentParents += Date.now() - start;
        // perf.iterate.currentParents_c++;
        // start = Date.now();

        if (item.needCallback) {
          item.context = {
            path: item.currentObj.path,
            parent: item.parent,
            parents: item.parents,
            obj: obj,
            depth: item.depth,
            isLeaf: item.isLeaf,
            isCircular: item.isCircular,
            circularParentIndex: item.circularParentIndex,
            circularParent: item.circularParent,
            "break": breakIt,
          };

          if (options.childrenPath !== undefined) {
            item.context.childrenPath = options.pathFormatArray
              ? item.childrenPath
              : item.strChildrenPath;
          }
        }

        // perf.iterate.context += Date.now() - start;
        // perf.iterate.context_c++;
        // start = Date.now();

        if (item.needCallback) {
          try {
            item.res = callback(
              item.value,
              item.key,
              item.parent && item.parent.value,
              item.context
            );
          } catch (err) {
            if (err.message) {
              err.message +=
                '\ncallback failed before deep iterate at:\n' +
                item.context.path;
            }

            throw err;
          }
        }

        // perf.iterate.invokeCallback += Date.now() - start;
        // perf.iterate.invokeCallback_c++;
        if (broken) {
          break;
        }
        // start = Date.now();

        if (item.res !== false) {
          item.childrenItems = [];
          if (!broken && !item.isCircular && itemIsObject) {
            if (
              options.childrenPath !== undefined &&
              (item.depth || !options.rootIsChildren)
            ) {
              if (item.children.length) {
                item.children.forEach(function (ref) {
                  var cp = ref[0];
                  var scp = ref[1];
                  var children = ref[2];

                  if (_.isObject(children)) {
                    addOwnChildren(
                      item.childrenItems,
                      item,
                      children,
                      options,
                      cp,
                      scp
                    );
                  }
                });
              }
            } else {
              addOwnChildren(
                item.childrenItems,
                item,
                item.value,
                options,
                [],
                ''
              );
            }
          }
        }

        item.currentChildIndex = -1;
        // perf.iterate.addOwnChildren += Date.now() - start;
        // perf.iterate.addOwnChildren_c++;
      }
      // start = Date.now();
      if (
        item.childrenItems &&
        item.currentChildIndex < item.childrenItems.length - 1
      ) {
        item.currentChildIndex++;
        item.childrenItems[item.currentChildIndex].parentItem = item;
        item = item.childrenItems[item.currentChildIndex];
        // perf.iterate.push += Date.now() - start;
        // perf.iterate.push_c++;
        continue;
      }
      // perf.iterate.push += Date.now() - start;
      // perf.iterate.push_c++;
      // start = Date.now();

      if (item.needCallback && options.callbackAfterIterate) {
        item.context.afterIterate = true;

        try {
          callback(
            item.value,
            item.key,
            item.parent && item.parent.value,
            item.context
          );
        } catch (err) {
          if (err.message) {
            err.message +=
              '\ncallback failed after deep iterate at:\n' + item.context.path;
          }

          throw err;
        }
      }
      // perf.iterate.invokeCallback += Date.now() - start;
      // perf.iterate.invokeCallback_c++;
      item = item.parentItem;
    }
  }

  return iterate;

  function addOwnChildren(
    childrenItems,
    item,
    children,
    options,
    childrenPath,
    strChildrenPath
  ) {
    var keys = Object.keys(children);
    keys.forEach(function (childKey) {
      // let start = Date.now();
      var childValue = children[childKey];
      // perf.addOwnChildren.emptySlot += Date.now() - start;
      // perf.addOwnChildren.emptySlot_c++;
      // start = Date.now();
      var childPath = (item.path || []).concat( childrenPath, [childKey]);
      // perf.addOwnChildren.childPath += Date.now() - start;
      // perf.addOwnChildren.childPath_c++;
      // start = Date.now();
      var strChildPath = options.pathFormatArray
        ? undefined
        : pathToString([childKey], item.strPath, strChildrenPath);
      // perf.addOwnChildren.strChildPath += Date.now() - start;
      // perf.addOwnChildren.strChildPath_c++;
      // start = Date.now();
      childrenItems.push({
        value: childValue,
        key: childKey,
        path: childPath,
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: item.currentObj,
        parents: item.currentParents,
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      });
      // perf.addOwnChildren.push += Date.now() - start;
      // perf.addOwnChildren.push_c++;
    });
  }
}

module.exports = getIterate;
