const lodash = require('lodash').runInContext();

let standalone = require('../standalone');
// if (standalone.eachDeep) {
//   console.log('standalone has eachDeep!!!');
// } else {
//   console.log('standalone has NO eachDeep!!!');
// }

standalone = lodash.merge({}, lodash.runInContext(), standalone);
standalone.v = 'standalone';

let deepdashAsAnObj = lodash.merge({}, lodash.runInContext());
delete deepdashAsAnObj.mixin;
delete deepdashAsAnObj.chain;
deepdashAsAnObj.v = 'object cherry-pick';

const deepdash = require('../deepdash');
const _ = deepdash(lodash.runInContext());

module.exports = {
  forLodashes: (methods, test, title) => {
    if (_.isString(methods)) {
      methods = [methods];
    }

    const standaloneCherry = { v: 'standalone cherry-pick' };
    methods.forEach((method) => {
      standaloneCherry[method] = require('../' + method);
      require('../' + _.camelCase('add ' + method))(deepdashAsAnObj);
    });

    const lodashes = [
      _,
      lodash.merge({}, lodash.runInContext(), standaloneCherry),
      standalone,
      deepdashAsAnObj,
    ];
    // console.log('standalone:', standalone.filterDeep);

    lodashes.forEach(function(dd) {
      describe((dd.v || '') + ' ' + (title || methods.join(' + ')), () => {
        test(dd);
      });
    });
  },
  validateIteration: function(value, key, parentVal, context, options) {
    options = _.merge({}, options || {});
    if (options.method === 'filterDeep') {
      options.callbackAfterIterate = true;
    }
    if (options.includeRoot === undefined)
      options.includeRoot = !_.isArray(value);
    if (options.pathFormat === undefined) options.pathFormat = 'string';
    if (options.checkCircular === undefined) options.checkCircular = false;
    if (options.childrenPath) {
      if (!_.isObject(options.childrenPath)) {
        options.childrenPath = {};
      }
      if (!options.includeRoot && options.rootIsChildren === undefined) {
        options.rootIsChildren = _.isArray(value);
      }
      if (!options.childrenPath) {
        options.childrenPath = ['children'];
      }
    }
    try {
      if (
        key !== undefined &&
        !options.childrenPath &&
        !_.exists(parentVal, key)
      ) {
        throw new Error(`key "${key}" not found.`);
      }
      if (!context) {
        throw new Error('context not exists');
      }
      if (options.childrenPath) {
        if (!context.depth && context.childrenPath !== undefined) {
          throw new Error(
            `children path ${context.childrenPath} on zero depth`
          );
        }
        // if (context.depth && context.childrenPath === undefined) {
        //   throw new Error(`no children path on depth ${context.depth}`);
        // }
        if (context.childrenPath) {
          var children = _.obtain(parentVal, context.childrenPath);
          if (!children) {
            throw new Error(
              `no children collection found by children path ${context.childrenPath}`
            );
          }
          if (!_.exists(children, key)) {
            throw new Error(`child not found by key ${key}`);
          }
        }
      }

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
          if (
            !(
              parent.childrenPath === undefined ||
              _.isArray(parent.childrenPath)
            )
          ) {
            throw new Error(
              `parents children path ${parent.childrenPath} is not array`
            );
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

        if (
          !(
            context.childrenPath === undefined ||
            _.isArray(context.childrenPath)
          )
        ) {
          throw new Error(`children path ${context.childrenPath} is not array`);
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
          if (
            !(
              parent.childrenPath === undefined ||
              _.isString(parent.childrenPath)
            )
          ) {
            throw new Error(
              `parents children path ${parent.childrenPath} is not string`
            );
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
        if (
          !(
            context.childrenPath === undefined ||
            _.isString(context.childrenPath)
          )
        ) {
          throw new Error(
            `children path ${context.childrenPath} is not string`
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
        if (!options.childrenPath && parentVal[key] !== value)
          throw new Error('value doesnt match one got by key');
        if (
          options.childrenPath &&
          _.obtain(parentVal, context.childrenPath)[key] != value
        )
          throw new Error('child value doesnt match one got by key');
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
