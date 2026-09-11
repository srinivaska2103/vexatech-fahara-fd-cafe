import * as z from 'zod';

export const eventSchema = z.object({
  cafe_id: z.string().min(1, 'Please select a cafe'),
  event_type: z.string().optional().transform(val => (val && val.trim()) ? val : 'Birthday Party'),
  package_name: z.string().min(3, 'Event name must be at least 3 characters'),
  package_level: z.string().default('STANDARD'),
  package_inclusions: z.any().optional(),
  description: z.string().optional().or(z.literal('')),
  price: z.any().transform(val => {
    if (val === '' || val === null || val === undefined) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : Math.max(0, num);
  }),
  duration_hours: z.any().transform(val => (val !== '' && val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined)),
  minimum_persons: z.any().transform(val => (val !== '' && val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined)),
  maximum_persons: z.any().transform(val => (val !== '' && val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined)),
  // Inclusions - Map these to the boolean fields in backend
  food: z.boolean().default(false),
  cake: z.boolean().default(false),
  decoration: z.boolean().default(false),
  music: z.boolean().default(false),
  other: z.boolean().default(false),
  other_text: z.string().optional(),
  
  // Editable service & inclusion items (arrays of { name, price })
  food_items: z.any().optional(),
  cake_items: z.any().optional(),
  decoration_items: z.any().optional(),
  music_items: z.any().optional(),
  other_items: z.any().optional(),
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
