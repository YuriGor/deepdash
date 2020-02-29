import getMixOrPatchIn from './private/getMixOrPatchIn';
import getOmitDeep from './getOmitDeep';
//console.log('getOmitDeep',getOmitDeep.notChainable);
export default function addOmitDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_), !getOmitDeep.notChainable);
}
