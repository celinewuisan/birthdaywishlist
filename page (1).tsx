"use client";

import { useEffect, useMemo, useState } from "react";
import GiftFinder, { type FinderState } from "./GiftFinder";
import FilterBar, { type Filters } from "./FilterBar";
import GiftCard, { type GiftData } from "./GiftCard";
import ClaimModal from "./ClaimModal";

export default function WishlistApp() {
  const [gifts, setGifts] = useState<GiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [finder, setFinder] = useState<FinderState | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    happiness: "",
    onlyAvailable: false,
  });
  const [claiming, setClaiming] = useState<{ gift: GiftData; claimType: "SOLO" | "GROUP" } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.happiness) params.set("happiness", filters.happiness);
    if (filters.onlyAvailable) params.set("availability", "available");
    if (finder?.active && finder.totalBudget) params.set("budget", String(finder.totalBudget));

    setLoading(true);
    fetch(`/api/gifts?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setGifts(data.gifts || []))
      .finally(() => setLoading(false));
  }, [filters, finder]);

  const categories = useMemo(() => Array.from(new Set(gifts.map((g) => g.category))).sort(), [gifts]);

  const sortedGifts = useMemo(() => {
    if (!finder?.active) return gifts;
    // Push actual recommendations (a match label) to the top, keep everything else below.
    const rank: Record<string, number> = { PERFECT_MATCH: 0, SLIGHTLY_ABOVE: 1, STRETCH_GOAL: 2 };
    return [...gifts].sort((a, b) => {
      const ra = a.match ? rank[a.match] : 99;
      const rb = b.match ? rank[b.match] : 99;
      return ra - rb;
    });
  }, [gifts, finder]);

  return (
    <div className="flex flex-col gap-6">
      <GiftFinder onChange={setFinder} />
      <FilterBar filters={filters} categories={categories} onChange={setFilters} />

      {loading ? (
        <div className="py-16 text-center text-sm text-ink/50 dark:text-cream/50">loading gifts...</div>
      ) : sortedGifts.length === 0 ? (
        <div className="py-16 text-center text-sm text-ink/50 dark:text-cream/50">
          nothing matches that, try widening your search
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onClaim={(g, type) => setClaiming({ gift: g, claimType: type })}
            />
          ))}
        </div>
      )}

      {claiming && (
        <ClaimModal gift={claiming.gift} claimType={claiming.claimType} onClose={() => setClaiming(null)} />
      )}
    </div>
  );
}
