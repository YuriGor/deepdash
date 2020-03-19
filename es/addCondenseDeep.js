/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getCondenseDeep from './getCondenseDeep';

export default function addCondenseDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_), !getCondenseDeep.notChainable);
}
