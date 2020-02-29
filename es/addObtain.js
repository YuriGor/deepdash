import getMixOrPatchIn from './private/getMixOrPatchIn';
import getObtain from './getObtain';
//console.log('getObtain',getObtain.notChainable);
export default function addObtain(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('obtain', getObtain(_), !getObtain.notChainable);
}
