'use strict';
(function() {
  function apply(_) {
    var rxArrIndex = /^\d+$/;
    var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
    var errorNoLeavesOnlyAndTree =
      '"leavesOnly" option cannot be true in the "tree" mode.';
    function obtain(obj, path) {
      if (path === undefined) {
        return obj;
      }
      return _.get(obj, path);
    }
    if (!_.obtain) {
      _.mixin({ obtain: obtain }, { chain: true });
    }
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
    if (!_.pathToString) {
      _.mixin({ pathToString: pathToString }, { chain: false });
    }
    function pathMatches(path, paths) {
      var pathString;
      var pathArray;
      if (_.isString(path)) {
        pathString = path;
      } else {
        pathArray = path;
      }
      if (!_.isArray(paths)) {
        paths = [paths];
      }
      for (var i = 0; i < paths.length; i++) {
        if (_.isString(paths[i])) {
          paths[i] = _.toPath(paths[i]);
        }
        if (_.isArray(paths[i])) {
          if (pathArray === undefined) {
            pathArray = _.toPath(pathString);
          }
          if (
            pathArray.length >= paths[i].length &&
            _.isEqual(_.takeRight(pathArray, paths[i].length), paths[i])
          ) {
            // console.log('path matched');
            return paths[i];
          }
        } else if (paths[i] instanceof RegExp) {
          if (pathString === undefined) {
            pathString = pathToString(path);
          }
          if (paths[i].test(pathString)) {
            // console.log('regex matched', paths[i]);
            return paths[i];
          }
        } else {
          throw new Error(
            'To match path use only string/regex or array of them.'
          );
        }
      }
      // console.log('matched nothing');
      return false;
    }
    if (!_.pathMatches) {
      _.mixin({ pathMatches: pathMatches }, { chain: false });
    }

    function iterate(
      value,
      callback,
      options,
      key,
      path,
      depth,
      parent,
      parents,
      obj
    ) {
      var currentObj = {
        value: value,
        key: key,
        path: options.pathFormat == 'array' ? path : pathToString(path),
        parent: parent,
        isTreeNode:
          (parent && parent.isTreeChildren) ||
          (!depth && options.tree && !parent && options.includeRoot),
      };
      // console.log('it', currentObj.path);
      var currentParents = parents.concat(currentObj);
      if (options.tree) {
        if (!depth && options.tree.rootIsChildren) {
          currentObj.isTreeChildren = true;
          currentObj.treeChildrenPath = undefined;
        } else {
          var matches = pathMatches(path, options.tree.children);
          if (matches !== false) {
            currentObj.isTreeChildren = true;
            currentObj.treeChildrenPath =
              options.pathFormat == 'array' || !_.isArray(matches)
                ? matches
                : pathToString(matches);
          } else {
            currentObj.isTreeChildren = false;
          }
        }
      }
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
      var res;
      var needCallback =
        (options.tree &&
          ((parent && parent.isTreeChildren) ||
            (!depth && options.includeRoot))) ||
        (!options.tree && (depth || options.includeRoot));
      if (needCallback) {
        res = callback(value, key, parent && parent.value, context);
      }
      if (res !== false && !isCircular && _.isObject(value)) {
        //         if (options.tree) {
        //           _.each(options.tree.children, function(cp) {
        //             var children = _.get(value, cp);
        //             if (children && _.isObject(children)) {
        //               _.forOwn(children, function(childValue, childKey) {
        //                 var childPath = (path || []).concat(cp,[childKey]);
        //
        //                 iterate(
        //                   childValue,
        //                   callback,
        //                   options,
        //                   childKey,
        //                   childPath,
        //                   depth + 1,
        //                   currentObj,
        //                   currentParents,
        //                   obj
        //                 );
        //               });
        //             }
        //           });
        //         } else {
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
        // }
      }
      if (options.callbackAfterIterate && needCallback) {
        context.afterIterate = true;
        callback(value, key, parent && parent.value, context);
      }
    }

    if (!_.eachDeep || !_.forEachDeep) {
      var eachDeep = function(obj, callback, options) {
        if (callback === undefined) callback = _.identity;
        options = _.merge(
          {
            includeRoot: !_.isArray(obj),
            pathFormat: 'string',
            checkCircular: false,
          },
          options || {}
        );
        if (options.tree) {
          if (!_.isObject(options.tree)) {
            options.tree = {};
          }
          if (
            !options.includeRoot &&
            options.tree.rootIsChildren === undefined
          ) {
            options.tree.rootIsChildren = _.isArray(obj);
          }
          if (options.tree.children === undefined) {
            options.tree.children = ['children'];
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
      };
      if (!_.eachDeep) {
        _.mixin({ eachDeep: eachDeep });
      }
      if (!_.forEachDeep) {
        _.mixin({ forEachDeep: eachDeep });
      }
    }
    if (!_.index) {
      var index = function(obj, options) {
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
        }

        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leavesOnly: !options || !options.tree,
          },
          options || {}
        );
        if (options.tree && options.leavesOnly) {
          throw new Error(errorNoLeavesOnlyAndTree);
        }
        var eachDeepOptions = {
          pathFormat: 'string',
          checkCircular: options.checkCircular,
          tree: options.tree,
          includeRoot: options.includeRoot,
        };
        var res = {};
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (!context.isCircular || options.includeCircularPath) {
              if (
                !options.tree &&
                options.leavesOnly &&
                context.parent &&
                res[context.parent.path]
              ) {
                delete res[context.parent.path];
              }
              if (context.path !== undefined) {
                res[context.path] = value;
              }
            }
          },
          eachDeepOptions
        );
        return res;
      };
      _.mixin({ index: index });
    }
    if (!_.keysDeep || !_.paths) {
      var paths = function(obj, options) {
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
        }
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leavesOnly: !options || !options.tree,
            pathFormat: 'string',
          },
          options || {}
        );
        if (options.tree && options.leavesOnly) {
          throw new Error(errorNoLeavesOnlyAndTree);
        }
        var eachDeepOptions = {
          pathFormat: options.pathFormat,
          checkCircular: options.checkCircular,
          tree: options.tree,
          includeRoot: options.includeRoot,
        };
        var res = [];
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (!context.isCircular || options.includeCircularPath) {
              if (
                !options.tree &&
                options.leavesOnly &&
                context.parent &&
                _.last(res) === context.parent.path
              ) {
                res.pop();
              }
              if (context.path !== undefined) {
                res.push(context.path);
              }
            }
          },
          eachDeepOptions
        );
        return res;
      };
      if (!_.keysDeep) {
        _.mixin({ keysDeep: paths });
      }
      if (!_.paths) {
        _.mixin({ paths: paths });
      }
    }
    if (!_.exists) {
      _.mixin(
        {
          exists: function(obj, path) {
            path = _.isArray(path) ? _.clone(path) : _.toPath(path);
            var key = path.pop();
            var parent = path.length ? _.get(obj, path) : obj;
            return parent !== undefined && key in parent;
          },
        },
        { chain: false }
      );
    }
    if (!_.condense) {
      _.mixin({
        condense: function(arr) {
          _.remove(arr, function(val, key, coll) {
            return !(key in coll);
          });
          return arr;
        },
      });
    }
    if (!_.condenseDeep) {
      var condenseDeep = function(obj, options) {
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
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (!context.isCircular && _.isArray(value)) arrays.push(value);
          },
          eachDeepOptions
        );
        if (_.isArray(obj)) arrays.push(obj);
        _.each(arrays, _.condense);
        return obj;
      };
      _.mixin({
        condenseDeep: condenseDeep,
      });
    }
    if (!_.filterDeep) {
      var filterDeep = function(obj, predicate, options) {
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
        if (options.tree) {
          if (options.leavesOnly) {
            throw new Error(errorNoLeavesOnlyAndTree);
          }
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
            leavesOnly: true,
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
          tree: options.tree,
          includeRoot: options.includeRoot,
          callbackAfterIterate: true,
        };

        var res = _.isArray(obj) ? [] : _.isObject(obj) ? {} : null;
        var replies = {};
        var rootReply;
        var foundCircular = [];
        //console.log('filterDeep → eachDeep');
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            var curPath = pathToString(context.path);
            if (!context.afterIterate) {
              if (!context.isCircular) {
                // console.log('fr: ', context.path);
                var reply;
                if (
                  !options.leavesOnly ||
                  (context.parent && context.parent.isTreeChildren) ||
                  !_.isObject(value) ||
                  _.isEmpty(value)
                ) {
                  reply = predicate(value, key, parent, context);
                  // console.log('?', reply);
                }
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
                  // console.log(`reply @${curPath}`, reply);
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
                        _.isArray(value)
                          ? []
                          : _.isPlainObject(value)
                          ? {}
                          : value
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
                  foundCircular.push([
                    context.path,
                    context.circularParent.path,
                  ]);
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
                var p = !options.tree
                  ? context.parent
                  : _.findLast(context.parents, 'isTreeNode');

                if (p && p.path != undefined) {
                  p = pathToString(p.path);
                  // if (!replies[p])
                  //   console.log('no reply for "' + p + '"', p);
                  replies[p].empty = false;
                } else if (rootReply) {
                  rootReply.empty = false;
                }
              }
              if (curPath !== undefined) {
                delete replies[curPath];
              } else {
                //delete rootReply;
              }

              // console.log('←', replies);
              return;
            } else {
              // console.log('aic: ', context.path);
            }
          },
          eachDeepOptions
        );
        _.each(foundCircular, function(c) {
          var cv;
          var exists = c[1] === undefined || _.exists(res, c[1]);
          if (!exists) return;
          // console.log('circular: ', c[0], c[1]);
          if (_.has(options, 'replaceCircularBy')) {
            cv = options.replaceCircularBy;
          } else {
            cv = _.obtain(res, c[1]);
          }
          _.set(res, c[0], cv);
        });
        if (options.condense) {
          //console.log('filterDeep → condenseDeep');
          res = _.condenseDeep(res, { checkCircular: options.checkCircular });
        }
        if (_.isArray(res) && !res.length && !eachDeepOptions.includeRoot)
          return null;
        return res;
      };

      _.mixin({ filterDeep: filterDeep });
    }

    if (!_.omitDeep) {
      var omitDeep = function(obj, paths, options) {
        options = _.merge(
          {
            invert: false,
          },
          options || {}
        );
        var isOmit = !options.invert;
        options = _.merge(
          {
            onMatch: {
              cloneDeep: false,
              skipChildren: false,
              keepIfEmpty: !isOmit,
            },
            onNotMatch: {
              cloneDeep: false,
              skipChildren: false,
              keepIfEmpty: isOmit,
            },
          },
          options
        );
        options.leavesOnly = false;
        options.tree = false;
        options.pathFormat = 'array';
        options.onTrue = options.invert ? options.onMatch : options.onNotMatch;
        options.onFalse = options.invert ? options.onNotMatch : options.onMatch;

        var test = function(value, key, parent, context) {
          if (pathMatches(context.path, paths) !== false) {
            // console.log('path match, return ', options.invert);
            return options.invert;
          } else {
            // console.log('path not match, return ', !options.invert);
            return !options.invert;
          }
        };
        // console.log(options);
        return _.filterDeep(obj, test, options);
      };
      _.mixin({ omitDeep: omitDeep });
    }

    if (!_.pickDeep) {
      var pickDeep = function(obj, paths, options) {
        options = _.merge(
          {
            invert: false,
          },
          options || {}
        );
        options.invert = true;
        return _.omitDeep(obj, paths, options);
      };
      _.mixin({ pickDeep: pickDeep });
    }

    return _;
  }

  if (
    typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined' &&
    !process.env.likebrowser
  ) {
    module.exports = apply;
  } else {
    if (typeof _ !== 'undefined') {
      apply(_);
    } else throw new Error('No lodash to mixin');
  }
})();
