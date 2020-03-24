/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getMapKeysDeep from './getMapKeysDeep';

export default function addMapKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapKeysDeep', getMapKeysDeep(_), !getMapKeysDeep.notChainable);
}
