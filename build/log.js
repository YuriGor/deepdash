const figures = require('figures');
const chalk = require('chalk');

module.exports = (...rest) => console.log(chalk.cyan(figures(' →')), ...rest);
module.exports.done = (...rest) =>
  console.log(chalk.green(figures(' ✔')), ...rest);
module.exports.fail = (...rest) =>
  console.log(chalk.red(figures(' ✖')), ...rest);
module.exports.warn = (...rest) =>
  console.log(chalk.yellow(figures(' ⚠')), ...rest);
