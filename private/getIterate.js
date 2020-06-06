'use strict';

var getPathToString = require('../getPathToString.js');

function getIterate(_) {
  var pathToString = getPathToString(_);

  function iterate(item) {
    var options = item.options;
    var obj = item.obj;
    var callback = item.callback;
    options.pathFormatArray = options.pathFormat == 'array';
    item.depth = 0;

    var broken = false;
    var breakIt = function () {
      broken = true;
      return false;
    };

    var contextReader = new ContextReader(obj, options, breakIt);

    while (item) {
      if (broken) { break; }
      if (!item.inited) {
        item.inited = true;
        var itemIsObject = _.isObject(item.value);
        var itemIsEmpty = _.isEmpty(item.value);

        item.currentObj = {
          value: item.value,
          key: item.key,
          path: options.pathFormatArray ? item.path : item.strPath,
          parent: item.parent,
          depth: item.depth,
        };

        if (options.checkCircular) {
          item.circularParentIndex = -1;
          item.circularParent = null;
          item.isCircular = false;
          if (itemIsObject && !itemIsEmpty) {
            var parent = item.parent;
            while (parent) {
              if (parent.value === item.value) {
                item.isCircular = true;
                item.circularParent = parent;
                item.circularParentIndex = item.depth - parent.depth - 1;
                break;
              }
              parent = parent.parent;
            }
          }
        }

        item.children = [];
        if (options.childrenPath) {
          options.childrenPath.forEach(function (cp, i) {
            var children = _.get(item.value, cp);
            if (!_.isEmpty(children)) {
              item.children.push([cp, options.strChildrenPath[i], children]);
            }
          });
        }

        item.isLeaf =
          item.isCircular ||
          (options.childrenPath !== undefined && !item.children.length) ||
          !itemIsObject ||
          itemIsEmpty;

        item.needCallback =
          (item.depth || options.includeRoot) &&
          (!options.leavesOnly || item.isLeaf);

        if (item.needCallback) {
          contextReader.setItem(item, false);
          try {
            item.res = callback(
              item.value,
              item.key,
              item.parent && item.parent.value,
              contextReader
            );
          } catch (err) {
            if (err.message) {
              err.message +=
                '\ncallback failed before deep iterate at:\n' +
                item.currentObj.path;
            }

            throw err;
          }
        }

        if (broken) {
          break;
        }

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
      }
      if (
        item.childrenItems &&
        item.currentChildIndex < item.childrenItems.length - 1
      ) {
        item.currentChildIndex++;
        item.childrenItems[item.currentChildIndex].parentItem = item;
        item = item.childrenItems[item.currentChildIndex];
        continue;
      }

      if (item.needCallback && options.callbackAfterIterate) {
        contextReader.setItem(item, true);

        try {
          callback(
            item.value,
            item.key,
            item.parent && item.parent.value,
            contextReader
          );
        } catch (err) {
          if (err.message) {
            err.message +=
              '\ncallback failed after deep iterate at:\n' +
              item.currentObj.path;
          }

          throw err;
        }
      }
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
    Object.entries(children).forEach(function (ref) {
      var childKey = ref[0];
      var childValue = ref[1];

      var childPath = (item.path || []).concat( childrenPath, [childKey]);
      var strChildPath = options.pathFormatArray
        ? undefined
        : pathToString([childKey], item.strPath, strChildrenPath);
      childrenItems.push({
        value: childValue,
        key: childKey,
        path: childPath,
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: item.currentObj,
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      });
    });
  }
}

var ContextReader = function ContextReader(obj, options, breakIt) {
  this.obj = obj;
  this._options = options;
  this['break'] = breakIt;
};

var prototypeAccessors = { path: { configurable: true },parent: { configurable: true },parents: { configurable: true },depth: { configurable: true },isLeaf: { configurable: true },isCircular: { configurable: true },circularParentIndex: { configurable: true },circularParent: { configurable: true },childrenPath: { configurable: true } };
ContextReader.prototype.setItem = function setItem (item, afterIterate) {
  this._item = item;
  this.afterIterate = afterIterate;
  this._parents = undefined;
};
prototypeAccessors.path.get = function () {
  return this._item.currentObj.path;
};

prototypeAccessors.parent.get = function () {
  return this._item.parent;
};

prototypeAccessors.parents.get = function () {
  if (!this._parents) {
    this._parents = [];
    var curParent = this._item.parent;
    while (curParent) {
      this._parents[curParent.depth] = curParent;
      curParent = curParent.parent;
    }
  }
  return this._parents;
};
prototypeAccessors.depth.get = function () {
  return this._item.depth;
};

prototypeAccessors.isLeaf.get = function () {
  return this._item.isLeaf;
};

prototypeAccessors.isCircular.get = function () {
  return this._item.isCircular;
};

prototypeAccessors.circularParentIndex.get = function () {
  return this._item.circularParentIndex;
};

prototypeAccessors.circularParent.get = function () {
  return this._item.circularParent;
};

prototypeAccessors.childrenPath.get = function () {
  return (
    (this._options.childrenPath !== undefined &&
      (this._options.pathFormatArray
        ? this._item.childrenPath
        : this._item.strChildrenPath)) ||
    undefined
  );
};

Object.defineProperties( ContextReader.prototype, prototypeAccessors );

module.exports = getIterate;
