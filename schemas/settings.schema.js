import { z } from 'zod';

export const businessProfileSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  gst_number: z.string().optional(),
  pan_number: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const passwordChangeSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const branchSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(5, 'Address is required'),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});

export const bookingSettingsSchema = z.object({
  booking_window_days: z.number().min(1),
  min_notice_hours: z.number().min(0),
  max_guests_per_booking: z.number().min(1),
  auto_confirm: z.boolean(),
});
