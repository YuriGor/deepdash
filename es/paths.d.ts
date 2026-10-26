import { Path } from "./Path.js";

export default function paths(
  obj: any,
  options?: {
    pathFormat?: "string" | "array"; // = "string";
    checkCircular?: boolean; // = false;
    includeCircularPath?: boolean,
    childrenPath?: Path[];
    includeRoot?: boolean;
    leavesOnly?: boolean; // = false;
    rootIsChildren?: boolean;
  }
): Path[];
