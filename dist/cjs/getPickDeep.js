'use strict';

require('./getCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
require('./getCondenseDeep.js');
require('./getExists.js');
require('./getObtain.js');
require('./getFilterDeep.js');
require('./getPathMatches.js');
var getOmitDeep = require('./getOmitDeep.js');

function getPickDeep(_) {
  var omitDeep = getOmitDeep(_);
  function pickDeep(obj, paths, options) {
    options = _.merge(
      {
        invert: false,
      },
      options || {}
    );
    options.invert = true;
    return omitDeep(obj, paths, options);
  }
  return pickDeep;
}

module.exports = getPickDeep;
