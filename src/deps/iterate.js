import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';
import _isEmpty from 'lodash-es/isEmpty';
import _findIndex from 'lodash-es/findIndex';
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
    findIndex: _findIndex,
    forOwn: _forOwn,
    forArray: _forArray,
    get: _get,
    isArray: _isArray,
  },
  pathToStringDeps,
  hasChildrenDeps
);

export default deps;
