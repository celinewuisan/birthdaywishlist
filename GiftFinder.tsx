"use client";

import Image from "next/image";
import { formatIDR } from "@/lib/format";
import HappinessBadge from "./HappinessBadge";
import MatchBadge from "./MatchBadge";
import type { MatchLabel } from "@/lib/recommend";

export type GiftData = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  purchaseLink: string;
  happinessLevel: "HAPPY" | "OMG_EXCITED" | "CHANGED_MY_LIFE";
  category: string;
  quantityAvailable: number;
  remaining: number;
  isGroupEligible: boolean;
  match: MatchLabel;
};

export default function GiftCard({
  gift,
  onClaim,
}: {
  gift: GiftData;
  onClaim: (gift: GiftData, claimType: "SOLO" | "GROUP") => void;
}) {
  const soldOut = gift.remaining <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl3 bg-white shadow-soft transition hover:-translate-y-0.5 dark:bg-plum-900 dark:shadow-softDark">
      <MatchBadge match={gift.match} />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-plum-900/5 dark:bg-cream/5">
        <Image
          src={gift.imageUrl}
          alt={gift.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50 backdrop-blur-[1px]">
            <span className="rotate-[-4deg] rounded-lg bg-cream px-3 py-1 font-display text-sm font-bold text-ink">
              all claimed, sorry!
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug">{gift.name}</h3>
          <span className="whitespace-nowrap font-mono text-sm font-semibold text-indigo-500">
            {formatIDR(gift.price)}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-ink/60 dark:text-cream/60">{gift.description}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <HappinessBadge level={gift.happinessLevel} size="sm" />
          <span className="rounded-full bg-plum-900/5 px-2 py-0.5 text-[11px] font-medium text-ink/60 dark:bg-cream/10 dark:text-cream/60">
            {gift.category}
          </span>
          {gift.isGroupEligible && (
            <span className="rounded-full bg-plum-900/5 px-2 py-0.5 text-[11px] font-medium text-ink/60 dark:bg-cream/10 dark:text-cream/60">
              {gift.remaining}/{gift.quantityAvailable} slots left
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <button disabled={soldOut} onClick={() => onClaim(gift, "SOLO")} className="btn-primary w-full">
            Claim This Gift
          </button>
          {gift.isGroupEligible && (
            <button
              disabled={soldOut}
              onClick={() => onClaim(gift, "GROUP")}
              className="btn-secondary w-full"
            >
              Claim as a Group
            </button>
          )}
        </div>
        <a
          href={gift.purchaseLink}
          target="_blank"
          rel="noreferrer"
          className="text-center text-xs font-medium text-ink/40 underline-offset-2 hover:underline dark:text-cream/40"
        >
          see the actual thing ↗
        </a>
      </div>
    </div>
  );
}
