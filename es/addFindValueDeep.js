import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindValueDeep from './getFindValueDeep';
//console.log('getFindValueDeep',getFindValueDeep.notChainable);
export default function addFindValueDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
}
