'use strict';

var getIterate = require('./private/getIterate.js');

function getEachDeep(_) {
  var iterate = getIterate(_);

  function eachDeep(obj, callback, options) {
    if (callback === undefined) { callback = _.identity; }
    options = _.merge(
      {
        includeRoot: !Array.isArray(obj),
        pathFormat: 'string',
        checkCircular: false,
        leavesOnly: false,
        ownPropertiesOnly: true, //
      },
      options || {}
    );
    if (options.childrenPath !== undefined) {
      if (!options.includeRoot && options.rootIsChildren === undefined) {
        options.rootIsChildren = Array.isArray(obj);
      }
      if (
        !_.isString(options.childrenPath) &&
        !Array.isArray(options.childrenPath)
      ) {
        throw Error('childrenPath can be string or array');
      } else {
        if (_.isString(options.childrenPath)) {
          options.childrenPath = [options.childrenPath];
        }
        options.strChildrenPath = options.childrenPath;
        options.childrenPath = [];
        for (var i = options.strChildrenPath.length - 1; i >= 0; i--) {
          options.childrenPath[i] = _.toPath(options.strChildrenPath[i]);
        }
      }
    }
    iterate({
      value: obj,
      callback: callback,
      options: options,
      obj: obj,
    });
    return obj;
  }
  return eachDeep;
}

module.exports = getEachDeep;
