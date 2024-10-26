import { z } from 'zod';

// Get the current date and time in ISO format
const currentDateTime = new Date().toISOString();


export const formSchema = z.object({
  email: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must not exceed 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const emailSchema = z.object({
  email: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must not exceed 50 characters'),
})

export const passworSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  token: z.string(),
  confirm_password: z.string().min(8, 'Confirm Password must be at least 8 characters long')
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

export const budgetSchema = z.object({
  name: z.string().min(1, { message: 'Budget name is required' }).max(64, { message: 'Budget name must be less than 64 characters' }),
  is_strict: z.boolean().default(true),
  category: z.string().min(1, { message: 'Category is required' }).max(64, { message: 'Category must be less than 64 characters' }),
  total_amount: z.number().min(0, { message: 'Total amount must be greater than 0' }),
  currency_code: z.string().min(1, { message: 'Currency code is required' }).max(64, { message: 'Currency code must be less than 64 characters' }),
  description: z.string().min(1, { message: 'Description is required' }).max(64, { message: 'Description must be less than 64 characters' }),
 });

export const debtSchema = z.object({
  name: z.string().min(1, { message: 'Debt name is required' }).max(64, { message: 'Debt name must be less than 64 characters' }),
  amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
  interest_rate: z.number().min(0, { message: 'Interest rate must be greater than 0' }),
  description: z.string().min(1, { message: 'Description is required' }).max(64, { message: 'Description must be less than 64 characters' }),
  due_date: z.string().min(1, { message: 'Due date is required' }).max(64, { message: 'Due date must be less than 64 characters' }),
  minimum_payment: z.number().min(1, { message: 'Minimum payment must be greater than 0' }),
 });

export const debtInstallmentSchema = z.object({
  payment_amount: z.number().min(1, { message: 'Payment amount must be greater than 0' }),
});

export const goalSchema = z.object({
  budget_id: z.number().min(1, { message: 'Budget is required' }),
  name: z.string().min(1, { message: 'Goal name is required' }).max(64, { message: 'Goal name must be less than 64 characters' }),
  current_amount: z.number().min(1, { message: 'Current amount must be greater than 0' }),
  target_amount: z.number().min(1, { message: 'Target amount must be greater than 0' }).default(1),
  monthly_contribution: z.number().min(1, { message: 'Monthly contribution must be greater than 0' }),
  start_date: z.string().min(1, { message: 'Start date is required' }).max(64, { message: 'Start date must be less than 64 characters' }),
  end_date: z.string().min(1, { message: 'End date is required' }).max(64, { message: 'End date must be less than 64 characters' }),
  status: z.string().min(1, { message: 'Status is required' }).max(64, { message: 'Status must be less than 64 characters' }).default('ongoing'),
 });

export const recurringExpenseSchema = z.object({
  budget_id: z.number().min(1, { message: 'Budget is required' }),
  amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
  name: z.string().min(1, { message: 'Expense name is required' }).max(64, { message: 'Expense name must be less than 64 characters' }),
  description: z.string().min(1, { message: 'Description is required' }).max(64, { message: 'Description must be less than 64 characters' }),
  recurrence_interval: z.string().min(1, { message: 'Recurrence interval is required' }).max(64, { message: 'Recurrence interval must be less than 64 characters' }).default('monthly'),
 });


export const expenseSchema = z.object({
  budget_id: z.number().min(1, { message: 'Budget is required' }),
  name: z.string().min(1, { message: 'Expense name is required' }).max(64, { message: 'Expense name must be less than 64 characters' }),
  category: z.string().min(1, { message: 'Category is required' }).max(64, { message: 'Category must be less than 64 characters' }),
  amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
  description: z.string().min(1, { message: 'Description is required' }).max(64, { message: 'Description must be less than 64 characters' }),
  date_occurred: z.string().min(1, { message: 'Date occurred is required' }).max(64, { message: 'Date occurred must be less than 64 characters' }).default(currentDateTime),
 });


export const tokenSchema = z
	.string({ required_error: 'A Token is required' })
	.min(26, { message: 'A Valid Token is required' })
	.max(32, { message: 'The Token is Invalid' })
	.refine((value) => value.trim().length > 0, { message: 'Token cannot be only whitespace' });

