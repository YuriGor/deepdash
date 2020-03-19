import { Path } from './Path';

export interface IDeepEntry {
  value: any;
  key?: string | number;
  path?: Path;
  parent?: IDeepEntry;
  /**
   * contains matched childrenPath path of this parent node, chosen from childrenPath array, if it was specified.
   */
  childrenPath?: Path;
}
