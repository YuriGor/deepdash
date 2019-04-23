import _merge from 'lodash-es/merge';

import pathMatchesDeps from './pathMatches';
import filterDeepDeps from './filterDeep';

var deps = _merge({ merge: _merge }, pathMatchesDeps, filterDeepDeps);

export default deps;
