import getMixOrPatchIn from './private/getMixOrPatchIn';
import getEachDeep from './getEachDeep';
//console.log('getEachDeep',getEachDeep.notChainable);
export default function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
}
