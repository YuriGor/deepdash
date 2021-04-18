/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getForEachDeep from './getForEachDeep.js';

export default function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getForEachDeep(_), !getForEachDeep.notChainable);
}
