import { Path } from "./Path";

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

