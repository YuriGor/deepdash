/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getMapKeysDeep from './getMapKeysDeep.js';

export default function addMapKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapKeysDeep', getMapKeysDeep(_), !getMapKeysDeep.notChainable);
}
