/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPaths from './getPaths';

export default function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('paths', getPaths(_), !getPaths.notChainable);
}
