/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getMapValuesDeep from './getMapValuesDeep.js';

export default function addMapValuesDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapValuesDeep', getMapValuesDeep(_), !getMapValuesDeep.notChainable);
}
