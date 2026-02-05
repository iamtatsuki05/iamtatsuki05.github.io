import React from 'react';

type RouteStatusShellProps = {
  code: string;
  title: string;
  description: string;
  detail?: string;
  actions: React.ReactNode;
};

export function RouteStatusShell({
  code,
  title,
  description,
  detail,
  actions,
}: RouteStatusShellProps) {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-3xl items-center justify-center py-8 sm:py-12">
      <section className="relative w-full overflow-hidden rounded-3xl border border-purple-200/70 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(192,132,252,0.8)] backdrop-blur-sm sm:p-10 dark:border-purple-500/40 dark:bg-[#120d21]/90 dark:shadow-[0_24px_80px_-48px_rgba(192,132,252,0.55)]">
        <div className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/25" />
        <div className="pointer-events-none absolute -bottom-20 -right-8 h-56 w-56 rounded-full bg-amber-200/45 blur-3xl dark:bg-amber-300/20" />

        <div className="relative space-y-5">
          <p className="inline-flex items-center rounded-full border border-purple-300/60 bg-purple-100/70 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-purple-700 dark:border-purple-400/40 dark:bg-purple-500/20 dark:text-purple-100">
            {code}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
          {detail ? <p className="text-sm text-gray-500 dark:text-gray-400">{detail}</p> : null}
          <div className="flex flex-wrap gap-3">{actions}</div>
        </div>
      </section>
    </div>
  );
}
