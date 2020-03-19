var arstr = require('../arstr');

module.exports = function(methodName) {
  let capMethodName = arstr.upFirst(methodName);
  return `/* build/tpl */
import ${methodName} from "./${methodName}";

export default function get${capMethodName}(_: Object): typeof ${methodName};

`;
};
