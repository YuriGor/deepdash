import getMixOrPatchIn from './private/getMixOrPatchIn';
import getPaths from './getPaths';

export default function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getPaths(_));
}
