import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must not exceed 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const emailSchema = z.object({
  email: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must not exceed 50 characters'),
})

export const passwordConfrimPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters long')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
export const signUpFormSchema =  z
.object({
  first_name: z
    .string({ required_error: 'Your name is required' })
    .min(1, { message: 'Your name is required' })
    .max(64, { message: 'Email must be less than 64 characters' }),

  last_name: z
    .string({ required_error: 'Your name is required' })
    .min(1, { message: 'Your name is required' })
    .max(64, { message: 'Email must be less than 64 characters' }),

  email: z
    .string({ required_error: 'Email is required' })
    .min(1, { message: 'Email is required' })
    .max(64, { message: 'Email must be less than 64 characters' })
    .email({ message: 'Email must be a valid email address' }),

  phone_number: z
    .string({ required_error: 'Phone number is required' })
    .min(1, { message: 'Phone number is required' })
    .max(20, { message: 'Phone number must be less than 20 characters' }),

  password: z
    .string({ required_error: 'Passord is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password must be less than 32 characters' })
    .trim(),

  confirm_password: z
    .string({ required_error: 'Confirmation Passord is required' })
    .min(8, { message: 'Confirmation Password must be at least 8 characters' })
    .max(32, { message: 'Confirmation Password must be less than 32 characters' })
    .trim()
})
.superRefine(({ confirm_password, password }, ctx) => {
  if (confirm_password !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Password and Confirm Password must match',
      path: ['password']
    });
    ctx.addIssue({
      code: 'custom',
      message: 'Password and Confirm Password must match',
      path: ['confirm_password']
    });
  }
});

export const tokenSchema = z
	.string({ required_error: 'A Token is required' })
	.min(26, { message: 'A Valid Token is required' })
	.max(32, { message: 'The Token is Invalid' })
	.refine((value) => value.trim().length > 0, { message: 'Token cannot be only whitespace' });

