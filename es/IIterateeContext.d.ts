import { Path } from "./Path";
import { IDeepEntry } from "./IDeepEntry";
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
