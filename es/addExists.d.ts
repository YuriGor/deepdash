/* build/tpl */
import exists from "./exists.js";
interface IExistsAdded {
  exists: typeof exists;
}

export default function addExists<Src>(_: Src): Src & IExistsAdded;

