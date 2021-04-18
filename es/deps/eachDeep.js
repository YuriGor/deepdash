import _identity from 'lodash-es/identity.js';
import _merge from 'lodash-es/merge.js';
import _isString from 'lodash-es/isString.js';
import _toPath from 'lodash-es/toPath.js';

import iterateDeps from './iterate.js';

var deps = _merge(
  {
    identity: _identity,
    merge: _merge,
    isString: _isString,
    toPath: _toPath,
  },
  iterateDeps
);

export default deps;
