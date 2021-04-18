module.exports = function (methodsList) {
  return methodsList.reduce(
    (res, methodName) => {
      res['./' + methodName] = {
        "import": `./es/${methodName}.js`,
        require: `./${methodName}.js`,
        types: `./es/${methodName}.d.ts`,
      };

      return res;
    },
    {
      '.': {
        "import": './es/deepdash.js',
        require: './deepdash.js',
        types: './es/deepdash.d.ts',
      },
      './standalone': {
        "import": './es/standalone.js',
        require: './standalone.js',
        types: './es/standalone.d.ts',
      },
    }
  );
};
