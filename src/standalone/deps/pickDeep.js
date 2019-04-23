import _merge from 'lodash-es/merge';
import omitDeepDeps from './omitDeep';
var deps = _merge({ merge: _merge }, omitDeepDeps);
export default deps;
