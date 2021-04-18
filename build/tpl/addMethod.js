var arstr = require('../arstr');

module.exports = function (methodName) {
  let capMethodName = arstr.upFirst(methodName);
  return `/* build/tpl */
import getMixOrPatchIn from './private/getMixOrPatchIn.js';
import get${capMethodName} from './get${capMethodName}.js';

export default function add${capMethodName}(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('${methodName}', get${capMethodName}(_), !get${capMethodName}.notChainable);
}
`;
};
