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
      _.mixin({ pathToString: pathToString });
    }
    function iterate(
      obj,
      path,
      depth,
      parent,
      parentKey,
      parentPath,
      callback,
      options
    ) {
      if (options.track) {
        options.parents.values.push(parent);
        options.parents.keys.push(parentKey);
        options.parents.paths.push(
          options.pathFormat == 'array' ? parentPath : pathToString(parentPath)
        );
      }
      if (!_.isObject(obj)) return;
      _.forOwn(obj, function(value, key) {
        var okey = key;
        if (_.isArray(obj)) {
          if (value === undefined && !(key in obj)) {
            //empty slot
            return;
          }
        }

        var currentPath = path.concat([key]);
        var res = callback(
          value,
          okey,
          options.pathFormat == 'array'
            ? currentPath
            : pathToString(currentPath),
          depth,
          obj,
          parentKey,
          options.pathFormat == 'array' ? path : pathToString(path),
          options.parents
        );
        if (res !== false && _.isObject(value)) {
          iterate(
            value,
            currentPath,
            depth + 1,
            obj,
            okey,
            path,
            callback,
            options
          );
        }
      });
      if (options.track) {
        options.parents.values.pop();
        options.parents.keys.pop();
        options.parents.paths.pop();
      }
    }

    if (!_.eachDeep || !_.forEachDeep) {
      var eachDeep = function(obj, callback, options) {
        if (callback === undefined) callback = _.identity;
        options = _.merge(
          {
            track: false,
            pathFormat: 'string',
          },
          options || {}
        );
        if (options.track) {
          options.parents = { keys: [], paths: [], values: [] };
        }
        iterate(obj, [], 0, null, '', [], callback, options);
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
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leafsOnly: true,
          },
          options || {}
        );
        var eachDeepOptions = {
          track: options.checkCircular,
        };
        var res = {};
        _.eachDeep(
          obj,
          function(
            value,
            key,
            path,
            depth,
            parent,
            parentKey,
            parentPath,
            parents
          ) {
            var circular = false;
            if (options.checkCircular) {
              circular = _.indexOf(parents.values, value) !== -1;
            }
            if (!circular || options.includeCircularPath) {
              if (options.leafsOnly && res[parentPath]) {
                delete res[parentPath];
              }
              res[path] = value;
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
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leafsOnly: true,
            pathFormat: 'string',
          },
          options || {}
        );
        var eachDeepOptions = {
          track: options.checkCircular,
          pathFormat: options.pathFormat,
        };
        var res = [];
        _.eachDeep(
          obj,
          function(
            value,
            key,
            path,
            depth,
            parent,
            parentKey,
            parentPath,
            parents
          ) {
            var circular = false;
            if (options.checkCircular) {
              circular = _.indexOf(parents.values, value) !== -1;
            }
            if (!circular || options.includeCircularPath) {
              if (options.leafsOnly && _.last(res) === parentPath) {
                res.pop();
              }
              res.push(path);
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
      _.mixin({
        exists: function(obj, path) {
          path = _.isArray(path) ? _.clone(path) : _.toPath(path);
          var key = path.pop();
          var parent = path.length ? _.get(obj, path) : obj;
          return parent !== undefined && key in parent;
        },
      });
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
          track: options.checkCircular,
        };
        var arrays = [];
        _.eachDeep(
          obj,
          function(
            value,
            key,
            path,
            depth,
            parent,
            parentKey,
            parentPath,
            parents
          ) {
            if (
              options.checkCircular &&
              _.indexOf(parents.values, value) !== -1
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
        options = _.merge(
          {
            checkCircular: false,
            keepCircular: true,
            //replaceCircularBy: <by>,
            leafsOnly: true,
            condense: true,
            cloneDeep: _.cloneDeep,
            pathFormat: 'string',
          },
          options || {}
        );
        var eachDeepOptions = {
          track: options.checkCircular,
          pathFormat: options.pathFormat,
        };
        var res = _.isArray(obj) ? [] : {};
        var foundCircular = [];
        var checkCircular = function(value, path, parents) {
          if (!options.checkCircular) return false;
          var i = _.indexOf(parents.values, value);
          if (i !== -1) {
            if (options.keepCircular) {
              foundCircular.push([path, parents.paths[i]]);
            }
            return true;
          }
          return false;
        };
        // console.log('filterDeep', obj);
        _.eachDeep(
          obj,
          function(
            value,
            key,
            path,
            depth,
            parent,
            parentKey,
            parentPath,
            parents
          ) {
            var circular = false;
            var isLeaf = !_.isObject(value) || _.isEmpty(value);
            if (!isLeaf) {
              circular = checkCircular(value, path, parents);
            }
            // console.log('filter each, l:' + isLeaf + ', c:' + circular, path);
            if (!circular) {
              if (isLeaf || !options.leafsOnly) {
                var condition = predicate(
                  value,
                  key,
                  path,
                  depth,
                  parent,
                  parentKey,
                  parentPath,
                  parents
                );
                if (condition === true) {
                  _.set(res, path, options.cloneDeep(value));
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
