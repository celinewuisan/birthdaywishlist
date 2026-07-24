"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Wrong passcode.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div className="card p-8">
        <h1 className="font-display text-xl font-bold">owner access</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">
          this is the part where nobody else gets to look.
        </p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="passcode"
          className="input mt-5"
          autoFocus
        />
        {error && <p className="mt-2 text-sm font-medium text-coral-500">{error}</p>}
        <button onClick={submit} disabled={loading} className="btn-primary mt-4 w-full">
          {loading ? "checking..." : "let me in"}
        </button>
      </div>
    </main>
  );
}
