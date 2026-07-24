"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { formatIDR } from "@/lib/format";
import type { GiftData } from "./GiftCard";

export default function ClaimModal({
  gift,
  claimType,
  onClose,
}: {
  gift: GiftData;
  claimType: "SOLO" | "GROUP";
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<"PHONE" | "INSTAGRAM" | "EMAIL">("PHONE");
  const [contactValue, setContactValue] = useState("");
  const [groupSize, setGroupSize] = useState(3);
  const [budgetType, setBudgetType] = useState<"PER_PERSON" | "TOTAL">("TOTAL");
  const [budgetAmount, setBudgetAmount] = useState<number>(gift.price);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !contactValue.trim()) {
      setError("Fill in your name and contact info first!");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          claimType,
          claimantName: name,
          contactMethod,
          contactValue,
          groupSize: claimType === "GROUP" ? groupSize : undefined,
          budgetType: claimType === "GROUP" ? budgetType : undefined,
          budgetAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong, try again?");
        setSubmitting(false);
        return;
      }
      router.push(`/claimed/${data.claim.id}`);
    } catch {
      setError("Network hiccup, try again?");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-pop w-full max-w-md rounded-t-xl3 bg-white p-6 shadow-soft dark:bg-plum-900 sm:rounded-xl3"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">
              {claimType === "GROUP" ? "Claim as a Group" : "Claim This Gift"}
            </h3>
            <p className="text-sm text-ink/60 dark:text-cream/60">
              {gift.name} · {formatIDR(gift.price)}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost h-8 w-8 p-0">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/50 dark:text-cream/50">
              your name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="so I know who to thank later" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/50 dark:text-cream/50">
              how should I reach you if needed?
            </label>
            <div className="mb-2 flex gap-2">
              {(["PHONE", "INSTAGRAM", "EMAIL"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setContactMethod(m)}
                  className={clsx("btn flex-1 text-xs", contactMethod === m ? "btn-primary" : "btn-secondary")}
                >
                  {m === "PHONE" ? "Phone" : m === "INSTAGRAM" ? "Instagram" : "Email"}
                </button>
              ))}
            </div>
            <input
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className="input"
              placeholder={
                contactMethod === "PHONE" ? "08xx xxxx xxxx" : contactMethod === "INSTAGRAM" ? "@yourhandle" : "you@email.com"
              }
            />
          </div>

          {claimType === "GROUP" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/50 dark:text-cream/50">
                  how many of you are chipping in?
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink/50 dark:text-cream/50">
                  budget type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBudgetType("PER_PERSON")}
                    className={clsx("btn flex-1 text-xs", budgetType === "PER_PERSON" ? "btn-primary" : "btn-secondary")}
                  >
                    Per person
                  </button>
                  <button
                    onClick={() => setBudgetType("TOTAL")}
                    className={clsx("btn flex-1 text-xs", budgetType === "TOTAL" ? "btn-primary" : "btn-secondary")}
                  >
                    Overall
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm font-medium text-coral-500">{error}</p>}

          <button onClick={submit} disabled={submitting} className="btn-primary mt-1 w-full">
            {submitting ? "claiming..." : "confirm claim"}
          </button>
        </div>
      </div>
    </div>
  );
}
