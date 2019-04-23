'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_2 = require('./chunk-6127be9d.js');
var _identity = _interopDefault(require('lodash/identity'));
var _isString = _interopDefault(require('lodash/isString'));
var _toPath = _interopDefault(require('lodash/toPath'));
var _isObject = _interopDefault(require('lodash/isObject'));
var _isEmpty = _interopDefault(require('lodash/isEmpty'));
var _findIndex = _interopDefault(require('lodash/findIndex'));
var _forOwn = _interopDefault(require('lodash/forOwn'));
var _get = _interopDefault(require('lodash/get'));
var _some = _interopDefault(require('lodash/some'));
var __chunk_4 = require('./chunk-40280356.js');

function forArray(arr, iteratee) {
  for (var i = 0; i < arr.length; i++) {
    if (iteratee(arr[i], i, arr) === false) break;
  }
  return arr;
}

var deps = {
  some: _some,
  get: _get,
  isEmpty: _isEmpty,
};

var deps$1 = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    findIndex: _findIndex,
    forOwn: _forOwn,
    forArray: forArray,
    get: _get,
    isArray: __chunk_2._isArray,
  },
  __chunk_4.deps,
  deps
);

var deps$2 = _merge(
  {
    identity: _identity,
    merge: _merge,
    isArray: __chunk_2._isArray,
    isString: _isString,
    toPath: _toPath,
  },
  deps$1
);

function getHasChildren(_) {
  function hasChildren(obj, childrenPath) {
    return _.some(childrenPath, (cp) => {
      var children = _.get(obj, cp);
      return !_.isEmpty(children);
    });
  }
  return hasChildren;
}

function getIterate(_) {
  var pathToString = __chunk_4.getPathToString(_);
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
    var currentObj = {
      value: value,
      key: key,
      path: options.pathFormat == 'array' ? path : pathToString(path),
      parent: parent,
    };

    var currentParents = parents.concat(currentObj);

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
    var needCallback =
      (depth || options.includeRoot) &&
      (!options.leavesOnly ||
        !_.isObject(value) ||
        _.isEmpty(value) ||
        isCircular ||
        (options.childrenPath !== undefined &&
          !hasChildren(value, options.childrenPath)));
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
      };
      if (options.childrenPath !== undefined) {
        currentObj.childrenPath =
          options.pathFormat == 'array'
            ? childrenPath
            : pathToString(childrenPath);
        context.childrenPath = currentObj.childrenPath;
      }
      res = callback(value, key, parent && parent.value, context);
    }
    function forChildren(children, cp) {
      if (children && _.isObject(children)) {
        _.forOwn(children, function(childValue, childKey) {
          var childPath = (path || []).concat(cp || [], [childKey]);

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
    if (res !== false && !isCircular && _.isObject(value)) {
      if (options.childrenPath !== undefined) {
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

          var childPath = (path || []).concat([childKey]);

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
      callback(value, key, parent && parent.value, context);
    }
  }
  return iterate;
}

function getEachDeep(_) {
  var iterate = getIterate(_);

  function eachDeep(obj, callback, options) {
    if (callback === undefined) callback = _.identity;
    options = _.merge(
      {
        includeRoot: !_.isArray(obj),
        pathFormat: 'string',
        checkCircular: false,
        leavesOnly: false,
      },
      options || {}
    );
    if (options.childrenPath !== undefined) {
      if (!options.includeRoot && options.rootIsChildren === undefined) {
        options.rootIsChildren = _.isArray(obj);
      }
      if (
        !_.isString(options.childrenPath) &&
        !_.isArray(options.childrenPath)
      ) {
        throw Error('childrenPath can be string or array');
      } else {
        if (_.isString(options.childrenPath)) {
          options.childrenPath = [options.childrenPath];
        }
        for (var i = options.childrenPath.length - 1; i >= 0; i--) {
          options.childrenPath[i] = _.toPath(options.childrenPath[i]);
        }
      }
    }
    iterate(
      obj,
      callback,
      options,
      undefined,
      undefined,
      0,
      undefined,
      [],
      obj
    );
    return obj;
  }
  return eachDeep;
}

exports.eachDeepDeps = deps$2;
exports.forArray = forArray;
exports.getEachDeep = getEachDeep;
