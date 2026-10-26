/* build/tpl */
import index from "./index.js";
interface IIndexAdded {
  index: typeof index;
}

export default function addIndex<Src>(_: Src): Src & IIndexAdded;

