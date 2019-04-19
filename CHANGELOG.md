# Change Log

## v4-0-0
*(unreleased)*

**Breaking Changes**
- source object/array (root) passed to the iteratee/predicate too, as a very first value with undefined key/path/parent
- `indexate` renamed to [index](/#index).
- in case of completely rejected object [filterDeep](/#filterdeep) returns null instead of empty {}/[]
- if not an object passed as a source to [filterDeep](/#filterdeep) source will be returned if it passes the filter, otherwise null.
- treeChildrenPath renamed to childrenPath.
- isTreeChildren, isTreeNode iteratee sub-parameters deprecated.
- regexp children path support dropped to optimise tree walking
- `tree` sub-object option deprecated, `tree.children` renamed to `childrenPath`, `tree.rootIsChildren` renamed to `rootIsChildren`

**Features added**
- `includeRoot` option added to [eachDeep](/#eachdeep-foreachdeep), [index](/#index), [paths (keysDeep)](/#paths-keysdeep) and [filterDeep](/#filterdeep) methods.

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