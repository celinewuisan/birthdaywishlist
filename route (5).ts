"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import AdminClaimsTab from "@/components/admin/AdminClaimsTab";
import AdminGiftsTab from "@/components/admin/AdminGiftsTab";
import AdminContentTab from "@/components/admin/AdminContentTab";

type Tab = "claims" | "gifts" | "content";

export default function AdminDashboard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("claims");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.isAdmin) router.replace("/admin");
        else setChecked(true);
      });
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  }

  if (!checked) {
    return <div className="p-10 text-center text-sm text-ink/50">checking passcode...</div>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">owner dashboard</h1>
        <button onClick={logout} className="btn-ghost text-sm">
          log out
        </button>
      </header>

      <div className="mb-6 flex gap-2">
        {(["claims", "gifts", "content"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx("btn text-sm capitalize", tab === t ? "btn-primary" : "btn-secondary")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "claims" && <AdminClaimsTab />}
      {tab === "gifts" && <AdminGiftsTab />}
      {tab === "content" && <AdminContentTab />}
    </main>
  );
}
