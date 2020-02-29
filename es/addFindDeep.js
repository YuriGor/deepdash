import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindDeep from './getFindDeep';
//console.log('getFindDeep',getFindDeep.notChainable);
export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findDeep', getFindDeep(_), !getFindDeep.notChainable);
}
