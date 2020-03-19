/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getForEachDeep from './getForEachDeep';

export default function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getForEachDeep(_), !getForEachDeep.notChainable);
}
