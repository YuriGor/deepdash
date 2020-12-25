import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";
import { IDeepEntry } from "./IDeepEntry";

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
): IDeepEntry | undefined;
