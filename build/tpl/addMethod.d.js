var arstr = require('../arstr');

module.exports = function(methodName) {
  let capMethodName = arstr.upFirst(methodName);
  return `/* build/tpl */
import ${methodName} from "./${methodName}";
interface I${capMethodName}Added {
  ${methodName}: typeof ${methodName};
}

export default function add${capMethodName}<Src>(_: Src): Src & I${capMethodName}Added;

`;
};
