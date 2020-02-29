import getMixOrPatchIn from './private/getMixOrPatchIn';
import getForEachDeep from './getForEachDeep';
//console.log('getForEachDeep',getForEachDeep.notChainable);
export default function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getForEachDeep(_), !getForEachDeep.notChainable);
}
