import { HAPPINESS_META } from "@/lib/format";
import clsx from "clsx";

export default function HappinessBadge({
  level,
  size = "md",
}: {
  level: keyof typeof HAPPINESS_META;
  size?: "sm" | "md";
}) {
  const meta = HAPPINESS_META[level];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full font-display font-semibold",
        meta.className,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      )}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
