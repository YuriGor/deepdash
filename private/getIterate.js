'use strict';

var getPathToString = require('../getPathToString.js');
var isObject = require('./isObject.js');

var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
var rxQuot = /"/g;
var has = Object.prototype.hasOwnProperty;

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

    while (item) {
      if (broken) { break; }
      if (!item.inited) {
        item.inited = true;
        item.info = describeValue(item.value, options.ownPropertiesOnly);

        if (options.checkCircular) {
          item.circularParentIndex = -1;
          item.circularParent = null;
          item.isCircular = false;
          if (item.info.isObject && !item.info.isEmpty) {
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
            var info = describeValue(children, options.ownPropertiesOnly);
            if (!info.isEmpty) {
              item.children.push([
                cp,
                options.strChildrenPath[i],
                children,
                info ]);
            }
          });
        }

        item.isLeaf =
          item.isCircular ||
          (options.childrenPath !== undefined && !item.children.length) ||
          !item.info.isObject ||
          item.info.isEmpty;

        item.needCallback =
          (item.depth || options.includeRoot) &&
          (!options.leavesOnly || item.isLeaf);

        if (item.needCallback) {
          var contextReader = new ContextReader(obj, options, breakIt);
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
                pathToString(item.path);
            }

            throw err;
          }
        }

        if (broken) {
          break;
        }

        if (item.res !== false) {
          if (!broken && !item.isCircular && item.info.isObject) {
            if (
              options.childrenPath !== undefined &&
              (item.depth || !options.rootIsChildren)
            ) {
              item.childrenItems = [];
              if (item.children.length) {
                item.children.forEach(function (ref) {
                  var cp = ref[0];
                  var scp = ref[1];
                  var children = ref[2];
                  var info = ref[3];

                  item.childrenItems = ( item.childrenItems ).concat( (info.isArray
                      ? getElements(item, children, options, cp, scp)
                      : getOwnChildren(item, children, options, cp, scp)) );
                });
              }
            } else {
              item.childrenItems = item.info.isArray
                ? getElements(item, item.value, options, [], '')
                : getOwnChildren(item, item.value, options, [], '');
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
        var contextReader$1 = new ContextReader(obj, options, breakIt);
        contextReader$1.setItem(item, true);

        try {
          callback(
            item.value,
            item.key,
            item.parent && item.parent.value,
            contextReader$1
          );
        } catch (err) {
          if (err.message) {
            err.message +=
              '\ncallback failed after deep iterate at:\n' +
              pathToString(item.path);
          }

          throw err;
        }
      }
      item = item.parentItem;
    }
  }

  return iterate;

  function getElements(item, children, options, childrenPath, strChildrenPath) {
    var strChildPathPrefix;
    if (!options.pathFormatArray) {
      strChildPathPrefix = item.strPath || '';

      if (
        strChildrenPath &&
        strChildPathPrefix &&
        !strChildrenPath.startsWith('[')
      ) {
        strChildPathPrefix += '.';
      }
      strChildPathPrefix += strChildrenPath || '';
    }
    var res = [];
    for (var i = 0; i < children.length; i++) {
      var val = children[i];
      if (val === undefined && !(i in children)) {
        continue;
      }
      var strChildPath = (void 0);
      var pathFormatString = !options.pathFormatArray;
      if (pathFormatString) {
        strChildPath = strChildPathPrefix + "[" + i + "]";
      }
      res.push({
        value: val,
        key: i + '',
        path: (item.path || []).concat( childrenPath, [i + '']),
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: {
          value: item.value,
          key: item.key,
          path: pathFormatString ? item.strPath : item.path,
          parent: item.parent,
          depth: item.depth,
          info: item.info,
        },
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      });
    }
    return res;
  }

  function getOwnChildren(
    item,
    children,
    options,
    childrenPath,
    strChildrenPath
  ) {
    var strChildPathPrefix;
    if (!options.pathFormatArray) {
      strChildPathPrefix = item.strPath || '';

      if (
        strChildrenPath &&
        strChildPathPrefix &&
        !strChildrenPath.startsWith('[')
      ) {
        strChildPathPrefix += '.';
      }
      strChildPathPrefix += strChildrenPath || '';
    }
    var res = [];
    var pathFormatString = !options.pathFormatArray;
    for (var childKey in children) {
      if (options.ownPropertiesOnly && !has.call(children, childKey)) {
        continue;
      }

      var strChildPath = (void 0);
      if (pathFormatString) {
        if (rxVarName.test(childKey)) {
          if (strChildPathPrefix) {
            strChildPath = strChildPathPrefix + "." + childKey;
          } else {
            strChildPath = "" + childKey;
          }
        } else {
          strChildPath = strChildPathPrefix + "[\"" + (childKey.replace(
            rxQuot,
            '\\"'
          )) + "\"]";
        }
      }

      res.push({
        value: children[childKey],
        key: childKey,
        path: (item.path || []).concat( childrenPath, [childKey]),
        strPath: strChildPath,
        depth: item.depth + 1,
        parent: {
          value: item.value,
          key: item.key,
          path: pathFormatString ? item.strPath : item.path,
          parent: item.parent,
          depth: item.depth,
          info: item.info,
        },
        childrenPath: (childrenPath.length && childrenPath) || undefined,
        strChildrenPath: strChildrenPath || undefined,
      });
    }

    return res;
  }
}

var ContextReader = function ContextReader(obj, options, breakIt) {
  this.obj = obj;
  this._options = options;
  this['break'] = breakIt;
};

var prototypeAccessors = { path: { configurable: true },parent: { configurable: true },parents: { configurable: true },depth: { configurable: true },isLeaf: { configurable: true },isCircular: { configurable: true },circularParentIndex: { configurable: true },circularParent: { configurable: true },childrenPath: { configurable: true },info: { configurable: true } };
ContextReader.prototype.setItem = function setItem (item, afterIterate) {
  this._item = item;
  this.afterIterate = afterIterate;
};
prototypeAccessors.path.get = function () {
  return this._options.pathFormatArray ? this._item.path : this._item.strPath;
};

prototypeAccessors.parent.get = function () {
  return this._item.parent;
};

prototypeAccessors.parents.get = function () {
  if (!this._item._parents) {
    this._item._parents = [];
    var curParent = this._item.parent;
    while (curParent) {
      this._item._parents[curParent.depth] = curParent;
      curParent = curParent.parent;
    }
  }
  return this._item._parents;
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

prototypeAccessors.info.get = function () {
  return this._item.info;
};

Object.defineProperties( ContextReader.prototype, prototypeAccessors );

function isObjectEmpty(value, ownPropertiesOnly) {
  for (var key in value) {
    if (!ownPropertiesOnly || has.call(value, key)) {
      return false;
    }
  }
  return true;
}

function describeValue(value, ownPropertiesOnly) {
  var res = { isObject: isObject(value) };
  res.isArray = res.isObject && Array.isArray(value);
  res.isEmpty = res.isArray
    ? !value.length
    : res.isObject
    ? isObjectEmpty(value, ownPropertiesOnly)
    : true;

  return res;
}

module.exports = getIterate;
