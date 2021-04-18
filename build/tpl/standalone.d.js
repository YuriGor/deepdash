module.exports = function (methodsList) {
  return (
    `/* build/tpl */
` +
    methodsList.reduce(
      (res, methodName) =>
        res + `export { default as ${methodName} } from './${methodName}';\n`,
      ''
    )
  );
};
