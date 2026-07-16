import { supabase } from './supabase';

// Seed a new account with realistic sample financial data so the dashboard,
// charts, and trackers are populated immediately on first login.
export async function seedSampleData(userId: string): Promise<void> {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };
  const monthsAgo = (n: number) => { const d = new Date(today.getFullYear(), today.getMonth() - n, 10); return iso(d); };

  // Incomes — monthly salary + side income across 6 months
  const incomes = [
    { amount: 8500, source: 'Salary', date: monthsAgo(5), description: 'Monthly salary deposit' },
    { amount: 8500, source: 'Salary', date: monthsAgo(4), description: 'Monthly salary deposit' },
    { amount: 8500, source: 'Salary', date: monthsAgo(3), description: 'Monthly salary deposit' },
    { amount: 8500, source: 'Salary', date: monthsAgo(2), description: 'Monthly salary deposit' },
    { amount: 8500, source: 'Salary', date: monthsAgo(1), description: 'Monthly salary deposit' },
    { amount: 8500, source: 'Salary', date: monthsAgo(0), description: 'Monthly salary deposit' },
    { amount: 1200, source: 'Freelance', date: monthsAgo(2), description: 'Web design project' },
    { amount: 800, source: 'Freelance', date: monthsAgo(0), description: 'Logo design gig' },
    { amount: 1500, source: 'Bonus', date: monthsAgo(1), description: 'Quarterly performance bonus' },
    { amount: 300, source: 'Investment', date: monthsAgo(0), description: 'Dividend payout' },
  ];

  // Expenses — realistic spread across categories over recent months
  const expenses = [
    { amount: 1800, category: 'Rent', payment_method: 'Bank Transfer', description: 'Apartment rent', date: monthsAgo(0) },
    { amount: 1800, category: 'Rent', payment_method: 'Bank Transfer', description: 'Apartment rent', date: monthsAgo(1) },
    { amount: 1800, category: 'Rent', payment_method: 'Bank Transfer', description: 'Apartment rent', date: monthsAgo(2) },
    { amount: 420, category: 'Food', payment_method: 'Credit Card', description: 'Groceries at Whole Foods', date: daysAgo(2) },
    { amount: 85, category: 'Food', payment_method: 'Credit Card', description: 'Dinner with friends', date: daysAgo(5) },
    { amount: 230, category: 'Shopping', payment_method: 'Credit Card', description: 'New running shoes', date: daysAgo(8) },
    { amount: 145, category: 'Travel', payment_method: 'Debit Card', description: 'Weekend train tickets', date: daysAgo(12) },
    { amount: 199, category: 'Education', payment_method: 'Credit Card', description: 'Online course subscription', date: daysAgo(15) },
    { amount: 320, category: 'Healthcare', payment_method: 'Debit Card', description: 'Dental checkup', date: daysAgo(20) },
    { amount: 180, category: 'Bills', payment_method: 'Bank Transfer', description: 'Electricity & internet', date: daysAgo(3) },
    { amount: 60, category: 'Entertainment', payment_method: 'Credit Card', description: 'Concert tickets', date: daysAgo(18) },
    { amount: 750, category: 'Investment', payment_method: 'Bank Transfer', description: 'Monthly index fund SIP', date: daysAgo(7) },
    { amount: 95, category: 'Food', payment_method: 'Cash', description: 'Lunch out', date: daysAgo(1) },
    { amount: 110, category: 'Bills', payment_method: 'Bank Transfer', description: 'Phone bill', date: daysAgo(10) },
  ];

  // Habits
  const habits = [
    { name: 'Save $20 Daily', frequency: 'Daily', target: '$600/month', reminder_time: '09:00', status: 'active' },
    { name: 'Track Every Expense', frequency: 'Daily', target: 'Log all spending', reminder_time: '20:00', status: 'active' },
    { name: 'Invest Monthly', frequency: 'Monthly', target: '$750 into index fund', reminder_time: '10:00', status: 'active' },
    { name: 'Review Budget Weekly', frequency: 'Weekly', target: 'Every Sunday', reminder_time: '18:00', status: 'active' },
  ];

  // Habit completion logs — last 14 days for the first two habits
  const habitLogs: { habit_id: string; completed_date: string }[] = [];

  // Goals
  const goals = [
    { name: 'Emergency Fund', target_amount: 15000, current_amount: 9200, deadline: iso(new Date(today.getFullYear() + 1, today.getMonth(), 15)), priority: 'high' },
    { name: 'Vacation to Japan', target_amount: 6000, current_amount: 4650, deadline: iso(new Date(today.getFullYear(), today.getMonth() + 4, 1)), priority: 'medium' },
    { name: 'New Laptop', target_amount: 2500, current_amount: 1200, deadline: iso(new Date(today.getFullYear(), today.getMonth() + 2, 1)), priority: 'low' },
  ];

  // Investments
  const investments = [
    { name: 'S&P 500 ETF', type: 'ETF', amount_invested: 18000, current_value: 21450, date: monthsAgo(8) },
    { name: 'Tech Mutual Fund', type: 'Mutual Funds', amount_invested: 7500, current_value: 8120, date: monthsAgo(6) },
    { name: 'Bitcoin', type: 'Crypto', amount_invested: 2000, current_value: 3180, date: monthsAgo(12) },
  ];

  // Assets & liabilities
  const assets = [
    { name: 'Savings Account', kind: 'asset', type: 'Cash', value: 12500 },
    { name: 'Car', kind: 'asset', type: 'Vehicle', value: 18500 },
    { name: 'Student Loan', kind: 'liability', type: 'Loan', value: 9200 },
    { name: 'Credit Card Balance', kind: 'liability', type: 'Credit Card', value: 1450 },
  ];

  try {
    // Incomes
    await supabase.from('incomes').insert(incomes.map((i) => ({ ...i, user_id: userId })));
    // Expenses
    await supabase.from('expenses').insert(expenses.map((e) => ({ ...e, user_id: userId })));
    // Habits
    const { data: habitRows } = await supabase.from('habits').insert(habits.map((h) => ({ ...h, user_id: userId }))).select('id');
    if (habitRows) {
      // Build completion logs for last 14 days — habit 0 & 1 mostly completed, habit 2 skipped
      for (let d = 13; d >= 0; d--) {
        const date = daysAgo(d);
        if (habitRows[0]) habitLogs.push({ habit_id: habitRows[0].id, completed_date: date });
        if (habitRows[1] && d % 3 !== 0) habitLogs.push({ habit_id: habitRows[1].id, completed_date: date });
      }
      if (habitLogs.length) await supabase.from('habit_logs').insert(habitLogs.map((l) => ({ ...l, user_id: userId })));
    }
    // Goals
    const { data: goalRows } = await supabase.from('goals').insert(goals.map((g) => ({ ...g, user_id: userId }))).select('id');
    if (goalRows) {
      const contribs: { goal_id: string; amount: number; date: string }[] = [];
      goalRows.forEach((g, idx) => {
        const amounts = [[2000, 1500, 1200, 1800, 1500, 1200], [1000, 800, 600, 750, 800, 700], [300, 200, 250, 200, 150, 100]][idx] ?? [500];
        const dates = [monthsAgo(5), monthsAgo(4), monthsAgo(3), monthsAgo(2), monthsAgo(1), monthsAgo(0)];
        amounts.forEach((amt, i) => contribs.push({ goal_id: g.id, amount: amt, date: dates[i] ?? monthsAgo(0) }));
      });
      if (contribs.length) await supabase.from('goal_contributions').insert(contribs.map((c) => ({ ...c, user_id: userId })));
    }
    // Investments
    await supabase.from('investments').insert(investments.map((i) => ({ ...i, user_id: userId })));
    // Assets
    await supabase.from('assets').insert(assets.map((a) => ({ ...a, user_id: userId })));
  } catch (err) {
    console.error('Seed data error (non-fatal):', err);
  }
}
