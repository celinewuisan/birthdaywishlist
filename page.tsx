"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-10 w-10 place-items-center rounded-full bg-plum-900/5 text-lg transition hover:bg-plum-900/10 dark:bg-cream/10 dark:hover:bg-cream/15"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
