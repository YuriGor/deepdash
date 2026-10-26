import { Path } from "./Path.js";

export default function index(
  obj: any,
  options?: {
    checkCircular?: boolean;
    includeRoot?: boolean;
    childrenPath?: Path[];
    rootIsChildren?: boolean;
    leavesOnly?: boolean;
  }
): Object;

