"use client";

import { useEffect, useState } from "react";
import { formatIDR } from "@/lib/format";

type Claim = {
  id: string;
  claimType: "SOLO" | "GROUP";
  claimantName: string;
  contactMethod: string;
  contactValue: string;
  groupSize: number | null;
  budgetType: string | null;
  budgetAmount: number | null;
  createdAt: string;
  gift: { name: string; price: number };
};

export default function AdminClaimsTab() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/claims")
      .then((r) => r.json())
      .then((data) => setClaims(data.claims || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink/50">loading claims...</p>;

  return (
    <div className="card overflow-x-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-ink/60 dark:text-cream/60">{claims.length} claim(s) total</p>
        <a href="/api/claims/export" className="btn-secondary text-sm">
          export CSV
        </a>
      </div>

      {claims.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink/40">nobody's claimed anything yet.</p>
      ) : (
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum-800/10 text-xs uppercase text-ink/40 dark:border-cream/10 dark:text-cream/40">
              <th className="py-2 pr-4">Gift</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Claimant</th>
              <th className="py-2 pr-4">Contact</th>
              <th className="py-2 pr-4">Group / Budget</th>
              <th className="py-2 pr-4">When</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="border-b border-plum-800/5 dark:border-cream/5">
                <td className="py-2 pr-4 font-medium">
                  {c.gift.name}
                  <div className="font-mono text-xs text-ink/40">{formatIDR(c.gift.price)}</div>
                </td>
                <td className="py-2 pr-4">{c.claimType}</td>
                <td className="py-2 pr-4">{c.claimantName}</td>
                <td className="py-2 pr-4">
                  {c.contactMethod}: {c.contactValue}
                </td>
                <td className="py-2 pr-4">
                  {c.groupSize ? `${c.groupSize} people` : "—"}
                  {c.budgetAmount ? ` · ${formatIDR(c.budgetAmount)} (${c.budgetType})` : ""}
                </td>
                <td className="py-2 pr-4 text-xs text-ink/50">
                  {new Date(c.createdAt).toLocaleString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
