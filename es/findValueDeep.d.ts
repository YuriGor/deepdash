import { Path } from "./Path.js";
import { IIterateeContext } from "./IIterateeContext.js";

export default function findDeep(
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
  }
): any;
