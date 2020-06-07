# Change Log

## v5-1-0
*(2020-06-07)*

**Features added**
- [mapValuesDeep](/#mapvaluesdeep) - context.skipChildren added to let user override default behavior

**Bugs fixed**
- [mapValuesDeep](/#mapvaluesdeep) - method will skip children if value changed type from/to array and use given value as is (#60)

## v5-0-0
*(2020-03-21)*

**Breaking Changes**
- mapDeep renamed to [mapValuesDeep](/#mapvaluesdeep) to conform to Lodash map/mapValues/mapKeys family of methods.
- [mapDeep](/#mapdeep) re-implemented to return an array of deep values processed by iteratee (same as _.map in Lodash)

**Features added**
- [mapKeysDeep](/#mapkeysdeep) implemented - returns object with same values but keys modified by iteratee (same as _.mapKeys in Lodash)

## v4-6-0
*(2020-03-21)*
**Features added**
- [pathToString](/#pathtostring) prefixes args added to prepend result path correctly. (Used internally to optimize a bit by re-using already stringified paths)
- TypeScript definitions added, see [this "discussion"](https://github.com/YuriGor/deepdash/issues/14) for details.

## v4-5-0
*(2020-02-16)*

**Features added**
- [findDeep](/#finddeep) implemented - returns first meta-value {value, key, parent, context},
iteratee agree with, if none - returns undefined.
- [findValueDeep](/#findvaluedeep) implemented - returns first value,
iteratee agree with, if none - returns undefined. Be carefull, some deep value may exists but also be `undefined`.
- [findPathDeep](/#findpathdeep) implemented - returns first path,
iteratee agree with, if none - returns undefined. Be carefull with `includeRoot`, object itself, passed as data source, also has path `undefined`.
- [someDeep](/#somedeep) implemented - returns true if found some deep value,
iteratee agree with, if none - return false (just shorthand wrapper for findDeep)

## v4-4-0
*(2019-12-16)*

**Features added**
- `message` field (if exists) of error thrown by iteratee will be appended by current path, to speed up debug.

## v4-3-0
*(2019-12-7)*

**Features added**
- [eachDeep](/#eachdeep-foreachdeep) now supports break.(as context.break function passed into iteratee)

**Bugs fixed**
- [filterDeep](/#filterdeep) didn't use onUndefined options for parents skipped due leavesOnly mode.

## v4-2-0
*(2019-04-19)*

**Features added**
- mapDeep implemented

## v4-1-0
*(2019-04-05)*

**Features added**
- reduceDeep implemented

## v4-0-0
*(2019-04-05)*

**Breaking Changes**
- in the browser deepdash doesn't try to patch existing global `_` variable. It now exposes global `deepdash` function and user should pass a lodash instance to this function manually.
- source object will be passed to the iteratee/predicate as a very first value with undefined key/path/parent (see includeRoot option)
- `indexate` renamed to [index](/#index).
- in case of completely rejected object [filterDeep](/#filterdeep) returns null instead of empty {}/[]
- if not an object passed as a source to [filterDeep](/#filterdeep) source will be returned if it passes the filter, otherwise null.
- context.treeChildrenPath renamed to childrenPath.
- isTreeChildren, isTreeNode iteratee sub-parameters deprecated (since they are always true in 'tree' mode and false in the 'object'  mode)
- regexp children path support dropped to optimise tree walking
- `tree` sub-object option deprecated, `tree.children` renamed to `childrenPath`, `tree.rootIsChildren` renamed to `rootIsChildren`

**Features added**
- cherry-pick separate methods now available as standalone functions or as a lodash mixins.
- standalone version now available
- `deepdash-es` package created for importing as es6 module. It's just a content of `es` folder from main repo.
- `includeRoot` option added to [eachDeep](/#eachdeep-foreachdeep), [index](/#index), [paths (keysDeep)](/#paths-keysdeep) and [filterDeep](/#filterdeep) methods.
- leavesOnly implemented for tree mode. eachDeep now also has leavesOnly option.

## v3-1-0
*(2019-03-08)* ✿❃❀

**Breaking Changes**

- `keepUndefined` option removed from the [filterDeep](/#filterdeep) method. Use onUndefined:{keepIfEmpty:true}, instead.
- `keys` argument of the [omitDeep](/#omitdeep) and [pickDeep](/#pickdeep) methods became `paths`

**Features added**

- `tree` option added to the [filterDeep](/#filterdeep) method.
- `tree` option added to the [indexate](/#indexate) method.
- `tree` option added to the [paths (keysDeep)](/#paths-keysdeep) method.
- `predicate` option of the [filterDeep](/#filterdeep) method is Lodash _.iteratee.
- `cloneDeep` option of the [filterDeep](/#filterdeep) now can be set to `false`.
- `callbackAfterIterate` option added to the [eachDeep](/#eachdeep-foreachdeep) method.
- `onTrue` `onUndefined` and `onFalse` options added to the [filterDeep](/#filterdeep) method. `cloneDeep`, `keepIfEmpty`, `skipChildren` default values can be overwritten for each condition.
- `onMatched` and `onNotMatched` options added to the [omitDeep](/#omitdeep) and [pickDeep](/#pickdeep) methods.
- custom object replies from [filterDeep](/#filterdeep) iteratee, with `cloneDeep`, `keepIfEmpty`, `skipChildren` and `empty` fields now are supported.

**Bugs fixed**

- [filterDeep](/#filterdeep) method continues to iterate over object's children if it passed the filter.

## v2-1-0
*(2019-03-02)*

**Features added**

- `tree` option added to the [eachDeep](/#eachdeep-foreachdeep) method.
Now it's much easier to iterate over tree with known `children` collection field name / path

**Bugs fixed**

- Circular reference detector false positive for similar parent/child structure

## v2-0-0
*(2019-02-21)*

**Breaking Changes**

- [iteratee/predicate](/#iteratee) arguments order/structure changed to mimic native js array predicates

**Features added**

- checkCircular option added to the [eachDeep](/#eachdeep-foreachdeep) method.
- [pickDeep](/#peekdeep) method implemented.

## v1-9-5
*(2019-02-09)*

*no changelog earlier, sorry*