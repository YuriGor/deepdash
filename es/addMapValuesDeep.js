/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getMapValuesDeep from './getMapValuesDeep';

export default function addMapValuesDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapValuesDeep', getMapValuesDeep(_), !getMapValuesDeep.notChainable);
}
