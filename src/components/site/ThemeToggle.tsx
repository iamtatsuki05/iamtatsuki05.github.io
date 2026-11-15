/** Icons follow the `.dark` class set before paint, so the button renders correctly before headerController runs. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      data-theme-toggle
      className="theme-toggle group flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/78 text-gray-700 shadow-[0_18px_36px_-28px_rgba(192,132,252,0.85)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-white/92 dark:border-white/10 dark:bg-[#171022]/80 dark:text-gray-100 dark:hover:border-amber-200/30 dark:hover:bg-[#1d1630]/88 focus-ring"
    >
      <span className="relative block h-5 w-5">
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-[1.05rem] transition duration-300 ease-out translate-y-0 rotate-0 scale-100 opacity-100 dark:translate-y-1 dark:rotate-90 dark:scale-75 dark:opacity-0"
        >
          ☀️
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-[1.05rem] transition duration-300 ease-out -translate-y-1 -rotate-90 scale-75 opacity-0 dark:translate-y-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
        >
          🌙
        </span>
      </span>
    </button>
  );
}
