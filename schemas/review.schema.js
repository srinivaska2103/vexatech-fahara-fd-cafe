import { z } from 'zod';

export const reviewReplySchema = z.object({
  reply: z.string().min(10, 'Reply must be at least 10 characters long.').max(1000, 'Reply is too long.'),
});
