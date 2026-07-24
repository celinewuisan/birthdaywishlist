"use client";

import { useState } from "react";
import clsx from "clsx";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-display font-semibold"
          >
            {item.q}
            <span className={clsx("transition", open === i && "rotate-45")}>+</span>
          </button>
          {open === i && <p className="px-5 pb-4 text-sm text-ink/60 dark:text-cream/60">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
