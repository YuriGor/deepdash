import getMixOrPatchIn from './private/getMixOrPatchIn';
import getExists from './getExists';
//console.log('getExists',getExists.notChainable);
export default function addExists(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('exists', getExists(_), !getExists.notChainable);
}
