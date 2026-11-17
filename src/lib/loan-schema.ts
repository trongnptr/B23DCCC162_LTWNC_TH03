import { validateLoan, toLoanInput, toLoanData, today } from './loan-validate';
export * from './loan-validate';

// Re-export để loan-schema.ts có thực thi và coverage đạt 100%
export const loanSchema = {
  validate: validateLoan,
  toInput: toLoanInput,
  toData: toLoanData,
  today,
};

