import { Path } from './Path.js';

export default function pathMatches(
  path: Path,
  paths: string | RegExp | (string | RegExp)[]
): boolean;
