import { EachDeepIteratee } from "./IIteratee";
import { IEachDeepOptions } from "./IOptions";

export default function eachDeep<Src>(
  obj: Src,
  callback?: EachDeepIteratee,
  options?: IEachDeepOptions
): Src;
