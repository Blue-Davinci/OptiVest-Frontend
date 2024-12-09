import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().min(2, 'Email must be at least 2 characters').max(50, 'Email must not exceed 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const emailSchema = z.object({
  email: z.string().min(5, 'Email must be at least 2 characters').max(50, 'Email must not exceed 50 characters'),
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
    .trim(),
  terms_accepted: z
    .boolean({ required_error: 'You must accept the terms and conditions' })
    .refine(value => value === true, { message: 'You must accept the terms and conditions' })
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
  date_occurred: z.string().min(1, { message: 'Date occurred is required' }).max(64, { message: 'Date occurred must be less than 64 characters' }),
 });

export const incomeSchema = z.object({
  source: z.string().min(1, { message: 'Source is required' }).max(64, { message: 'Source must be less than 64 characters' }),
  currency_code: z.string().min(1, { message: 'Currency code is required' }).max(64, { message: 'Currency code must be less than 64 characters' }),
  amount_original: z.number().min(1, { message: 'Amount must be greater than 0' }),
  description: z.string().min(1, { message: 'Description is required' }).max(64, { message: 'Description must be less than 64 characters' }),
  date_received: z.string().min(1, { message: 'Date received is required' }).max(64, { message: 'Date received must be less than 64 characters' }),
 });

export const stockSchema = z.object({
  stock_symbol: z.string().min(1, { message: 'Stock symbol is required' }).max(10, { message: 'Stock symbol must be less than 10 characters' }),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
  purchase_price: z.number().min(1, { message: 'Purchase price must be greater than 0' }),
  current_value: z.number().min(1, { message: 'Current value must be greater than 0' }),
  sector: z.string().min(1, { message: 'Sector is required' }).max(64, { message: 'Sector must be less than 64 characters' }),
  purchase_date: z.string().min(1, { message: 'Purchase date is required' }).max(64, { message: 'Purchase date must be less than 64 characters' }),
  dividend_yield: z.number().min(0, { message: 'Dividend yield must be greater than 0' }),
 });

export const bondSchema = z.object({
  bond_symbol: z.string().min(1, { message: 'Bond symbol is required' }).max(10, { message: 'Bond symbol must be less than 10 characters' }),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }),
  purchase_price: z.number().min(1, { message: 'Purchase price must be greater than 0' }),
  current_value: z.number().min(1, { message: 'Current value must be greater than 0' }),
  coupon_rate: z.number().min(0, { message: 'Coupon rate must be greater than 0' }),
  maturity_date: z.string().min(1, { message: 'Maturity date is required' }).max(64, { message: 'Maturity date must be less than 64 characters' }),
  purchase_date: z.string().min(1, { message: 'Purchase date is required' }).max(64, { message: 'Purchase date must be less than 64 characters' }),
 });
/*
    "investment_type": "Business",
    "investment_name": "John's Law firm",
    "is_business": true,
    "quantity": 1,
    "annual_revenue": "80000.00",
    "acquired_at": "2024-08-10T00:00:00Z",
    "profit_margin": "10.00",
    "valuation": "200000.00",
    "location": "Nairobi Kenya"
*/

export const investmentSchema = z.object({
  investment_type: z.string().min(1, { message: 'Investment type is required' }).max(64, { message: 'Investment type must be less than 64 characters' }),
  investment_name: z.string().min(0, { message: 'Investment name is required' }).max(64, { message: 'Investment name must be less than 64 characters' }),
  is_business: z.boolean().default(true),
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }).default(1),
  annual_revenue: z.number().min(0, { message: 'Annual revenue must be greater than 0' }),
  acquired_at: z.string().min(1, { message: 'Acquired at is required' }).max(64, { message: 'Acquired at must be less than 64 characters' }),
  profit_margin: z.number().min(0, { message: 'Profit margin must be provided if it is a business' }),
  valuation: z.number().min(1, { message: 'Valuation must be greater than 0' }),
  location: z.string().min(1, { message: 'Location is required' }).max(64, { message: 'Location must be less than 64 characters' }),
 });



