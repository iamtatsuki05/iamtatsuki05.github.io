import { useEffect, useMemo, useState } from 'react';

const LOCATION_CHANGE_EVENT = 'app-location-change';

function readPathname() {
  const testPathname = (globalThis as { __NEXT_TEST_PATHNAME__?: string }).__NEXT_TEST_PATHNAME__;
  if (testPathname) return testPathname;
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

function readSearch() {
  const testSearch = (globalThis as { __NEXT_TEST_SEARCH_PARAMS__?: string }).__NEXT_TEST_SEARCH_PARAMS__;
  if (testSearch !== undefined) return testSearch;
  if (typeof window === 'undefined') return '';
  return window.location.search;
}

export function notifyLocationChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
}

export function usePathname(initialPathname?: string) {
  const [pathname, setPathname] = useState(() => initialPathname || readPathname());

  useEffect(() => {
    const update = () => setPathname(readPathname());
    window.addEventListener('popstate', update);
    window.addEventListener(LOCATION_CHANGE_EVENT, update);
    update();
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(LOCATION_CHANGE_EVENT, update);
    };
  }, []);

  return pathname;
}

export function useSearchParams() {
  const [search, setSearch] = useState(readSearch);

  useEffect(() => {
    const update = () => setSearch(readSearch());
    window.addEventListener('popstate', update);
    window.addEventListener(LOCATION_CHANGE_EVENT, update);
    update();
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(LOCATION_CHANGE_EVENT, update);
    };
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
  return useMemo(
    () => ({
      push: (href: string) => {
        const testPush = (globalThis as { __NEXT_TEST_ROUTER_PUSH__?: (href: string) => void }).__NEXT_TEST_ROUTER_PUSH__;
        if (testPush) {
          testPush(href);
          return;
        }
        if (typeof window !== 'undefined') {
          window.location.href = href;
        }
      },
    }),
    [],
  );
}
