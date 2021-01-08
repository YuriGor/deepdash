export default function pickDeep(
  obj: any,
  paths: string | RegExp | (string | RegExp)[],
  options?: {
    checkCircular?: boolean;
    keepCircular?: boolean;
    replaceCircularBy?: any;
    condense?: boolean;
    cloneDeep?: (value: any) => any;
    onMatch?: {
      skipChildren?: boolean;
      cloneDeep?: boolean;
      keepIfEmpty?: boolean;
    };
    onNotMatch?: {
      skipChildren?: boolean;
      cloneDeep?: boolean;
      keepIfEmpty?: boolean;
    };
  }
): any;
