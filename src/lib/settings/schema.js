import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must not exceed 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
