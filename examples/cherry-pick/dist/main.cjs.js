'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var filterDeep = _interopDefault(require('deepdash/filterDeep'));

var obj = { a: true, b: false };
console.log(filterDeep(obj));
