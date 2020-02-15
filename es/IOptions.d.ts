import { Path } from "./Types";

/**
 * Hello
 */
export interface IEachDeepOptions {
  pathFormat?: "string" | "array"; // = "string";
  checkCircular?: boolean; // = false;
  childrenPath?: Array<Path>;
  includeRoot?: boolean;
  leavesOnly?: boolean; // = false;
  rootIsChildren?: boolean;
  callbackAfterIterate?: boolean; // = false;
}
