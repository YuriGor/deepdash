import _merge from 'lodash-es/merge.js';
import _isObject from 'lodash-es/isObject.js';
import _isEmpty from 'lodash-es/isEmpty.js';
import _get from 'lodash-es/get.js';

// import hasChildrenDeps from './hasChildren.js';
import pathToStringDeps from './pathToString.js';

var deps = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    get: _get,
  },
  pathToStringDeps
  // hasChildrenDeps
);

export default deps;
