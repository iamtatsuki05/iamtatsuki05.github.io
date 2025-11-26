import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { usePrefetchPreference } from '@/hooks/usePrefetchPreference';

type MockConn = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (event: string, handler: () => void) => void;
  removeEventListener?: (event: string, handler: () => void) => void;
};

const listeners = new Set<() => void>();

const setupConnection = (conn: MockConn) => {
  Object.defineProperty(navigator, 'connection', {
    configurable: true,
    value: {
      saveData: false,
      effectiveType: '4g',
      addEventListener: (_event: string, handler: () => void) => listeners.add(handler),
      removeEventListener: (_event: string, handler: () => void) => listeners.delete(handler),
      ...conn,
    },
  });
};

const cleanupConnection = () => {
  (navigator as any).connection = undefined;
  listeners.clear();
};

const triggerChange = () => {
  listeners.forEach((fn) => fn());
};

afterEach(() => {
  cleanupConnection();
});

describe('usePrefetchPreference', () => {
  it('defaults to true when NetworkInformation is unavailable', () => {
    const { result } = renderHook(() => usePrefetchPreference());
    expect(result.current).toBe(true);
  });

  it('disables prefetch on save-data', async () => {
    setupConnection({ saveData: true });

    const { result } = renderHook(() => usePrefetchPreference());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('disables prefetch on slow connections and reacts to changes', async () => {
    setupConnection({ effectiveType: '4g' });

    const { result } = renderHook(() => usePrefetchPreference());

    await waitFor(() => expect(result.current).toBe(true));

    act(() => {
      (navigator as any).connection.effectiveType = '2g';
      triggerChange();
    });

    await waitFor(() => expect(result.current).toBe(false));
  });
});
