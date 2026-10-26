/* build/tpl */
import paths from "./paths.js";
interface IPathsAdded {
  paths: typeof paths;
}

export default function addPaths<Src>(_: Src): Src & IPathsAdded;

