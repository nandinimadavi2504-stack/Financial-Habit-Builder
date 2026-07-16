export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD' | 'CAD' | 'CNY';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  occupation: string | null;
  monthly_income: number;
  currency: Currency | string;
  country: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  date: string;
  description: string | null;
  created_at: string;
}

export type ExpenseCategory =
  | 'Food' | 'Rent' | 'Shopping' | 'Travel' | 'Education'
  | 'Healthcare' | 'Bills' | 'Entertainment' | 'Investment' | 'Others';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  payment_method: string | null;
  description: string | null;
  date: string;
  created_at: string;
}

export type HabitFrequency = 'Daily' | 'Weekly' | 'Monthly';
export type HabitStatus = 'active' | 'paused' | 'completed';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  frequency: HabitFrequency;
  target: string | null;
  reminder_time: string | null;
  status: HabitStatus;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  type: string | null;
  amount_invested: number;
  current_value: number;
  date: string;
  created_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  kind: 'asset' | 'liability';
  type: string | null;
  value: number;
  created_at: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food', 'Rent', 'Shopping', 'Travel', 'Education',
  'Healthcare', 'Bills', 'Entertainment', 'Investment', 'Others',
];

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$', CNY: '¥',
};

export function currencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}
