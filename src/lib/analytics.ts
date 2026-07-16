import { Income, Expense, Habit, HabitLog, Goal, Investment, Asset } from '../types';
import { monthKey, monthLabel } from './utils';

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  investmentValue: number;
  netWorth: number;
  habitStreak: number;
  goalProgress: number;
}

export function computeStats(
  incomes: Income[],
  expenses: Expense[],
  habits: Habit[],
  habitLogs: HabitLog[],
  goals: Goal[],
  investments: Investment[],
  assets: Asset[],
): FinanceStats {
  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const investmentValue = investments.reduce((s, i) => s + Number(i.current_value), 0);
  const assetValue = assets.filter((a) => a.kind === 'asset').reduce((s, a) => s + Number(a.value), 0);
  const liabilityValue = assets.filter((a) => a.kind === 'liability').reduce((s, a) => s + Number(a.value), 0);
  const netWorth = totalSavings + investmentValue + assetValue - liabilityValue;
  const habitStreak = computeBestStreak(habits, habitLogs);
  const goalProgress = goals.length > 0
    ? goals.reduce((s, g) => s + Math.min(100, (Number(g.current_amount) / Number(g.target_amount)) * 100), 0) / goals.length
    : 0;

  return { totalIncome, totalExpenses, totalSavings, savingsRate, investmentValue, netWorth, habitStreak, goalProgress };
}

export function computeBestStreak(habits: Habit[], logs: HabitLog[]): number {
  if (habits.length === 0) return 0;
  let best = 0;
  for (const habit of habits) {
    const dates = logs
      .filter((l) => l.habit_id === habit.id)
      .map((l) => l.completed_date)
      .sort();
    if (dates.length === 0) continue;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) current++;
      else current = 1;
      best = Math.max(best, current);
    }
    best = Math.max(best, current);
  }
  return best;
}

export function habitCurrentStreak(habitId: string, logs: HabitLog[]): number {
  const dates = logs
    .filter((l) => l.habit_id === habitId)
    .map((l) => new Date(l.completed_date).getTime())
    .sort((a, b) => b - a);
  if (dates.length === 0) return 0;
  let streak = 0;
  let cursor = new Date().setHours(0, 0, 0, 0);
  for (const d of dates) {
    const day = new Date(d).setHours(0, 0, 0, 0);
    if (day === cursor) {
      streak++;
      cursor -= 86400000;
    } else if (day < cursor) {
      break;
    }
  }
  return streak;
}

export function incomeVsExpenseData(incomes: Income[], expenses: Expense[], months = 6) {
  const map = new Map<string, { month: string; income: number; expense: number }>();
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    map.set(key, { month: monthLabel(key), income: 0, expense: 0 });
  }
  for (const inc of incomes) {
    const key = monthKey(inc.date);
    if (map.has(key)) map.get(key)!.income += Number(inc.amount);
  }
  for (const exp of expenses) {
    const key = monthKey(exp.date);
    if (map.has(key)) map.get(key)!.expense += Number(exp.amount);
  }
  return Array.from(map.values());
}

export function monthlyExpenseData(expenses: Expense[], months = 6) {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    map.set(monthKey(d), 0);
  }
  for (const exp of expenses) {
    const key = monthKey(exp.date);
    if (map.has(key)) map.set(key, map.get(key)! + Number(exp.amount));
  }
  return Array.from(map.entries()).map(([k, v]) => ({ month: monthLabel(k), amount: v }));
}

export function expenseCategoryData(expenses: Expense[]) {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount));
  const colors: Record<string, string> = {
    Food: '#10b981', Rent: '#3b82f6', Shopping: '#f59e0b', Travel: '#8b5cf6',
    Education: '#ec4899', Healthcare: '#ef4444', Bills: '#14b8a6',
    Entertainment: '#f97316', Investment: '#06b6d4', Others: '#64748b',
  };
  return Array.from(map.entries()).map(([name, value]) => ({ name, value, color: colors[name] ?? '#64748b' }));
}

export function netWorthGrowthData(incomes: Expense[] | Income[], expenses: Expense[], investments: Investment[], assets: Asset[], months = 6) {
  const incByMonth = new Map<string, number>();
  const expByMonth = new Map<string, number>();
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    incByMonth.set(key, 0);
    expByMonth.set(key, 0);
  }
  for (const inc of incomes as Income[]) {
    const key = monthKey(inc.date);
    if (incByMonth.has(key)) incByMonth.set(key, incByMonth.get(key)! + Number(inc.amount));
  }
  for (const exp of expenses) {
    const key = monthKey(exp.date);
    if (expByMonth.has(key)) expByMonth.set(key, expByMonth.get(key)! + Number(exp.amount));
  }
  const invValue = investments.reduce((s, i) => s + Number(i.current_value), 0);
  const assetVal = assets.filter((a) => a.kind === 'asset').reduce((s, a) => s + Number(a.value), 0);
  const liabVal = assets.filter((a) => a.kind === 'liability').reduce((s, a) => s + Number(a.value), 0);

  let cumulative = 0;
  return Array.from(incByMonth.keys()).map((key) => {
    const savings = (incByMonth.get(key) ?? 0) - (expByMonth.get(key) ?? 0);
    cumulative += savings;
    return {
      month: monthLabel(key),
      netWorth: cumulative + invValue + assetVal - liabVal,
      savings,
    };
  });
}

export interface ActivityItem {
  id: string;
  type: 'income' | 'expense' | 'habit' | 'goal' | 'investment';
  title: string;
  subtitle: string;
  amount?: number;
  date: string;
}

export function recentActivity(incomes: Income[], expenses: Expense[], habits: Habit[], goals: Goal[], investments: Investment[]): ActivityItem[] {
  const items: ActivityItem[] = [];
  for (const i of incomes.slice(0, 5)) items.push({ id: `inc-${i.id}`, type: 'income', title: i.source, subtitle: i.description ?? 'Income', amount: Number(i.amount), date: i.date });
  for (const e of expenses.slice(0, 5)) items.push({ id: `exp-${e.id}`, type: 'expense', title: e.category, subtitle: e.description ?? e.payment_method ?? 'Expense', amount: Number(e.amount), date: e.date });
  for (const h of habits.slice(0, 3)) items.push({ id: `hab-${h.id}`, type: 'habit', title: h.name, subtitle: `${h.frequency} habit`, date: h.created_at });
  for (const g of goals.slice(0, 3)) items.push({ id: `goal-${g.id}`, type: 'goal', title: g.name, subtitle: `${Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100)}% funded`, date: g.created_at });
  for (const inv of investments.slice(0, 3)) items.push({ id: `inv-${inv.id}`, type: 'investment', title: inv.name, subtitle: inv.type ?? 'Investment', amount: Number(inv.current_value), date: inv.date });
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
}
