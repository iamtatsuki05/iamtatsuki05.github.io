import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/date';

describe('formatDate', () => {
  it('formats ISO date in UTC (ja)', () => {
    expect(formatDate('2025-09-08T10:20:30.000Z', 'ja')).toBe('2025/09/08');
  });
  it('formats ISO date in UTC (en)', () => {
    expect(formatDate('2025-01-02T23:59:59.000Z', 'en')).toBe('2025-01-02');
  });
  it('handles plain date string', () => {
    expect(formatDate('2025-03-05', 'ja')).toBe('2025/03/05');
  });
});

