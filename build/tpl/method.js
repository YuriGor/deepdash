var arstr = require('../arstr');

module.exports = function(methodName) {
  let capMethodName = arstr.upFirst(methodName);

  return `import deps from './deps/${methodName}';
import get${capMethodName} from './get${capMethodName}';
export default get${capMethodName}(deps);
`;
};
