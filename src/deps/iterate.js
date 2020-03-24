import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';
import _isEmpty from 'lodash-es/isEmpty';
import _forOwn from 'lodash-es/forOwn';
import _forArray from './own/forArray';
import _get from 'lodash-es/get';

import hasChildrenDeps from './hasChildren';
import pathToStringDeps from './pathToString';

var deps = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    forOwn: _forOwn,
    forArray: _forArray,
    get: _get,
  },
  pathToStringDeps,
  hasChildrenDeps
);

export default deps;
