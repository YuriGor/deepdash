import { a as condenseDeps } from './chunk-7d4d11c9.js';
import _merge from 'lodash/merge';
import { a as _isArray } from './chunk-7273d013.js';
import { a as forArray, b as eachDeepDeps } from './chunk-c32702be.js';

var deps = _merge(
  {
    merge: _merge,
    isArray: _isArray,
    forArray: forArray,
  },
  condenseDeps,
  eachDeepDeps
);

export { deps as a };
