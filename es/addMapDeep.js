/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getMapDeep from './getMapDeep.js';

export default function addMapDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
}
