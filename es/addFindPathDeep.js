import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindPathDeep from './getFindPathDeep';
//console.log('getFindPathDeep',getFindPathDeep.notChainable);
export default function addFindPathDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_), !getFindPathDeep.notChainable);
}
