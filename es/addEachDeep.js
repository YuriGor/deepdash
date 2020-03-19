/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getEachDeep from './getEachDeep';

export default function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
}
