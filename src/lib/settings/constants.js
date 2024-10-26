import { 
  PiggyBank,
  TrendingDown,
  ShieldCheck,
  Target
} from 'lucide-svelte';
// Define and export constants
export const TOAST_TYPE_ERROR = 'error';
export const TOAST_TYPE_SUCCESS = 'success';
export const TOAST_TYPE_LOADING = 'loading';
export const TOAST_TYPE_INFO = 'info';

 // Financial Tips Array
export const financialTips = [
  {
      icon: PiggyBank,
      title: 'Budget Wisely',
      description: 'Try to allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
      color: 'purple'
  },
  {
      icon: TrendingDown,
      title: 'Reduce Recurring Costs',
      description: 'Review your subscriptions regularly and cancel unused services to save money monthly.',
      color: 'blue'
  },
  {
      icon: ShieldCheck,
      title: 'Set Financial Goals',
      description: 'Define clear, measurable financial goals and track your progress regularly.',
      color: 'green'
  },
  {
      icon: Target,
      title: 'Set Financial Goals',
      description: 'Define clear, measurable financial goals and track your progress regularly.',
      color: 'orange'
  }
];

export const DELETE_BUDGET_CONFIRMATION_MESSAGE = `
  <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin: 0;">
    Are you sure you want to delete this budget?
  </p>
  <p style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; margin: 10px 0 0;">
    <span style="color: red; font-weight: bold;">
      Deleting this budget will remove all associated goals, including both recurring and normal expenses.
    </span>
  </p>
`