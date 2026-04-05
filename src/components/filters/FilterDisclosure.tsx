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
  const [isOpen, setIsOpen] = useState(false);

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
    const details = detailsRef.current;
    const panel = panelRef.current;
    if (!details || !panel) return;

    const boundary =
      details.closest<HTMLElement>('[data-filter-bar-root="true"]') ?? details.parentElement ?? document.body;
    const boundaryRect = boundary.getBoundingClientRect();
    const minLeft = Math.max(boundaryRect.left + VIEWPORT_MARGIN, VIEWPORT_MARGIN);
    const maxRight = Math.min(boundaryRect.right - VIEWPORT_MARGIN, window.innerWidth - VIEWPORT_MARGIN);
    const maxWidth = Math.max(maxRight - minLeft, 0);

    panel.style.setProperty('--filter-disclosure-max-width', `${maxWidth}px`);
    const detailsRect = details.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    let nextOffset = Number.parseFloat(panel.style.getPropertyValue('--filter-disclosure-offset-x') || '0');

    if (!Number.isFinite(nextOffset)) nextOffset = 0;

    const projectedLeft = detailsRect.left + nextOffset;
    if (projectedLeft < minLeft) nextOffset += minLeft - projectedLeft;

    const projectedRight = detailsRect.left + nextOffset + panelWidth;
    if (projectedRight > maxRight) nextOffset += maxRight - projectedRight;

    panel.style.setProperty('--filter-disclosure-offset-x', `${nextOffset}px`);
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
    const open = Boolean(detailsRef.current?.open);
    setIsOpen(open);

    if (!open) {
      panelRef.current?.style.setProperty('--filter-disclosure-offset-x', '0px');
      panelRef.current?.style.removeProperty('--filter-disclosure-max-width');
      return;
    }

    closeSiblingDisclosures();
    adjustPanelPosition();
  };

  return (
    <details
      ref={detailsRef}
      data-filter-disclosure="true"
      data-state={isOpen ? 'open' : 'closed'}
      onToggle={handleToggle}
      className={`filter-disclosure relative ${className || ''}`}
    >
      <summary
        className="filter-disclosure__summary relative z-30 inline-flex cursor-pointer list-none items-center gap-1 rounded-full px-2.5 py-1.5 text-sm [&::-webkit-details-marker]:hidden"
      >
        <span>{label}</span>
        {typeof count === 'number' ? <span className="filter-disclosure__count tabular-nums">({count})</span> : null}
        <span aria-hidden={true} className="filter-disclosure__chevron text-xs leading-none">
          ▾
        </span>
      </summary>
      <div
        ref={panelRef}
        className={`filter-disclosure__panel absolute left-0 z-20 mt-2 rounded-2xl p-2 ${panelClassName || ''}`}
      >
        {children}
      </div>
    </details>
  );
}
