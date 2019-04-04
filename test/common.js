const _ = require('../deepdash')(require('lodash'));

module.exports = {
  validateIteration: function(value, key, parentVal, context, options) {
    if (key !== undefined && !_.exists(parentVal, key)) {
      throw new Error(`key "${key}" not found.`);
    }
    if (!context) {
      throw new Error('context not exists');
    }
    options = options || {};
    if (options.method === 'filterDeep') {
      options.callbackAfterIterate = true;
    }
    if (options.includeRoot === undefined)
      options.includeRoot = !_.isArray(value);
    if (options.pathFormat === undefined) options.pathFormat = 'string';
    if (options.checkCircular === undefined) options.checkCircular = false;
    if (options.tree) {
      if (!_.isObject(options.tree)) {
        options.tree = {};
      }
      if (!options.includeRoot && options.tree.rootIsChildren === undefined) {
        options.tree.rootIsChildren = _.isArray(value);
      }
      if (!options.tree.children) {
        options.tree.children = ['children'];
      }
    }
    try {
      if (options.pathFormat == 'array') {
        if (!(context.path === undefined || _.isArray(context.path))) {
          throw new Error(`path ${context.path} is not array`);
        }

        if (
          context.parent &&
          !(context.parent.path === undefined || _.isArray(context.parent.path))
        ) {
          throw new Error(`parent path ${context.parent.path} is not array`);
        }

        _.each(context.parents, (parent) => {
          if (!(parent.path === undefined || _.isArray(parent.path))) {
            throw new Error(`parents path ${parent.path} is not array`);
          }
        });
        if (
          context.circularParent &&
          !(
            context.circularParent.path === undefined ||
            _.isArray(context.circularParent.path)
          )
        ) {
          throw new Error(
            `circular parent path ${context.circularParent.path} is not array`
          );
        }
      } else {
        if (!(context.path === undefined || _.isString(context.path))) {
          throw new Error(`path ${context.path} is not string`);
        }
        if (
          context.parent &&
          !(
            context.parent.path === undefined || _.isString(context.parent.path)
          )
        ) {
          throw new Error(`parent path ${context.parent.path} is not string`);
        }
        _.each(context.parents, (parent) => {
          if (!(parent.path === undefined || _.isString(parent.path))) {
            throw new Error(`parents path ${parent.path} is not string`);
          }
        });
        if (
          context.circularParent &&
          !(
            context.circularParent.path === undefined ||
            _.isString(context.circularParent.path)
          )
        ) {
          throw new Error(
            `circular parent path ${context.circularParent.path} is not string`
          );
        }
      }

      if (context.path !== undefined && !_.exists(context.obj, context.path)) {
        throw new Error(`path ${context.path} not exists`);
      }
      if (
        context.parent &&
        context.parent.path !== undefined &&
        !_.exists(context.obj, context.parent.path)
      ) {
        throw new Error(`parent path ${context.parent.path} not exists`);
      }

      _.each(context.parents, (parent) => {
        if (parent.path !== undefined && !_.exists(context.obj, parent.path)) {
          throw new Error(`parents path ${parent.path} not exists`);
        }
      });

      if (
        context.circularParent &&
        context.circularParent.path !== undefined &&
        !_.exists(context.obj, context.circularParent.path)
      ) {
        throw new Error(
          `circularParent path ${context.circularParent.path} not exists`
        );
      }

      if (!_.isInteger(context.depth) || context.depth < 0)
        throw new Error(`incorrect depth ${context.depth}`);
      if (context.parents === undefined)
        throw new Error(`undefined parents on depth ${context.depth}`);
      if (context.depth) {
        if (value === context.obj && !context.isCircular)
          throw new Error(
            `value must not be source object on depth ${context.depth}`
          );
        if (context.isCircular) {
          if (value !== context.circularParent.value)
            throw new Error(`circular value must be equal to circularParent`);

          if (value !== _.obtain(context.obj, context.circularParent.path)) {
            throw new Error(
              `circular value doesnt match one by circularParent path`
            );
          }
        }
        if (key === undefined)
          throw new Error(`undefined key on depth ${context.depth}`);
        if (parentVal === undefined)
          throw new Error(`undefined parentVal on depth ${context.depth}`);
        if (context.path === undefined)
          throw new Error(`undefined path on depth ${context.depth}`);
        if (context.parent === undefined)
          throw new Error(`undefined parent on depth ${context.depth}`);
        if (!context.parents.length)
          throw new Error(`empty parents on depth ${context.depth}`);
        if (!context.obj || !_.isObject(context.obj) || _.isEmpty(context.obj))
          throw new Error(`incorrect obj on depth ${context.depth}`);
        if (parentVal[key] !== value)
          throw new Error('value doesnt match one got by key');
        if (_.get(context.obj, context.path) !== value)
          throw new Error('value doesnt match one got by path');
        if (
          context.parent.path !== undefined &&
          _.get(context.obj, context.parent.path) !== parentVal
        )
          throw new Error('parentVal doesnt match one got by parent.path');
        if (context.parent.path === undefined && context.obj !== parentVal)
          throw new Error(
            'parentVal doesnt match obj when parent.path is undefined'
          );
      } else {
        if (!options.includeRoot)
          // console.log({ value, key, parentVal, context });
          throw new Error(`depth ${context.depth} while not includeRoot`);
        if (value !== context.obj)
          throw new Error(
            `value must be source object on depth ${context.depth}`
          );
        if (key !== undefined)
          throw new Error(`defined key on depth ${context.depth}`);
        if (parentVal !== undefined) {
          // console.log({ value, key, parentVal, context });
          throw new Error(`defined parentVal on depth ${context.depth}`);
        }
        if (context.path !== undefined)
          throw new Error(`defined path on depth ${context.depth}`);
        if (context.parent !== undefined)
          throw new Error(`defined parent on depth ${context.depth}`);
        if (context.parents.length)
          throw new Error(`not empty parents on depth ${context.depth}`);
      }

      if (!options.checkCircular) {
        if (context.isCircular != undefined)
          throw new Error(`defined isCircular while checkCircular is off`);
        if (context.circularParent != undefined)
          throw new Error(`defined circularParent while checkCircular is off`);
        if (context.circularParentIndex != undefined)
          throw new Error(
            `defined circularParentIndex while checkCircular is off`
          );
      } else {
        if (!_.isBoolean(context.isCircular)) {
          // console.log(options);
          throw new Error(`not boolean isCircular while checkCircular is on`);
        }
        if (
          context.circularParent !== null &&
          !_.isObject(context.circularParent)
        )
          throw new Error(`incorrect circularParent while checkCircular is on`);
        if (
          !_.isInteger(context.circularParentIndex) ||
          context.circularParentIndex < -1
        )
          throw new Error(
            `defined circularParentIndex while checkCircular is on`
          );
      }
    } catch (err) {
      console.log('-----------------');
      console.log(err.message);
      console.log('-----------------');
      console.log({ value, key, parentVal, context, options });
      throw err;
    }
  },
};
