/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getKeysDeep from './getKeysDeep';

export default function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getKeysDeep(_), !getKeysDeep.notChainable);
}
