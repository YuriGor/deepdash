import _merge from 'lodash/merge';
import _isArray from './isArray.js';
import forArray from './forArray.js';
import _identity from 'lodash/identity';
import _isString from 'lodash/isString';
import _toPath from 'lodash/toPath';
import _isObject from 'lodash/isObject';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _forOwn from 'lodash/forOwn';
import _get from 'lodash/get';
import _some from 'lodash/some';
import { a as deps$3 } from './chunk-a813a230.js';

var deps = {
  some: _some,
  get: _get,
  isEmpty: _isEmpty,
};

var deps$1 = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    findIndex: _findIndex,
    forOwn: _forOwn,
    forArray: forArray,
    get: _get,
    isArray: _isArray,
  },
  deps$3,
  deps
);

var deps$2 = _merge(
  {
    identity: _identity,
    merge: _merge,
    isArray: _isArray,
    isString: _isString,
    toPath: _toPath,
  },
  deps$1
);

export { deps$2 as a };
