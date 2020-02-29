const util = require('util');
const rimraf = util.promisify(require('rimraf'));
var arstr = require('./arstr');
const log = require('./log');
const readdir = util.promisify(require('fs').readdir);
const writeFile = util.promisify(require('fs').writeFile);
const copyFile = util.promisify(require('fs').copyFile);
const mkdir = util.promisify(require('fs').mkdir);

const path = require('path');
const _ = require('lodash');
const tplAddMethod = require('./tpl/addMethod');
const tplMethod = require('./tpl/method');
const tplPrivateMethod = require('./tpl/privateMethod');
const tplStandalone = require('./tpl/standalone');
const tplDeepdash = require('./tpl/deepdash');

const dir = path.join(__dirname, '../src/');
const targetDir = path.join(__dirname, '../es/');

const privateDir = path.join(dir, 'private');
const privateTarget = path.join(targetDir, 'private');

const depsDir = path.join(dir, 'deps');
const depsTarget = path.join(targetDir, 'deps');

const depsOwnDir = path.join(depsDir, 'own');
const depsOwnTarget = path.join(depsTarget, 'own');

async function main() {
  log('copy/gen from /src/..');
  try {
    await mkdir(targetDir);
    log(`created ${targetDir}`);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  await rimraf(path.join(targetDir, '*.js'));
  await rimraf(depsTarget);
  await rimraf(privateTarget);
  log(`cleared ${targetDir}`);

  await mkdir(privateTarget);
  await mkdir(depsTarget);
  await mkdir(depsOwnTarget);

  let getters = (await readdir(dir)).filter((fn) => _.startsWith(fn, 'get'));
  let c = getters.length;
  const methods = [];
  while (c--) {
    let getter = getters[c];
    let upMethodName = getter.substr(3, getter.length - 6);
    let methodName = arstr.lowFirst(upMethodName);
    methods.push(methodName);

    await copyFile(path.join(dir, getter), path.join(targetDir, getter));
    // log.done(`${getter}`);

    await writeFile(
      path.join(targetDir, `add${upMethodName}.js`),
      tplAddMethod(methodName)
    );
    // log.done(`add${upMethodName}.js`);

    await writeFile(
      path.join(targetDir, `${methodName}.js`),
      tplMethod(methodName)
    );
    log.done(`${methodName}.js`);
  }

  getters = (await readdir(privateDir)).filter((fn) => _.startsWith(fn, 'get'));
  c = getters.length;

  while (c--) {
    let getter = getters[c];
    let upMethodName = getter.substr(3, getter.length - 6);
    let methodName = arstr.lowFirst(upMethodName);

    await copyFile(
      path.join(privateDir, getter),
      path.join(privateTarget, getter)
    );
    log.done(`private/${getter}`);

    await writeFile(
      path.join(privateTarget, `${methodName}.js`),
      tplPrivateMethod(methodName)
    );
    log.done(`private/${methodName}.js`);
  }

  let fileNames = (await readdir(depsDir)).filter((f) => f.endsWith('.js'));

  for (let fn of fileNames) {
    await copyFile(path.join(depsDir, fn), path.join(depsTarget, fn));
  }
  log.done('deps');

  fileNames = (await readdir(depsOwnDir)).filter((f) => f.endsWith('.js'));

  for (let fn of fileNames) {
    await copyFile(path.join(depsOwnDir, fn), path.join(depsOwnTarget, fn));
  }
  log.done('deps/own');

  await writeFile(path.join(targetDir, 'deepdash.js'), tplDeepdash(methods));
  log.done('deepdash.js');

  await writeFile(
    path.join(targetDir, 'standalone.js'),
    tplStandalone(methods)
  );
  log.done('standalone.js');

  log.done('copy/gen done');
}

main();
