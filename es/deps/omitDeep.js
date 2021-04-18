import _merge from 'lodash-es/merge.js';

import pathMatchesDeps from './pathMatches.js';
import filterDeepDeps from './filterDeep.js';

var deps = _merge({ merge: _merge }, pathMatchesDeps, filterDeepDeps);

export default deps;
