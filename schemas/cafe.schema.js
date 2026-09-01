import { z } from 'zod';

// Reusable time string validation (HH:mm)
const timeStringSchema = z.preprocess(
  (val) => (val === null || val === undefined) ? '' : String(val),
  z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:mm",
  }).optional().or(z.literal(''))
);

export const businessHoursSchema = z.preprocess(
  (val) => {
    if (!val || typeof val !== 'object') {
      return { isOpen: false, open: '', close: '' };
    }
    return val;
  },
  z.object({
    isOpen: z.preprocess((val) => Array.isArray(val) ? Boolean(val[0]) : Boolean(val), z.boolean()).default(false),
    open: timeStringSchema,
    close: timeStringSchema,
  })
);

const stringOrNull = z.preprocess(
  (val) => (val === null || val === undefined) ? '' : String(val),
  z.string().optional().or(z.literal(''))
);

const numberOrNull = z.preprocess(
  (val) => (val === null || val === undefined || val === '') ? undefined : Number(val),
  z.number().optional()
);

export const cafeSchema = z.object({
  name: z.string().min(2, "Cafe name is required"),
  description: z.preprocess(
    (val) => (val === null || val === undefined) ? '' : String(val),
    z.string().min(10, "Please provide a meaningful description").optional().or(z.literal(''))
  ),
  email: z.preprocess(
    (val) => (val === null || val === undefined) ? '' : String(val),
    z.string().email("Invalid email address").optional().or(z.literal(''))
  ),
  phone: stringOrNull,
  
  // Location
  address: stringOrNull,
  city: stringOrNull,
  state: stringOrNull,
  country: stringOrNull,
  pincode: stringOrNull,
  latitude: z.any().optional(),
  longitude: z.any().optional(),
  
  // Details
  category: stringOrNull,
  amenities: z.array(z.string()).optional().default([]),
  price: numberOrNull,
  capacity: numberOrNull,
  google_rating: numberOrNull,
  provides_event_services: z.boolean().default(false),
  allow_third_party_decoration: z.boolean().default(true),
  discounts: z.any().optional(),
  
  // Status
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('DRAFT'),
  
  // Nested Objects
  cover_image: stringOrNull,
  gallery: z.any().optional(),
  
  businessHours: z.preprocess(
    (val) => {
      const defaultHours = {
        monday: { isOpen: true, open: '09:00', close: '21:00' },
        tuesday: { isOpen: true, open: '09:00', close: '21:00' },
        wednesday: { isOpen: true, open: '09:00', close: '21:00' },
        thursday: { isOpen: true, open: '09:00', close: '21:00' },
        friday: { isOpen: true, open: '09:00', close: '22:00' },
        saturday: { isOpen: true, open: '10:00', close: '23:00' },
        sunday: { isOpen: false, open: '', close: '' },
      };

      if (!val || typeof val !== 'object') return defaultHours;

      return {
        monday: val.monday || defaultHours.monday,
        tuesday: val.tuesday || defaultHours.tuesday,
        wednesday: val.wednesday || defaultHours.wednesday,
        thursday: val.thursday || defaultHours.thursday,
        friday: val.friday || defaultHours.friday,
        saturday: val.saturday || defaultHours.saturday,
        sunday: val.sunday || defaultHours.sunday,
      };
    },
    z.object({
      monday: businessHoursSchema,
      tuesday: businessHoursSchema,
      wednesday: businessHoursSchema,
      thursday: businessHoursSchema,
      friday: businessHoursSchema,
      saturday: businessHoursSchema,
      sunday: businessHoursSchema,
    }).optional().nullable()
  ),
});
