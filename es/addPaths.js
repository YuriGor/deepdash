import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPaths from './getPaths';
//console.log('getPaths',getPaths.notChainable);
export default function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('paths', getPaths(_), !getPaths.notChainable);
}
