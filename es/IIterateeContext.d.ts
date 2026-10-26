import { Path } from "./Path.js";
import { IDeepEntry } from "./IDeepEntry.js";
export interface IIterateeContext {
  path?: Path;
  childrenPath?: Path;
  parent?: IDeepEntry;
  parents?: IDeepEntry[];
  obj: any;
  depth: number;
  isCircular?: boolean;
  circularParent?: any;
  circularParentIndex?: number;
  isLeaf: boolean;
  break?: () => false;
  afterIterate?: boolean;
}