export const tokenSchema = z
	.string({ required_error: 'A Token is required' })
	.min(26, { message: 'A Valid Token is required' })
	.max(32, { message: 'The Token is Invalid' })
	.refine((value) => value.trim().length > 0, { message: 'Token cannot be only whitespace' });

export const recoverySchema = z.object({
  token_plaintext : z
  .string()
  .min(1, { message: 'Token is required' })
  .max(64, { message: 'Token must be less than 64 characters' })
  .refine((value) => value.trim().length > 0, { message: 'Token cannot be only whitespace' }),
})


export const commentSchema = z.object({
    associated_type: z
      .string({ required_error: 'associated type is required' })
      .min(1, { message: 'associated type is required' })
      .trim(),
    associated_id: z
      .number({ required_error: 'associated ID is required' })
      .min(1, { message: 'associated ID is required' }),
    content: z
      .string({ required_error: 'Comment is required' })
      .min(3, { message: 'Comment is too short' })
      .max(500, { message: 'Comment must be less than 500 characters' })
      .trim()
  });

export const contactSchema = z.object({
  name: z
  .string()
  .min(1, { message: 'Name is too short' })
  .max(64, { message: 'Name must be less than 64 characters' }),
  email: z
  .string()
  .min(1, { message: 'Email is required' })
  .max(64, { message: 'Email must be less than 64 characters' }),
  subject: z
  .string()
  .min(5, { message: 'Subject is too short' })
  .max(64, { message: 'Subject must be less than 64 characters' }),
  message: z
  .string()
  .min(10, { message: 'Message is too short' })
  .max(500, { message: 'Message must be less than 500 characters' }),
});

export const totpSchema = z.object({
  totp_code: z.string().min(6, { message: 'A Valid Token is required' }).max(6, { message: 'The Token is Invalid' }),
});

export const totpSecondarySchema = z.object({
  email: z
  .string()
  .min(1, { message: 'Email is required' })
  .max(64, { message: 'Email must be less than 64 characters' }),
  totp_token: z
  .string()
  .min(1, { message: 'Totp is required' })
})

export const passwordResetSchema = z.object({
  email: z.string().min(5, 'Email must be provided and valid').max(50, 'Email must not exceed 50 characters'),
  totp_code: z.string().max(6, 'The Token is Invalid')
});

export const avatarSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please upload a file.'})
    .refine((f) => f.size < 200_000_000, 'Max 2 MB upload size.')
});

export const avatarUrlSchema = z.object({
  imageUrl: z
  .string()
  .min(1,{message:"image link must be provided"})
})

const investmentTimeLine = [
  {"label": "Short Term", "value": "short"},
  {"label": "Medium Term", "value": "medium"},
  {"label": "Long Term", "value": "long"}
]
const investmentRisk = [
  {"label": "Low risk", "value": "low"},
  {"label": "Moderate", "value": "medium"},
  {"label": "Agveressie", "value": "high"}
]

export const investmentRiskandTimelineSchema = z.object({
  timeline: z.enum(
    investmentTimeLine.map((f) => f.value) // Extract values ['short', 'medium', 'long']
  ).refine((val) => !!val, { message: "Please select a valid timeline." }),

  risk: z.enum(investmentRisk.map((f) => f.value), {
    errorMap: () => ({ message: "Please select a valid risk level." })
  })
});

export const profileSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }).max(64, { message: 'First name must be less than 64 characters' }),
  last_name: z.string().min(1, { message: 'Last name is required' }).max(64, { message: 'Last name must be less than 64 characters' }),
  phone_number: z.string().min(5, 'Phone number must be provided and valid').max(50, 'Phone number must not exceed 50 characters'),
  address: z.string().min(5, 'Address must be provided and valid').max(50, 'Address must not exceed 50 characters'),
  country_code: z.string().min(1, { message: 'Country code is required' }).max(3, { message: 'Country code must be valid' }),
  currency_code: z.string().min(1, { message: 'Currency code is required' }).max(3, { message: 'Currency code must be valid' }),
})