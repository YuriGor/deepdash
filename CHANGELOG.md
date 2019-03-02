# Change Log

## v2-1-0
*(2019-03-02)*

**Features added**

- `tree` option added to [eachDeep](/#eachdeep-foreachdeep) method.
Now it's much easier to iterate over tree with known `children` collection field name / path

**Bugs fixed**

- Circular reference detector false positive for similar parent/child structure

## v2-0-0
*(2019-02-21)*

**Breaking Changes**

- [iteratee/predicate](/#iteratee) arguments order/structure changed to mimic native js array predicates

**Features added**

- checkCircular option added to [eachDeep](/#eachdeep-foreachdeep) method.
- [pickDeep](/#peekdeep) method implemented.
