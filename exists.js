'use strict';

var getExists = require('./getExists.js');
require('./isArray.js');
require('lodash/toPath');
require('lodash/get');
require('lodash/clone');
var __chunk_6 = require('./chunk-d297bbe4.js');

var exists = getExists(__chunk_6.existsDeps);

module.exports = exists;
