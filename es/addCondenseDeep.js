/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getCondenseDeep from './getCondenseDeep.js';

export default function addCondenseDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_), !getCondenseDeep.notChainable);
}
