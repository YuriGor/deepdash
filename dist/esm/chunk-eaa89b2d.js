import _merge from 'lodash-es/merge';
import { a as _isArray } from './chunk-7273d013.js';
import _identity from 'lodash-es/identity';
import _isString from 'lodash-es/isString';
import _toPath from 'lodash-es/toPath';
import _isObject from 'lodash-es/isObject';
import _isEmpty from 'lodash-es/isEmpty';
import _findIndex from 'lodash-es/findIndex';
import _forOwn from 'lodash-es/forOwn';
import _get from 'lodash-es/get';
import _some from 'lodash-es/some';
import { a as deps$3, b as getPathToString } from './chunk-7536e034.js';

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
    isArray: _isArray,
  },
  deps$3,
  deps
);

var deps$2 = _merge(
  {
    identity: _identity,
    merge: _merge,
    isArray: _isArray,
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

export { forArray as a, deps$2 as b, getEachDeep as c };
