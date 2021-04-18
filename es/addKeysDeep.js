/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getKeysDeep from './getKeysDeep.js';

export default function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getKeysDeep(_), !getKeysDeep.notChainable);
}
