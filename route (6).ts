@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-plum-800/10 dark:border-cream/10;
  }
  ::selection {
    @apply bg-indigo-500/20;
  }
  :focus-visible {
    @apply outline-none ring-2 ring-indigo-500 ring-offset-2 ring-offset-cream dark:ring-offset-plum-950;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-xl2 px-5 py-2.5 font-display text-sm font-semibold transition-transform active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50;
  }
  .btn-primary {
    @apply btn bg-indigo-500 text-white shadow-soft hover:bg-indigo-600 dark:shadow-softDark;
  }
  .btn-secondary {
    @apply btn bg-plum-900/5 text-ink hover:bg-plum-900/10 dark:bg-cream/10 dark:text-cream dark:hover:bg-cream/15;
  }
  .btn-ghost {
    @apply btn bg-transparent text-ink/70 hover:bg-plum-900/5 dark:text-cream/70 dark:hover:bg-cream/10;
  }
  .card {
    @apply rounded-xl3 bg-white shadow-soft dark:bg-plum-900 dark:shadow-softDark;
  }
  .input {
    @apply w-full rounded-xl border border-plum-800/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 dark:border-cream/15 dark:bg-plum-800 dark:text-cream dark:placeholder:text-cream/30;
  }
}
