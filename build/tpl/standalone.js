module.exports = function(methodsList) {
  return methodsList.reduce(
    (res, methodName) =>
      res + `export { default as ${methodName} } from './${methodName}';\n`,
    ''
  );
};
