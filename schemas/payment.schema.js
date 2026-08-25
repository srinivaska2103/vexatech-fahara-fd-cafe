import { z } from 'zod';

export const exportReportSchema = z.object({
  format: z.enum(['CSV', 'EXCEL', 'PDF']),
  date_range: z.enum(['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'CUSTOM']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  cafe_id: z.string().optional(),
  event_id: z.string().optional(),
  status: z.string().optional(),
}).refine(data => {
  if (data.date_range === 'CUSTOM') {
    return !!data.start_date && !!data.end_date;
  }
  return true;
}, {
  message: "Start Date and End Date are required for Custom range",
  path: ["start_date"]
});
