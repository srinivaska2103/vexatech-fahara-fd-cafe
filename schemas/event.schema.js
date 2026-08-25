import * as z from 'zod';

export const eventSchema = z.object({
  cafe_id: z.string().min(1, 'Please select a cafe'),
  event_type: z.string().min(1, 'Category is required'),
  package_name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, 'Price must be a positive number')
  ),
  duration_hours: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, 'Duration must be at least 1 hour').optional()
  ),
  minimum_persons: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, 'Minimum guests must be at least 1').optional()
  ),
  maximum_persons: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, 'Maximum guests must be at least 1').optional()
  ),
  // Inclusions - Map these to the boolean fields in backend
  food: z.boolean().default(false),
  cake: z.boolean().default(false),
  decoration: z.boolean().default(false),
  music: z.boolean().default(false),
  other: z.boolean().default(false),
  other_text: z.string().optional(),
  cover_image: z.any().optional(),

  // UI-only fields that won't be saved to backend (to prevent crashing)
  status: z.string().default('DRAFT'),
  custom_category: z.string().optional(),
  terms: z.string().optional(),
  gallery: z.any().optional(),
  availableDays: z.any().optional(),
}).refine(data => {
  if (data.minimum_persons && data.maximum_persons) {
    return data.minimum_persons <= data.maximum_persons;
  }
  return true;
}, {
  message: "Minimum guests cannot exceed maximum guests",
  path: ["maximum_persons"],
});
