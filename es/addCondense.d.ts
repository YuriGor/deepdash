/* build/tpl */
import condense from "./condense";
interface ICondenseAdded {
  condense: typeof condense;
}

export default function addCondense<Src>(_: Src): Src & ICondenseAdded;

