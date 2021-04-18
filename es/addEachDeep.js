/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getEachDeep from './getEachDeep.js';

export default function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
}
