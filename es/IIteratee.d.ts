interface IValue {
  value: any;
  key: string | number | undefined;
  path: Array<string | number | undefined> | string | undefined;
  parent: IValue | undefined;
  /**
   * contains matched childrenPath path of this parent node, chosen from childrenPath array, if it was specified.
   */
  childrenPath?: Array<string | number | undefined> | string | undefined;
}

interface IIterateeContext {
  path: Array<string | number | undefined> | string | undefined;
  childrenPath: Array<string | number | undefined> | string | undefined;
  parent: IValue | undefined;
  parents: Array<IValue> | undefined;
  obj: any;
  depth: number;
  isCircular: boolean | undefined;
  circularParent: any | undefined;
  circularParentIndex: number | undefined;
  isLeaf: boolean;
  break: undefined | (() => false);
  afterIterate: true | undefined;
}

export type EachDeepIteratee = (
  value: any,
  key: string | number | undefined,
  parentValue: any,
  context: IIterateeContext
) => any;

export interface IFilterDeepIteratee {
  value: any;
  key: string | number | undefined;
  parentValue: any;
  context: IIterateeContext;
}
