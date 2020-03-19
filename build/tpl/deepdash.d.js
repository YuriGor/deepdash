module.exports = function(methodsList) {
  let strImport = '';
  let strInterface = '';
  methodsList.forEach((methodName) => {
    strImport += `import ${methodName} from "./${methodName}";\n`;
    strInterface += `  ${methodName}: typeof ${methodName};\n`;
  });

  return `/* build/tpl */
${strImport}
export default function addDeepdash<Src>(_: Src): Src & {
${strInterface}};
`;
};
