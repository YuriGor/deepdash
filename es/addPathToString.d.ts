/* build/tpl */
import pathToString from "./pathToString.js";
interface IPathToStringAdded {
  pathToString: typeof pathToString;
}

export default function addPathToString<Src>(_: Src): Src & IPathToStringAdded;

