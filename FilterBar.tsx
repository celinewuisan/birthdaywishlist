"use client";

import { useEffect, useState } from "react";
import { formatIDR, HAPPINESS_META } from "@/lib/format";
import GiftFormModal, { type GiftFormValues } from "./GiftFormModal";

type Gift = GiftFormValues & { id: string; remaining: number };

export default function AdminGiftsTab() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GiftFormValues | null | undefined>(undefined);

  function load() {
    setLoading(true);
    fetch("/api/gifts")
      .then((r) => r.json())
      .then((data) => setGifts(data.gifts || []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function remove(id: string) {
    if (!confirm("Remove this gift? (its claim history stays on record)")) return;
    await fetch(`/api/gifts/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="text-sm text-ink/50">loading gifts...</p>;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing(null)} className="btn-primary text-sm">
          + add a gift
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {gifts.map((g) => (
          <div key={g.id} className="card flex items-start justify-between gap-3 p-4">
            <div>
              <p className="font-display font-semibold">{g.name}</p>
              <p className="font-mono text-sm text-indigo-500">{formatIDR(g.price)}</p>
              <p className="text-xs text-ink/50 dark:text-cream/50">
                {HAPPINESS_META[g.happinessLevel].label} · {g.category} · {g.remaining}/{g.quantityAvailable} slots left
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-1.5">
              <button onClick={() => setEditing(g)} className="btn-secondary text-xs">
                edit
              </button>
              <button onClick={() => remove(g.id)} className="btn-ghost text-xs text-coral-500">
                remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== undefined && (
        <GiftFormModal
          initial={editing || undefined}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            load();
          }}
        />
      )}
    </div>
  );
}
