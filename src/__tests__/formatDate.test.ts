import { formatDate } from '../utils/formatDate';

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

describe('formatDate', () => {
  it('returns "Today" for a timestamp from today', () => {
    expect(formatDate(isoDaysAgo(0))).toBe('Today');
  });

  it('returns "Yesterday" for a timestamp from 1 day ago', () => {
    expect(formatDate(isoDaysAgo(1))).toBe('Yesterday');
  });

  it('returns "N days ago" for timestamps within the past week', () => {
    expect(formatDate(isoDaysAgo(3))).toBe('3 days ago');
    expect(formatDate(isoDaysAgo(6))).toBe('6 days ago');
  });

  it('returns a formatted date string for timestamps older than a week', () => {
    const result = formatDate(isoDaysAgo(10));
    // Should look like "Jan 1, 2025" — just check it's not a relative string
    expect(result).not.toMatch(/ago|Today|Yesterday/);
    expect(result.length).toBeGreaterThan(4);
  });
});
