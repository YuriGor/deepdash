Hi stranger, if you need some feature or fix and ready to help with it - you are welcome!
Here is what to do:
- Create an issue if it's a bug, or start discussion if it's a feature request.
- Mention you are ready to spend your time on this, so we wil discuss optimal way.

Once we have a good plan - here are some technical details how deepdash works inside:
- Deepdash written in ES100500 javascript and downgraded to oldschool one using rollup.
- No plans to rewrite it in Typescript, but we try to support typescript definitions, so would be great if you are able to write and test it(e.g. by VSCode autocompletion)
- We keep 100% tests coverage, do `npm test`.
- No dependencies except Lodash.
- We use `eslint --fix` with `prettier` as eslint plugin (not directly)
- All the sources are in /src folder. /es folder is generated from /src by `npm run build` or `npm test`.
- in /build/tpl there are some templates for generating code
- in /src/deps we have files with the same names as deepdash methods to manage dependencies - this done for having both standalone version and Lodash extension version. Try to not use Lodash methods if possible (e.g. use native array filter instead of Lodash.filter etc)
- commonjs and other builds are made from /es using rollup.
- please do care about performance (that's why code looks so ugly sometimes)
- feel free to ask for help during development.
