'use strict';

var getCondense = require('./getCondense.js');
require('./deps/condense.js');

var condense = getCondense();

module.exports = condense;
