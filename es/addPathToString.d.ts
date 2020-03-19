/* build/tpl */
import pathToString from "./pathToString";
interface IPathToStringAdded {
  pathToString: typeof pathToString;
}

export default function addPathToString<Src>(_: Src): Src & IPathToStringAdded;

