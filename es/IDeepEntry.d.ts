import { Path } from "./Path.js";
import { IIterateeContext } from "./IIterateeContext.js";

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
