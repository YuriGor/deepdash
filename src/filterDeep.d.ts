import { Path } from "./Path";
import { IIterateeContext } from "./IIterateeContext";

export default function filterDeep(
  obj: any,
  predicate?: (
    value: any,
    key: string | number,
    parentValue: any,
    context: IIterateeContext
  ) =>
    void
    | boolean
    | {
        skipChildren: boolean;
        cloneDeep: boolean;
        keepIfEmpty: boolean;
      },
  options?: {
    pathFormat?: "string" | "array"; // = "string";
    checkCircular?: boolean; // = false;
    keepCircular?: boolean; // = false;
    childrenPath?: Path[];
    includeRoot?: boolean;
    leavesOnly?: boolean; // = false;
    rootIsChildren?: boolean;
    callbackAfterIterate?: boolean; // = false;
    replaceCircularBy?: any;
    condense?: boolean;
    cloneDeep?: (value: any) => any;
    onTrue?: {
      skipChildren?: boolean;
      cloneDeep?: boolean;
      keepIfEmpty?: boolean;
    };
    onFalse?: {
      skipChildren?: boolean;
      cloneDeep?: boolean;
      keepIfEmpty?: boolean;
    };
    onUndefined?: {
      skipChildren?: boolean;
      cloneDeep?: boolean;
      keepIfEmpty?: boolean;
    };
  }
): any;
