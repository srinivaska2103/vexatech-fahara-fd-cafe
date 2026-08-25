import { z } from 'zod';

export const composeMessageSchema = z.object({
  recipients: z.array(z.string()).min(1, 'Please select at least one recipient.'),
  channel: z.enum(['IN_APP', 'EMAIL']),
  subject: z.string().min(3, 'Subject is required').max(100, 'Subject is too long'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000, 'Message is too long'),
});

export const notificationPreferencesSchema = z.object({
  booking_notifications: z.boolean().default(true),
  payment_notifications: z.boolean().default(true),
  review_notifications: z.boolean().default(true),
  customer_notifications: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  whatsapp_notifications: z.boolean().optional().default(false),
  in_app_notifications: z.boolean().default(true),
});
