import { describe, it, expect } from 'vitest';
import { loanSchema } from './loan-schema';

describe('Kiểm tra loan-schema.ts', () => {
  it('loanSchema chứa đầy đủ các hàm helper', () => {
    expect(typeof loanSchema.validate).toBe('function');
    expect(typeof loanSchema.toInput).toBe('function');
    expect(typeof loanSchema.toData).toBe('function');
    expect(typeof loanSchema.today).toBe('function');
  });
});
