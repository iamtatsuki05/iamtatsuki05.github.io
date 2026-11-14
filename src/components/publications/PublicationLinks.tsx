import type { ReactNode } from 'react';
import type { PublicationLinkKind } from '@/lib/content/types';

export type PublicationLink = { kind: PublicationLinkKind; url: string };

const linkKinds: Record<PublicationLinkKind, { label: string; icon: ReactNode }> = {
  paper: {
    label: 'Paper',
    icon: <path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" />,
  },
  doi: {
    label: 'DOI',
    icon: <path d="M10 4 8 20 M16 4l-2 16 M5 9h15 M4 15h15" />,
  },
  post: {
    label: 'Post',
    icon: <path d="M4 20h4L19 9l-4-4L4 16z M13 7l4 4" />,
  },
  slides: {
    label: 'Slides',
    icon: <path d="M3 4h18v12H3z M12 16v4 M8 20h8 M8 12l3-3 2 2 3-3" />,
  },
  video: {
    label: 'Video',
    icon: <path d="M3 6h18v12H3z M10 9v6l5-3z" />,
  },
  code: {
    label: 'Code',
    icon: <path d="M8 8l-4 4 4 4 M16 8l4 4-4 4 M14 5l-4 14" />,
  },
  model: {
    label: 'Model',
    icon: (
      <>
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="12" r="2" />
        <path d="M8 6.8l8 4.4 M8 17.2l8-4.4 M6 8v8" />
      </>
    ),
  },
  data: {
    label: 'Data',
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  app: {
    label: 'App',
    icon: <path d="M3 5h18v14H3z M3 9h18 M6 7h.01 M9 7h.01 M10 13l2 2-2 2 M14 17h3" />,
  },
  project: {
    label: 'Project',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18 M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9s1.1-6.5 3.5-9z" />
      </>
    ),
  },
  pypi: {
    label: 'PyPI',
    icon: <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z M3 7.5 12 12l9-4.5 M12 12v9 M7.5 5.2l9 4.6" />,
  },
};

export function PublicationLinks({ links }: { links: PublicationLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" data-testid="publication-links">
      {links.map(({ kind, url }) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            data-kind={kind}
            className="publication-link inline-flex min-h-7 items-center gap-1 rounded-full border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-wider shadow-sm shadow-purple-100 transition [--link:var(--color-purple-800)] hover:-translate-y-px hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-purple-400/40 dark:bg-purple-500/15 dark:shadow-none dark:[--link:var(--color-purple-100)] dark:hover:border-amber-300/60 dark:hover:bg-amber-300/10 dark:focus-visible:outline-amber-300"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {linkKinds[kind].icon}
            </svg>
            {linkKinds[kind].label}
          </a>
        </li>
      ))}
    </ul>
  );
}
