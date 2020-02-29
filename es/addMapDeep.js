import getMixOrPatchIn from './private/getMixOrPatchIn';
import getMapDeep from './getMapDeep';
//console.log('getMapDeep',getMapDeep.notChainable);
export default function addMapDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
}
