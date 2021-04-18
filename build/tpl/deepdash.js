var arstr = require('../arstr');

module.exports = function (methodsList) {
  let strImport = '';
  let strExport = '';
  methodsList.forEach((methodName) => {
    let capMethodName = arstr.upFirst(methodName);
    strImport += `import add${capMethodName} from './add${capMethodName}.js';\n`;
    strExport += `  add${capMethodName}(_);\n`;
  });

  return `/* build/tpl */
${strImport}
export default function apply(_) {
${strExport}
  return _;
}
`;
};
