import clsx from "clsx";
import { MATCH_LABELS, type MatchLabel } from "@/lib/recommend";

export default function MatchBadge({ match }: { match: MatchLabel }) {
  if (!match) return null;

  const styles: Record<string, string> = {
    PERFECT_MATCH: "bg-mint-500 text-white",
    SLIGHTLY_ABOVE: "bg-citrus-500 text-ink",
    STRETCH_GOAL: "bg-indigo-500 text-white",
  };

  return (
    <span
      className={clsx(
        "absolute -top-2 left-3 rotate-[-2deg] rounded-lg px-2.5 py-1 font-display text-[11px] font-bold shadow-tag",
        styles[match]
      )}
    >
      {MATCH_LABELS[match as Exclude<MatchLabel, null>]}
    </span>
  );
}
