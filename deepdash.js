'use strict';

(function() {
  function apply(_) {
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
      path = _.trim(path, '.');
      parentPath = _.trim(parentPath, '.');
      if (options.track) {
        options.parents.values.push(parent);
        options.parents.keys.push(parentKey);
        options.parents.paths.push(parentPath);
      }
      if(!_.isObject(obj))
        return;
      _.forOwn(obj, function(value, key) {
        var okey = key;
        if (_.isArray(obj)) key = '[' + key + ']';
        else {
          if (_.isString(key) && key.match(/^[a-zA-Z_$]+([\w_$]*)$/))
            key = '.' + key;
          else key = '["' + key + '"]';
        }
        var currentPath = _.trim(path + key, '.');
        var res = callback(
          value,
          okey,
          currentPath,
          depth,
          obj,
          parentKey,
          _.trim(path, '.'),
          options.parents
        );
        if (res !== false && _.isObject(value)) {
          iterate(
            value,
            path + key,
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

    if (!_.eachDeep||!_.forEachDeep) {
      function eachDeep(obj, callback, options) {
        if (callback === undefined) callback = _.identity;
        options = _.merge(
          {
            track: false,
          },
          options || {}
        );
        if (options.track) {
          options.parents = { keys: [], paths: [], values: [] };
        }
        iterate(obj, '', 0, null, '', '', callback, options);
        return obj;
      }
      if(!_.eachDeep){
        _.mixin({ eachDeep: eachDeep });
      }
      if (!_.forEachDeep) {
        _.mixin({ forEachDeep: eachDeep });
      }
    }
    if(!_.indexate){
      function indexate(obj, options) {
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leafsOnly:false
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
              circular =_.indexOf(parents.values, value) !== -1;
            }
            if(!circular||options.includeCircularPath){
              if(options.leafsOnly && res[parentPath]){
                delete res[parentPath];
              }
              res[path]=value;
            }
            if(circular){
              return false;
            }
          },
          eachDeepOptions
        );
        return res;
      }
      if(!_.indexate){
        _.mixin({ indexate: indexate });
      }
    }
    if (!_.keysDeep||!_.paths) {
      function paths(obj, options) {
        options = _.merge(
          {
            checkCircular: false,
            includeCircularPath: true,
            leafsOnly:false
          },
          options || {}
        );
        var eachDeepOptions = {
          track: options.checkCircular,
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
              circular =_.indexOf(parents.values, value) !== -1;
            }
            if(!circular||options.includeCircularPath){
              if(options.leafsOnly && _.last(res)===parentPath){
                res.pop();
              }
              res.push(path);
            }
            if(circular){
              return false;
            }
          },
          eachDeepOptions
        );
        return res;
      }
      if(!_.keysDeep){
        _.mixin({ keysDeep: paths });
      }
      if (!_.paths) {
        _.mixin({ paths: paths });
      }
    }

    return _;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = apply;
  else if (_) apply(_);
  else throw new Error('No lodash to patch');
})();
