(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash-es/each'), require('lodash/merge'), require('lodash/identity'), require('lodash/isString'), require('lodash/toPath'), require('lodash/isObject'), require('lodash/isEmpty'), require('lodash/findIndex'), require('lodash/forOwn'), require('lodash/get'), require('lodash/some'), require('lodash/reduce'), require('lodash/clone'), require('lodash/cloneDeep'), require('lodash/each'), require('lodash/eachRight'), require('lodash/has'), require('lodash/set'), require('lodash/unset'), require('lodash/isPlainObject'), require('lodash/iteratee')) :
  typeof define === 'function' && define.amd ? define(['lodash-es/each', 'lodash/merge', 'lodash/identity', 'lodash/isString', 'lodash/toPath', 'lodash/isObject', 'lodash/isEmpty', 'lodash/findIndex', 'lodash/forOwn', 'lodash/get', 'lodash/some', 'lodash/reduce', 'lodash/clone', 'lodash/cloneDeep', 'lodash/each', 'lodash/eachRight', 'lodash/has', 'lodash/set', 'lodash/unset', 'lodash/isPlainObject', 'lodash/iteratee'], factory) :
  (global = global || self, factory(global.each, global._merge, global._identity, global._isString, global._toPath, global._isObject, global._isEmpty, global._findIndex, global._forOwn, global._get, global._some, global._reduce, global._clone, global._cloneDeep, global._each, global._eachRight, global._has, global._set, global._unset, global._isPlainObject, global._iteratee));
}(this, function (each, _merge, _identity, _isString, _toPath, _isObject, _isEmpty, _findIndex, _forOwn, _get, _some, _reduce, _clone, _cloneDeep, _each, _eachRight, _has, _set, _unset, _isPlainObject, _iteratee) { 'use strict';

  each = each && each.hasOwnProperty('default') ? each['default'] : each;
  _merge = _merge && _merge.hasOwnProperty('default') ? _merge['default'] : _merge;
  _identity = _identity && _identity.hasOwnProperty('default') ? _identity['default'] : _identity;
  _isString = _isString && _isString.hasOwnProperty('default') ? _isString['default'] : _isString;
  _toPath = _toPath && _toPath.hasOwnProperty('default') ? _toPath['default'] : _toPath;
  _isObject = _isObject && _isObject.hasOwnProperty('default') ? _isObject['default'] : _isObject;
  _isEmpty = _isEmpty && _isEmpty.hasOwnProperty('default') ? _isEmpty['default'] : _isEmpty;
  _findIndex = _findIndex && _findIndex.hasOwnProperty('default') ? _findIndex['default'] : _findIndex;
  _forOwn = _forOwn && _forOwn.hasOwnProperty('default') ? _forOwn['default'] : _forOwn;
  _get = _get && _get.hasOwnProperty('default') ? _get['default'] : _get;
  _some = _some && _some.hasOwnProperty('default') ? _some['default'] : _some;
  _reduce = _reduce && _reduce.hasOwnProperty('default') ? _reduce['default'] : _reduce;
  _clone = _clone && _clone.hasOwnProperty('default') ? _clone['default'] : _clone;
  _cloneDeep = _cloneDeep && _cloneDeep.hasOwnProperty('default') ? _cloneDeep['default'] : _cloneDeep;
  _each = _each && _each.hasOwnProperty('default') ? _each['default'] : _each;
  _eachRight = _eachRight && _eachRight.hasOwnProperty('default') ? _eachRight['default'] : _eachRight;
  _has = _has && _has.hasOwnProperty('default') ? _has['default'] : _has;
  _set = _set && _set.hasOwnProperty('default') ? _set['default'] : _set;
  _unset = _unset && _unset.hasOwnProperty('default') ? _unset['default'] : _unset;
  _isPlainObject = _isPlainObject && _isPlainObject.hasOwnProperty('default') ? _isPlainObject['default'] : _isPlainObject;
  _iteratee = _iteratee && _iteratee.hasOwnProperty('default') ? _iteratee['default'] : _iteratee;

  function getCondense(_) {
    function condense(arr) {
      var indexes = [];
      for (var i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
          indexes.push(i);
        }
      }
      var length = indexes.length;

      while (length--) {
        arr.splice(indexes[length], 1);
      }
      return arr;
    }
    return condense;
  }

  var rxArrIndex = /^\d+$/;
  var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;

  function getPathToString(_) {
    function pathToString(path) {
      if (_.isString(path)) return path;
      if (!_.isArray(path)) return undefined;
      return _.reduce(
        path,
        function(accumulator, value) {
          if (rxArrIndex.test(value)) {
            return accumulator + '[' + value + ']';
          }
          if (rxVarName.test(value)) {
            return accumulator + (accumulator ? '.' : '') + value;
          }
          return (
            accumulator + '["' + value.toString().replace(/"/g, '\\"') + '"]'
          );
        },
        ''
      );
    }
    return pathToString;
  }

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

  function getCondenseDeep(_) {
    var eachDeep = getEachDeep(_);
    var condense = getCondense(_);
    var _each = _.each || _.forArray;
    function condenseDeep(obj, options) {
      options = _.merge(
        {
          checkCircular: false,
        },
        options || {}
      );
      var eachDeepOptions = {
        checkCircular: options.checkCircular,
      };
      var arrays = [];
      //console.log('condenseDeep → eachDeep');
      eachDeep(
        obj,
        function(value, key, parent, context) {
          if (!context.isCircular && _.isArray(value)) arrays.push(value);
        },
        eachDeepOptions
      );
      if (_.isArray(obj)) arrays.push(obj);
      _each(arrays, condense);
      return obj;
    }
    return condenseDeep;
  }

  function getExists(_) {
    function exists(obj, path) {
      path = _.isArray(path) ? _.clone(path) : _.toPath(path);
      var key = path.pop();
      var parent = path.length ? _.get(obj, path) : obj;
      return parent !== undefined && key in parent;
    }
    return exists;
  }

  function getObtain(_) {
    function obtain(obj, path) {
      if (path === undefined) {
        return obj;
      }
      return _.get(obj, path);
    }
    return obtain;
  }

  function getFilterDeep(_) {
    // console.log('getFilterDeep:', _);
    var eachDeep = getEachDeep(_);
    var pathToString = getPathToString(_);
    var obtain = getObtain(_);
    var condenseDeep = getCondenseDeep(_);
    var exists = getExists(_);

    function filterDeep(obj, predicate, options) {
      predicate = _.iteratee(predicate);
      if (options && options.leafsOnly !== undefined) {
        options.leavesOnly = options.leafsOnly;
      }
      if (!options) {
        options = {};
      }
      if (!options.onTrue) {
        options.onTrue = {};
      }
      if (!options.onFalse) {
        options.onFalse = {};
      }
      if (!options.onUndefined) {
        options.onUndefined = {};
      }
      if (options.childrenPath !== undefined) {
        if (options.onTrue.skipChildren === undefined) {
          options.onTrue.skipChildren = false;
        }
        if (options.onUndefined.skipChildren === undefined) {
          options.onUndefined.skipChildren = false;
        }
        if (options.onFalse.skipChildren === undefined) {
          options.onFalse.skipChildren = false;
        }

        if (options.onTrue.cloneDeep === undefined) {
          options.onTrue.cloneDeep = true;
        }
        if (options.onUndefined.cloneDeep === undefined) {
          options.onUndefined.cloneDeep = true;
        }
        if (options.onFalse.cloneDeep === undefined) {
          options.onFalse.cloneDeep = true;
        }
      }
      options = _.merge(
        {
          checkCircular: false,
          keepCircular: true,
          //replaceCircularBy: <by>,
          leavesOnly: options.childrenPath === undefined,
          condense: true,
          cloneDeep: _.cloneDeep,
          pathFormat: 'string',
          onTrue: { skipChildren: true, cloneDeep: true, keepIfEmpty: true },
          onUndefined: {
            skipChildren: false,
            cloneDeep: false,
            keepIfEmpty: false,
          },
          onFalse: {
            skipChildren: true,
            cloneDeep: false,
            keepIfEmpty: false,
          },
        },
        options
      );

      var eachDeepOptions = {
        pathFormat: options.pathFormat,
        checkCircular: options.checkCircular,
        childrenPath: options.childrenPath,
        includeRoot: options.includeRoot,
        callbackAfterIterate: true,
        leavesOnly: options.leavesOnly,
      };

      var res = _.isArray(obj) ? [] : _.isObject(obj) ? {} : null;
      var replies = {};
      var rootReply;
      var foundCircular = [];
      // console.log('filterDeep → eachDeep', eachDeepOptions);
      eachDeep(
        obj,
        function(value, key, parent, context) {
          var curPath = pathToString(context.path);
          if (!context.afterIterate) {
            if (!context.isCircular) {
              // console.log('fr: ', context.path);
              var reply;
              reply = predicate(value, key, parent, context);
              // console.log(context.path + '?', reply);

              if (!_.isObject(reply)) {
                if (reply === undefined) {
                  reply = _.clone(options.onUndefined);
                } else if (reply) {
                  reply = _.clone(options.onTrue);
                } else {
                  reply = _.clone(options.onFalse);
                }
              }
              if (reply.empty === undefined) {
                reply.empty = true;
              }
              if (curPath !== undefined) {
                replies[curPath] = reply;

                _.eachRight(context.parents, function(parent) {
                  var p = pathToString(parent.path);
                  if (p !== undefined && !replies[p]) {
                    replies[p] = {
                      skipChildren: false,
                      cloneDeep: false,
                      keepIfEmpty: false,
                      empty: reply.empty,
                    };
                  } else {
                    return false;
                  }
                });

                if (!rootReply) {
                  rootReply = {
                    skipChildren: false,
                    cloneDeep: false,
                    keepIfEmpty: false,
                    empty: reply.empty,
                  };
                }
              } else {
                rootReply = reply;
                // console.log('root reply', reply);
              }
              // console.log('→', replies);
              if (reply.keepIfEmpty || !reply.skipChildren) {
                if (options.cloneDeep && reply.cloneDeep) {
                  if (context.path !== undefined) {
                    _.set(res, context.path, options.cloneDeep(value));
                  } else {
                    res = options.cloneDeep(value);
                  }
                } else {
                  if (context.path !== undefined) {
                    _.set(
                      res,
                      context.path,
                      _.isArray(value) ? [] : _.isPlainObject(value) ? {} : value
                    );
                  } else {
                    res = _.isArray(value)
                      ? []
                      : _.isPlainObject(value)
                      ? {}
                      : value;
                  }
                }
              }
              return !reply.skipChildren;
            } else {
              // console.log('fc: ', context.path);
              _.unset(res, context.path);

              if (options.keepCircular) {
                foundCircular.push([context.path, context.circularParent.path]);
              }
              return false;
            }
          } else if (context.afterIterate && !context.isCircular) {
            // console.log('ai: ', context.path);
            if (
              curPath === undefined &&
              rootReply.empty &&
              !rootReply.keepIfEmpty
            ) {
              res = null;
            } else if (
              curPath !== undefined &&
              replies[curPath].empty &&
              !replies[curPath].keepIfEmpty
            ) {
              _.unset(res, context.path);
            } else {
              _.eachRight(context.parents, function(parent) {
                var p = pathToString(parent.path);
                if (p !== undefined && replies[p].empty) {
                  replies[p].empty = false;
                } else {
                  return false;
                }
              });
              rootReply.empty = false;
            }

            // console.log('←', replies);
            return;
          }
        },
        eachDeepOptions
      );
      if (rootReply && rootReply.empty && !rootReply.keepIfEmpty) {
        res = null;
      } else {
        _.each(replies, (reply, path) => {
          if (reply.empty && !reply.keepIfEmpty) {
            _.unset(res, path);
          }
        });
      }
      _.each(foundCircular, function(c) {
        var cv;
        var found = c[1] === undefined || exists(res, c[1]);
        if (!found) return;
        // console.log('circular: ', c[0], c[1]);
        if (_.has(options, 'replaceCircularBy')) {
          cv = options.replaceCircularBy;
        } else {
          cv = obtain(res, c[1]);
        }
        _.set(res, c[0], cv);
      });
      if (options.condense) {
        //console.log('filterDeep → condenseDeep');
        res = condenseDeep(res, { checkCircular: options.checkCircular });
      }
      if (_.isArray(res) && !res.length && !eachDeepOptions.includeRoot)
        return null;
      return res;
    }
    return filterDeep;
  }

  var deps = {};

  var _isArray = Array.isArray;

  function forArray(arr, iteratee) {
    for (var i = 0; i < arr.length; i++) {
      if (iteratee(arr[i], i, arr) === false) break;
    }
    return arr;
  }

  var deps$1 = {
    isString: _isString,
    isArray: _isArray,
    reduce: _reduce,
  };

  var deps$2 = {
    some: _some,
    get: _get,
    isEmpty: _isEmpty,
  };

  var deps$1$1 = _merge(
    {
      isObject: _isObject,
      isEmpty: _isEmpty,
      findIndex: _findIndex,
      forOwn: _forOwn,
      forArray: forArray,
      get: _get,
      isArray: _isArray,
    },
    deps$1,
    deps$2
  );

  var deps$2$1 = _merge(
    {
      identity: _identity,
      merge: _merge,
      isArray: _isArray,
      isString: _isString,
      toPath: _toPath,
    },
    deps$1$1
  );

  var deps$3 = _merge(
    {
      merge: _merge,
      isArray: _isArray,
      forArray: forArray,
    },
    deps,
    deps$2$1
  );

  var deps$4 = {
    isArray: _isArray,
    clone: _clone,
    toPath: _toPath,
    get: _get,
  };

  var deps$5 = { get: _get };

  var deps$6 = _merge(
    {
      merge: _merge,
      clone: _clone,
      cloneDeep: _cloneDeep,
      isArray: _isArray,
      isObject: _isObject,
      each: _each,
      eachRight: _eachRight,
      has: _has,
      set: _set,
      unset: _unset,
      isPlainObject: _isPlainObject,
      iteratee: _iteratee,
    },
    deps$2$1,
    deps$1,
    deps$5,
    deps$3,
    deps$4
  );

  var filterDeep = getFilterDeep(deps$6);

  var obj = { a: true, b: false };
  each(obj, (v) => console.log(v));
  console.log(filterDeep(obj));

}));
