import _isString from 'lodash-es/isString';
import _isArray from './own/isArray';
import _reduce from 'lodash-es/reduce';

var deps = {
  isString: _isString,
  isArray: _isArray,
  reduce: _reduce,
};

export default deps;
