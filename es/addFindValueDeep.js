import getMixOrPatchIn from './private/getMixOrPatchIn';
import getFindValueDeep from './getFindValueDeep';

export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_));
}
