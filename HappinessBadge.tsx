"use client";

import { useEffect, useState } from "react";

type FaqItem = { q: string; a: string };

export default function AdminContentTab() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [intro, setIntro] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.content.homepage_title || "");
        setSubtitle(data.content.homepage_subtitle || "");
        setIntro(data.content.intro_message || "");
        setFaq(data.content.faq ? JSON.parse(data.content.faq) : []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(key: string, value: string) {
    setSavingKey(key);
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSavingKey(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 1500);
  }

  function updateFaq(i: number, patch: Partial<FaqItem>) {
    setFaq((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  if (loading) return <p className="text-sm text-ink/50">loading content...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-5">
        <label className="mb-1 block text-xs font-semibold text-ink/50">homepage title</label>
        <input className="input mb-3" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={() => save("homepage_title", title)} className="btn-secondary text-xs">
          {savingKey === "homepage_title" ? "saving..." : saved === "homepage_title" ? "saved ✓" : "save"}
        </button>
      </div>

      <div className="card p-5">
        <label className="mb-1 block text-xs font-semibold text-ink/50">homepage subtitle</label>
        <textarea className="input mb-3" rows={2} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <button onClick={() => save("homepage_subtitle", subtitle)} className="btn-secondary text-xs">
          {savingKey === "homepage_subtitle" ? "saving..." : saved === "homepage_subtitle" ? "saved ✓" : "save"}
        </button>
      </div>

      <div className="card p-5">
        <label className="mb-1 block text-xs font-semibold text-ink/50">intro message</label>
        <textarea className="input mb-3" rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
        <button onClick={() => save("intro_message", intro)} className="btn-secondary text-xs">
          {savingKey === "intro_message" ? "saving..." : saved === "intro_message" ? "saved ✓" : "save"}
        </button>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-xs font-semibold text-ink/50">FAQ</label>
          <button
            onClick={() => setFaq((prev) => [...prev, { q: "", a: "" }])}
            className="btn-ghost text-xs"
          >
            + add question
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {faq.map((item, i) => (
            <div key={i} className="rounded-xl2 border border-plum-800/10 p-3 dark:border-cream/10">
              <input
                className="input mb-2"
                placeholder="question"
                value={item.q}
                onChange={(e) => updateFaq(i, { q: e.target.value })}
              />
              <textarea
                className="input mb-2"
                rows={2}
                placeholder="answer"
                value={item.a}
                onChange={(e) => updateFaq(i, { a: e.target.value })}
              />
              <button
                onClick={() => setFaq((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-xs font-medium text-coral-500 underline"
              >
                remove
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => save("faq", JSON.stringify(faq))} className="btn-secondary mt-3 text-xs">
          {savingKey === "faq" ? "saving..." : saved === "faq" ? "saved ✓" : "save FAQ"}
        </button>
      </div>
    </div>
  );
}
