import _isArray from './isArray.js';
import _isString from 'lodash/isString';
import _reduce from 'lodash/reduce';

var deps = {
  isString: _isString,
  isArray: _isArray,
  reduce: _reduce,
};

export { deps as a };
