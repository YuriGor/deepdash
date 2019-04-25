'use strict';

var filterDeep = require('deepdash/es/filterDeep');

var obj = { a: true, b: false };
console.log('filterDeep standalone', filterDeep(obj));
