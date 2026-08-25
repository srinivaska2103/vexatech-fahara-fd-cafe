import { z } from 'zod';

export const customerNoteSchema = z.object({
  note: z.string().min(5, 'Note must be at least 5 characters long.').max(1000, 'Note is too long.'),
});

export const blockCustomerSchema = z.object({
  reason: z.string().min(5, 'Please provide a valid reason for blocking this customer.').max(500, 'Reason is too long.'),
});
