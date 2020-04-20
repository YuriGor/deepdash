import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";

export default function reduceDeep(
  obj: any,
  callback?: (
    accumulator: any,
    value: any,
    key: string | number,
    parentValue: any,
    context: IIterateeContext
  ) => any,
  accumulator?: any,
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
