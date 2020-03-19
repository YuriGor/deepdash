import { Path } from './Path';

export default function pathMatches(
  path: Path,
  paths: string | RegExp | (string | RegExp)[]
): boolean;
