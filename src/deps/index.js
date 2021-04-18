import _merge from 'lodash-es/merge.js';

import eachDeepDeps from './eachDeep.js';

var deps = _merge({ merge: _merge }, eachDeepDeps);

export default deps;
