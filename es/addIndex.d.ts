/* build/tpl */
import index from "./index";
interface IIndexAdded {
  index: typeof index;
}

export default function addIndex<Src>(_: Src): Src & IIndexAdded;

