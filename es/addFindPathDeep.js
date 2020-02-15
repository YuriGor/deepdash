import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindPathDeep from './getFindPathDeep';

export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_));
}
