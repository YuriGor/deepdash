/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getMapDeep from './getMapDeep';

export default function addMapDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
}
