import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  label: string;
  count?: number;
  className?: string;
  panelClassName?: string;
  children: React.ReactNode;
};

const VIEWPORT_MARGIN = 8;

export function FilterDisclosure({ label, count, className, panelClassName, children }: Props) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  const closeSiblingDisclosures = useCallback(() => {
    const current = detailsRef.current;
    const parent = current?.parentElement;
    if (!current || !parent) return;

    const opened = parent.querySelectorAll<HTMLDetailsElement>('details[data-filter-disclosure="true"][open]');
    opened.forEach((node) => {
      if (node !== current && node.parentElement === parent) node.open = false;
    });
  }, []);

  const adjustPanelPosition = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const minLeft = VIEWPORT_MARGIN;
    const maxRight = window.innerWidth - VIEWPORT_MARGIN;
    let nextOffset = 0;

    if (rect.left < minLeft) nextOffset += minLeft - rect.left;
    if (rect.right > maxRight) nextOffset += maxRight - rect.right;

    setOffsetX(nextOffset);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!detailsRef.current?.open) return;
      adjustPanelPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustPanelPosition]);

  const handleToggle = () => {
    if (!detailsRef.current?.open) {
      setOffsetX(0);
      return;
    }

    closeSiblingDisclosures();
    window.requestAnimationFrame(() => {
      adjustPanelPosition();
    });
  };

  return (
    <details
      ref={detailsRef}
      data-filter-disclosure="true"
      onToggle={handleToggle}
      className={`relative ${className || ''}`}
    >
      <summary
        className="relative z-30 inline-flex cursor-pointer list-none items-center gap-1 rounded-sm border border-gray-300/80 px-2 py-1 text-sm opacity-80 hover:opacity-100 dark:border-gray-700 [&::-webkit-details-marker]:hidden"
      >
        <span>{label}</span>
        {typeof count === 'number' ? <span className="tabular-nums opacity-70">({count})</span> : null}
        <span aria-hidden={true} className="text-xs leading-none">
          ▾
        </span>
      </summary>
      <div
        ref={panelRef}
        style={offsetX ? { transform: `translateX(${offsetX}px)` } : undefined}
        className={`absolute left-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${panelClassName || ''}`}
      >
        {children}
      </div>
    </details>
  );
}
