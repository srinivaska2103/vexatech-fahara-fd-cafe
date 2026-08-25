import { z } from 'zod';

// Reusable time string validation (HH:mm)
const timeStringSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: "Invalid time format. Use HH:mm",
}).optional().or(z.literal(''));

export const businessHoursSchema = z.object({
  isOpen: z.preprocess((val) => Array.isArray(val) ? Boolean(val[0]) : Boolean(val), z.boolean()),
  open: timeStringSchema,
  close: timeStringSchema,
});

export const cafeSchema = z.object({
  name: z.string().min(2, "Cafe name is required"),
  description: z.string().min(10, "Please provide a meaningful description"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().min(10, "Phone number is required").optional().or(z.literal('')),
  
  // Location
  address: z.string().min(5, "Address is required").optional().or(z.literal('')),
  city: z.string().min(2, "City is required").optional().or(z.literal('')),
  state: z.string().min(2, "State is required").optional().or(z.literal('')),
  country: z.string().min(2, "Country is required").optional().or(z.literal('')),
  pincode: z.string().min(4, "Pincode is required").optional().or(z.literal('')),
  latitude: z.any().optional(),
  longitude: z.any().optional(),
  
  
  // Details
  category: z.string().min(2, "Category is required").optional().or(z.literal('')),
  amenities: z.array(z.string()).optional().default([]),
  price: z.coerce.number().min(0, "Price must be positive").optional(),
  capacity: z.coerce.number().int().min(0, "Capacity must be positive").optional(),
  google_rating: z.coerce.number().min(0).max(5).optional(),
  provides_event_services: z.boolean().default(false),
  
  // Status
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('DRAFT'),
  
  // Nested Objects
  cover_image: z.string().optional().or(z.literal('')),
  gallery: z.any().optional(),
  
  businessHours: z.object({
    monday: businessHoursSchema,
    tuesday: businessHoursSchema,
    wednesday: businessHoursSchema,
    thursday: businessHoursSchema,
    friday: businessHoursSchema,
    saturday: businessHoursSchema,
    sunday: businessHoursSchema,
  }).optional(),
});
