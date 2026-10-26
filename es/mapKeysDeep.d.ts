import { Path } from "./Path.js";
import { IIterateeContext } from "./IIterateeContext.js";

export default function mapKeysDeep(
  obj: any,
  callback?: (
    value: any,
    key: string | number,
    parentValue: any,
    context: IIterateeContext
  ) => string|number,
  options?: {
    pathFormat?: "string" | "array";
    checkCircular?: boolean;
    childrenPath?: Path[];
    includeRoot?: boolean;
    leavesOnly?: boolean;
    rootIsChildren?: boolean;
    callbackAfterIterate?: boolean;
  }
): any;
