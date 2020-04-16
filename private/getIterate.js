'use strict';

var getPathToString = require('../getPathToString.js');
var getHasChildren = require('./getHasChildren.js');

function getIterate(_) {
  var pathToString = getPathToString(_);
  var hasChildren = getHasChildren(_);
  var _each = _.each || _.forArray;
  function iterate(ref) {
    var value = ref.value;
    var callback = ref.callback;
    var options = ref.options;
    var key = ref.key;
    var path = ref.path;
    var strPath = ref.strPath;
    var depth = ref.depth; if ( depth === void 0 ) depth = 0;
    var parent = ref.parent;
    var parents = ref.parents; if ( parents === void 0 ) parents = [];
    var obj = ref.obj;
    var childrenPath = ref.childrenPath;
    var strChildrenPath = ref.strChildrenPath;

    if (options['break']) { return; }
    var currentObj = {
      value: value,
      key: key,
      path:
        options.pathFormat == 'array' ? path : strPath || pathToString(path),
      parent: parent,
    };

    var currentParents = parents.concat( [currentObj]);
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
    var isLeaf =
      !_.isObject(value) ||
      _.isEmpty(value) ||
      isCircular ||
      (options.childrenPath !== undefined &&
        !hasChildren(value, options.childrenPath));
    var needCallback =
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
        "break": function () {
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
          err.message += "\ncallback failed before deep iterate at:\n" + (context.path);
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
        var forChildren = function(children, cp, scp) {
          if (children && _.isObject(children)) {
            _.forOwn(children, function(childValue, childKey) {
              var childPath = (path || []).concat( (cp || []), [childKey]);
              var strChildPath =
                options.pathFormat == 'array'
                  ? pathToString([childKey], strPath || '', scp || '')
                  : undefined;
              iterate({
                value: childValue,
                callback: callback,
                options: options,
                key: childKey,
                path: childPath,
                strPath: strChildPath,
                depth: depth + 1,
                parent: currentObj,
                parents: currentParents,
                obj: obj,
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
                callback: callback,
                options: options,
                key: childKey,
                path: [childKey],
                strPath: pathToString([childKey]),
                depth: depth + 1,
                parent: currentObj,
                parents: currentParents,
                obj: obj,
              });
            });
          }
        } else {
          _each(options.childrenPath, function(cp, i) {
            var children = _.get(value, cp);
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

          var childPath = (path || []).concat( [childKey]);
          var strChildPath =
            options.pathFormat == 'array'
              ? pathToString([childKey], strPath || '')
              : undefined;

          iterate({
            value: childValue,
            callback: callback,
            options: options,
            key: childKey,
            path: childPath,
            strPath: strChildPath,
            depth: depth + 1,
            parent: currentObj,
            parents: currentParents,
            obj: obj,
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
          err.message += "\ncallback failed after deep iterate at:\n" + (context.path);
        }
        throw err;
      }
    }
  }
  return iterate;
}

module.exports = getIterate;
