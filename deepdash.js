'use strict';
(function() {
  function apply(_) {
    var rxArrIndex = /^\d+$/;
    var rxVarName = /^[a-zA-Z_$]+([\w_$]*)$/;
    function pathToString(path) {
      if (_.isString(path)) return path;
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
      if (!_.isObject(value)) return;
      if (key === undefined) key = '';
      if (path === undefined) path = [];
      if (depth === undefined) depth = 0;
      if (parents === undefined) parents = [];
      if (obj === undefined) obj = value;

      var currentObj = {
        value: value,
        key: key,
        path: options.pathFormat == 'array' ? path : pathToString(path),
        parent: parent,
      };
      var currentParents = parents.concat(currentObj);
      _.forOwn(value, function(childValue, childKey) {
        if (_.isArray(value)) {
          if (childValue === undefined && !(childKey in value)) {
            return; //empty slot
          }
        }

        var childPath = path.concat([childKey]);
        var res = callback(childValue, childKey, value, {
          path:
            options.pathFormat == 'array' ? childPath : pathToString(childPath),
          parent: currentObj,
          parents: currentParents,
          obj: obj,
          depth: depth,
        });
        if (res !== false && _.isObject(value)) {
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
        }
      });
    }

    if (!_.eachDeep || !_.forEachDeep) {
      var eachDeep = function(obj, callback, options) {
        if (callback === undefined) callback = _.identity;
        options = _.merge({}, options || {});
        iterate(obj, callback, options);
        return obj;
      };
      if (!_.eachDeep) {
        _.mixin({ eachDeep: eachDeep });
      }
      if (!_.forEachDeep) {
        _.mixin({ forEachDeep: eachDeep });
      }
    }
    if (!_.indexate) {
      var indexate = function(obj, options) {
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
        }

        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leavesOnly: true,
          },
          options || {}
        );
        var eachDeepOptions = {
          pathFormat: 'string',
        };
        var res = {};
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            var circular = false;
            if (options.checkCircular) {
              circular = _.findIndex(context.parents, ['value', value]) !== -1;
            }
            if (!circular || options.includeCircularPath) {
              if (options.leavesOnly && res[context.parent.path]) {
                delete res[context.parent.path];
              }
              res[context.path] = value;
            }
            if (circular) {
              return false;
            }
          },
          eachDeepOptions
        );
        return res;
      };
      _.mixin({ indexate: indexate });
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
            leavesOnly: true,
            pathFormat: 'string',
          },
          options || {}
        );
        var eachDeepOptions = {
          pathFormat: options.pathFormat,
        };
        var res = [];
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            var circular = false;
            if (options.checkCircular) {
              circular = _.findIndex(context.parents, ['value', value]) !== -1;
            }
            if (!circular || options.includeCircularPath) {
              if (options.leavesOnly && _.last(res) === context.parent.path) {
                res.pop();
              }
              res.push(context.path);
            }
            if (circular) {
              return false;
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
        var eachDeepOptions = {};
        var arrays = [];
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            if (
              options.checkCircular &&
              _.findIndex(context.parents, ['value', value]) !== -1
            ) {
              return false;
            }
            if (_.isArray(value)) arrays.push(value);
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
        if (options && options.leafsOnly !== undefined) {
          options.leavesOnly = options.leafsOnly;
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
            keepUndefined: false,
          },
          options || {}
        );
        var eachDeepOptions = {
          pathFormat: options.pathFormat,
        };
        var res = _.isArray(obj) ? [] : {};
        var foundCircular = [];
        var checkCircular = function(value, path, parents) {
          if (!options.checkCircular) return false;
          var cp = _.find(parents, ['value', value]);
          if (cp) {
            if (options.keepCircular) {
              foundCircular.push([path, cp.path]);
            }
            return true;
          }
          return false;
        };
        // console.log('filterDeep', obj);
        _.eachDeep(
          obj,
          function(value, key, parent, context) {
            var circular = false;
            var isLeaf = !_.isObject(value) || _.isEmpty(value);
            if (!isLeaf) {
              circular = checkCircular(value, context.path, context.parents);
            }
            // console.log('filter each, l:' + isLeaf + ', c:' + circular, context.path);
            if (!circular) {
              if (isLeaf || !options.leavesOnly) {
                var condition = predicate(value, key, parent, context);
                if (condition === true) {
                  _.set(res, context.path, options.cloneDeep(value));
                } else if (condition === undefined && options.keepUndefined) {
                  _.set(
                    res,
                    context.path,
                    _.isArray(value) ? [] : _.isPlainObject(value) ? {} : value
                  );
                }

                return condition;
              }
            } else {
              return false;
            }
          },
          eachDeepOptions
        );
        _.each(foundCircular, function(c) {
          var cv;
          var has = c[1] == '' || _.has(res, c[1]);
          if (!has) return;
          if (_.has(options, 'replaceCircularBy')) {
            cv = options.replaceCircularBy;
          } else if (c[1] == '') {
            cv = res;
          } else {
            cv = _.get(res, c[1]);
          }
          _.set(res, c[0], cv);
        });
        if (options.condense)
          return _.condenseDeep(res, { checkCircular: options.checkCircular });
        return res;
      };

      _.mixin({ filterDeep: filterDeep });
    }

    if (!_.omitDeep) {
      var omitDeep = function(obj, keys, options) {
        options = _.merge(
          {
            checkCircular: false,
            keepCircular: true,
            //replaceCircularBy: <by>,
            condense: true,
          },
          options || {}
        );
        options.leavesOnly = false;
        options.pathFormat = 'array';
        options.keepUndefined = true;
        options.cloneDeep = _.cloneDeep;

        if (!_.isArray(keys)) keys = [keys];
        keys = _.groupBy(keys, function(key) {
          return key instanceof RegExp ? 'regex' : 'const';
        });
        var test = function(value, key) {
          if (_.includes(keys.const, key)) {
            return false;
          }
          if (
            _.some(keys.regex, function(rx) {
              return rx.test(key);
            })
          ) {
            return false;
          }
          if (_.isObject(value) && _.size(value) !== 0) return undefined;
          return true;
        };
        return _.filterDeep(obj, test, options);
      };
      _.mixin({ omitDeep: omitDeep });
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
