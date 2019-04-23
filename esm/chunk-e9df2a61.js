import { a as condenseDeps } from './chunk-7d4d11c9.js';
import _merge from 'lodash/merge';
import _isArray from './isArray.js';
import forArray from './forArray.js';
import { a as eachDeepDeps } from './chunk-e6b54344.js';

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
