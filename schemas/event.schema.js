import * as z from 'zod';

export const eventSchema = z.object({
  cafe_id: z.any().optional(),
  event_type: z.any().optional(),
  package_name: z.string().min(1, 'Package name is required'),
  package_level: z.any().optional(),
  package_inclusions: z.any().optional(),
  description: z.any().optional(),
  price: z.any().optional(),
  duration_value: z.any().optional(),
  duration_unit: z.any().optional(),
  duration_hours: z.any().optional(),
  minimum_persons: z.any().optional(),
  maximum_persons: z.any().optional(),
  status: z.any().optional(),
}).passthrough();


