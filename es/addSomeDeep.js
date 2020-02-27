import getMixOrPatchIn from './private/getMixOrPatchIn';
import getSomeDeep from './getSomeDeep';

export default function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('someDeep', getSomeDeep(_));
}
