import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('Kiểm tra format.ts', () => {
  it("formatDate('2026-12-02') -> 02/12/2026", () => {
    expect(formatDate('2026-12-02')).toBe('02/12/2026');
  });
});
