import _merge from 'lodash-es/merge';
import _isObject from './own/isObject';
import _isEmpty from './own/isEmpty';
import _forOwn from 'lodash-es/forOwn';
import _forArray from './own/forArray';
import _get from 'lodash-es/get';
import _isArray from './own/isArray';

import hasChildrenDeps from './hasChildren';
import pathToStringDeps from './pathToString';

var deps = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    forOwn: _forOwn,
    forArray: _forArray,
    get: _get,
    isArray: _isArray,
  },
  pathToStringDeps,
  hasChildrenDeps
);

export default deps;
