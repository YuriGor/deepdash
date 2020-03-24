import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";

export default function mapDeep(
  obj: any,
  callback?: (
    value: any,
    key: string | number,
    parentValue: any,
    context: IIterateeContext
  ) => any,
  options?: {
    pathFormat?: "string" | "array";
    checkCircular?: boolean;
    childrenPath?: Path[];
    includeRoot?: boolean;
    leavesOnly?: boolean;
    rootIsChildren?: boolean;
    callbackAfterIterate?: boolean;
  }
): any[];
