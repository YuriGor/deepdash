import _merge from 'lodash-es/merge.js';
import omitDeepDeps from './omitDeep.js';
var deps = _merge({ merge: _merge }, omitDeepDeps);
export default deps;
