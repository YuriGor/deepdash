import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPickDeep from './getPickDeep';
//console.log('getPickDeep',getPickDeep.notChainable);
export default function addPickDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_), !getPickDeep.notChainable);
}
