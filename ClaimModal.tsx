"use client";

import { useState } from "react";

export type GiftFormValues = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  purchaseLink: string;
  happinessLevel: "HAPPY" | "OMG_EXCITED" | "CHANGED_MY_LIFE";
  category: string;
  quantityAvailable: number;
};

const BLANK: GiftFormValues = {
  name: "",
  description: "",
  imageUrl: "",
  price: 100000,
  purchaseLink: "",
  happinessLevel: "HAPPY",
  category: "",
  quantityAvailable: 1,
};

export default function GiftFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: GiftFormValues;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<GiftFormValues>(initial || BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof GiftFormValues>(key: K, value: GiftFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save() {
    if (!values.name || !values.description || !values.imageUrl || !values.purchaseLink || !values.category) {
      setError("Fill in every field.");
      return;
    }
    setSaving(true);
    setError("");
    const url = values.id ? `/api/gifts/${values.id}` : "/api/gifts";
    const method = values.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      onSaved();
    } else {
      const data = await res.json();
      setError(data.error || "Couldn't save that.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl3 bg-white p-6 shadow-soft dark:bg-plum-900"
      >
        <h3 className="mb-4 font-display text-lg font-semibold">{values.id ? "edit gift" : "add a gift"}</h3>

        <div className="flex flex-col gap-3">
          <input className="input" placeholder="name" value={values.name} onChange={(e) => set("name", e.target.value)} />
          <textarea
            className="input"
            rows={3}
            placeholder="description"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <input
            className="input"
            placeholder="image URL"
            value={values.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
          <input
            className="input"
            placeholder="purchase link"
            value={values.purchaseLink}
            onChange={(e) => set("purchaseLink", e.target.value)}
          />
          <input
            className="input"
            placeholder="category"
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/50">price (IDR)</label>
              <input
                type="number"
                className="input"
                min={50000}
                max={4000000}
                value={values.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink/50">slots available (1-5)</label>
              <input
                type="number"
                className="input"
                min={1}
                max={5}
                value={values.quantityAvailable}
                onChange={(e) => set("quantityAvailable", Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/50">happiness level</label>
            <select
              className="input"
              value={values.happinessLevel}
              onChange={(e) => set("happinessLevel", e.target.value as GiftFormValues["happinessLevel"])}
            >
              <option value="HAPPY">Happy!</option>
              <option value="OMG_EXCITED">OMG SO EXCITED</option>
              <option value="CHANGED_MY_LIFE">You Changed My Life</option>
            </select>
          </div>

          {error && <p className="text-sm font-medium text-coral-500">{error}</p>}

          <div className="mt-2 flex gap-2">
            <button onClick={onClose} className="btn-secondary flex-1">
              cancel
            </button>
            <button onClick={save} disabled={saving} className="btn-primary flex-1">
              {saving ? "saving..." : "save gift"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
