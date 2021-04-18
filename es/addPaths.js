/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import getPaths from './getPaths.js';

export default function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('paths', getPaths(_), !getPaths.notChainable);
}
