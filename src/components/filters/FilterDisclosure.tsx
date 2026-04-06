import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  label: string;
  count?: number;
  className?: string;
  panelClassName?: string;
  autoCloseOnSelect?: 'mobile' | 'always';
  children: React.ReactNode | ((actions: { requestCloseIfNeeded: () => void }) => React.ReactNode);
};

const VIEWPORT_MARGIN = 8;
const MOBILE_MEDIA_QUERY = '(max-width: 639px)';
const MOBILE_MAX_WIDTH = 639;
const FORCE_CLOSE_EVENT = 'filter-disclosure-force-close';

export function FilterDisclosure({ label, count, className, panelClassName, autoCloseOnSelect, children }: Props) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeSiblingDisclosures = useCallback(() => {
    const current = detailsRef.current;
    const parent = current?.parentElement;
    if (!current || !parent) return;

    const opened = parent.querySelectorAll<HTMLDetailsElement>('details[data-filter-disclosure="true"][open]');
    opened.forEach((node) => {
      if (node !== current && node.parentElement === parent) {
        node.dispatchEvent(new CustomEvent(FORCE_CLOSE_EVENT));
      }
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

  const closeDisclosure = useCallback(() => {
    setIsOpen(false);
  }, []);

  const shouldAutoCloseOnSelect = useCallback(() => {
    if (!autoCloseOnSelect) return false;
    if (autoCloseOnSelect === 'always') return true;
    if (typeof window === 'undefined') return false;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    if (viewportWidth <= MOBILE_MAX_WIDTH) return true;

    if (typeof window.matchMedia !== 'function') return false;
    return Boolean(window.matchMedia(MOBILE_MEDIA_QUERY)?.matches);
  }, [autoCloseOnSelect]);

  const openDisclosure = useCallback(() => {
    closeSiblingDisclosures();
    setIsOpen(true);
  }, [closeSiblingDisclosures]);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const handleForceClose = () => {
      closeDisclosure();
    };

    details.addEventListener(FORCE_CLOSE_EVENT, handleForceClose);
    return () => {
      details.removeEventListener(FORCE_CLOSE_EVENT, handleForceClose);
    };
  }, [closeDisclosure]);

  useEffect(() => {
    const handleResize = () => {
      if (!isOpen) return;
      adjustPanelPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustPanelPosition, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      panelRef.current?.style.setProperty('--filter-disclosure-offset-x', '0px');
      panelRef.current?.style.removeProperty('--filter-disclosure-max-width');
      return;
    }

    adjustPanelPosition();
  }, [adjustPanelPosition, isOpen]);

  const requestCloseIfNeeded = () => {
    if (!shouldAutoCloseOnSelect()) return;
    closeDisclosure();
  };

  return (
    <details
      ref={detailsRef}
      open={isOpen}
      data-filter-disclosure="true"
      data-state={isOpen ? 'open' : 'closed'}
      className={`filter-disclosure relative ${className || ''}`}
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          if (isOpen) closeDisclosure();
          else openDisclosure();
        }}
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
        {typeof children === 'function' ? children({ requestCloseIfNeeded }) : children}
      </div>
    </details>
  );
}
