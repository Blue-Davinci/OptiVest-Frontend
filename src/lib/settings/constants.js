import { 
  PiggyBank,
  TrendingDown,
  ShieldCheck,
  Target,
  Wallet,
  TrendingUp,
  Shuffle,
  Shield
} from 'lucide-svelte';
// Define and export constants
export const TOAST_TYPE_ERROR = 'error';
export const TOAST_TYPE_SUCCESS = 'success';
export const TOAST_TYPE_LOADING = 'loading';
export const TOAST_TYPE_INFO = 'info';
export const TOAST_TYPE_RETRYING = 'retrying';

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

export const BUDGET_TIPS = [
  {
      icon: Wallet,
      title: "Smart Allocation",
      description: "Follow the 50/30/20 rule: 50% for essentials, 30% for personal spending, 20% for financial goals.",
      color: "text-purple-500"
  },
  {
      icon: PiggyBank,
      title: "Emergency Fund",
      description: "Build a safety net of 3-6 months of expenses for unexpected situations.",
      color: "text-purple-400"
  },
  {
      icon: TrendingUp,
      title: "Track & Adjust",
      description: "Review your budget monthly and adjust based on changing needs and goals.",
      color: "text-purple-300"
  }
];

    // Income tips with enhanced icons and descriptions
export const INCOME_TIPS = [
      {
          icon: Shuffle,
          title: "Diversify Income",
          description: "Build multiple income streams to reduce financial risk and increase stability"
      },
      {
          icon: Target,
          title: "Smart Budgeting",
          description: "Track expenses and set clear financial goals for better money management"
      },
      {
          icon: Shield,
          title: "Emergency Fund",
          description: "Save 3-6 months of expenses for unexpected financial challenges"
      },
      {
          icon: PiggyBank,
          title: "Investment Growth",
          description: "Create a balanced investment portfolio for long-term wealth building"
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