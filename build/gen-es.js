var argv = require('yargs').argv;
var arstr = require('./arstr');
const log = require('./log');
const { readFile, readdir, stat, writeFile, copyFile } = require('fs').promises;
const path = require('path');
const _ = require('lodash');
const dir = path.join(__dirname, '../src/');
const targetDir = path.join(__dirname, '../tmp/');
const tplAddMethod = require('./tpl/addMethod');
const tplMethod = require('./tpl/method');
const tplDeepdash = require('./tpl/deepdash');
const tplStandalone = require('./tpl/standalone');

async function main() {
  log('code generator' + (argv.all ? ' (forced)' : ''));
  let mtimes = {};
  if (!argv.all) {
    log('read last changes list');
    try {
      mtimes = JSON.parse(await readFile('./.mtimes.json', 'utf8'));
      // console.log(mtimes);
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        log.fail(ex.message);
        throw ex;
      }
    }
  }
  let getters = (await readdir(dir)).filter((fn) => _.startsWith(fn, 'get'));
  let c = getters.length;
  let changed = [];
  let methods = [];
  while (c--) {
    let getter = getters[c];
    let upMethodName = getter.substr(3, getter.length - 6);
    let methodName = arstr.lowFirst(upMethodName);
    methods.push(methodName);
    let mt = (await stat(dir + getter)).mtime.toJSON();
    if (mt == mtimes[getter]) {
      log.done(`[${c + 1}/${getters.length}] - ${methodName} - no changes`);
      continue;
    }
    log.warn(`[${c + 1}/${getters.length}] - ${methodName} - changed!`, mt);
    mtimes[getter] = mt;
    changed.push(methodName);

    await copyFile(path.join(dir, getter), path.join(targetDir, getter));

    await writeFile(
      path.join(targetDir, `add${upMethodName}.js`),
      tplAddMethod(methodName)
    );

    await writeFile(
      path.join(targetDir, `${methodName}.js`),
      tplMethod(methodName)
    );
  }

  // info(getters);
  if (changed.length) {
    await writeFile(path.join(targetDir, 'deepdash.js'), tplDeepdash(methods));
    await writeFile(
      path.join(targetDir, 'standalone.js'),
      tplStandalone(methods)
    );
    for (var i = getters.length - 1; i >= 0; i--) {
      let fn = getters[i];
      mtimes[fn] = (await stat(dir + fn)).mtime;
    }
    await writeFile(
      path.join(__dirname, '.mtimes.json'),
      JSON.stringify(mtimes, null, 2)
    );
  }
  log.done('done');
}
main();

// process.chdir(path.join(__dirname, '..', 'es'));
// const getters = fs
//   .readdirSync('.')
//   .filter(
//     (fn) => _.startsWith(fn, 'get') && fs.statSync(fn).mtime != mtimes[fn]
//   );
//
// // console.log(getters.length + ' files changed');
// console.log(getters);
// const
//
// getters.forEach((fn)=>{
//   fs.writeFile
// });
// fs.writeFileSync(
//   path.join(__dirname, '.mtimes.json'),
//   JSON.stringify(
//     _.reduce(
//       getters,
//       (res, fn) => {
//         res[fn] = fs.statSync(fn).mtime;
//         return res;
//       },
//       mtimes
//     )
//   )
// );
