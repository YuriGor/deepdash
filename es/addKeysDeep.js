import getMixOrPatchIn from './private/getMixOrPatchIn';
import getKeysDeep from './getKeysDeep';
//console.log('getKeysDeep',getKeysDeep.notChainable);
export default function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getKeysDeep(_), !getKeysDeep.notChainable);
}
