import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";

export interface IDeepEntry {
  value: any;
  key?: string | number;
  path?: Path;
  /**
   * NOTE: At now, parent is not type of IDeepEntry. It is just parent.value
   * JS source code should be fixed
   */
  parent?: IDeepEntry;
  context?: IIterateeContext;
  /**
   * contains matched childrenPath path of this parent node, chosen from childrenPath array, if it was specified.
   */
  childrenPath?: Path;
}
