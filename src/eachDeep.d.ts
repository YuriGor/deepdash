import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";

export default function eachDeep(
  obj: any,
  callback?: (
    value: any,
    key: string | number,
    parentValue: any,
    context: IIterateeContext
  ) => void | boolean,
  options?: {
    pathFormat?: "string" | "array"; // = "string";
    checkCircular?: boolean; // = false;
    childrenPath?: Path[];
    includeRoot?: boolean;
    leavesOnly?: boolean; // = false;
    rootIsChildren?: boolean;
    callbackAfterIterate?: boolean; // = false;
  }
): any;
