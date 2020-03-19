/* build/tpl */
import pathMatches from "./pathMatches";
interface IPathMatchesAdded {
  pathMatches: typeof pathMatches;
}

export default function addPathMatches<Src>(_: Src): Src & IPathMatchesAdded;

