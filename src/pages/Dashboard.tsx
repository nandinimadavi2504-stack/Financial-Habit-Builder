import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Wallet, TrendingDown, PiggyBank, Diamond, Percent, Repeat, Target, LineChart as LineIcon,
  Plus, ArrowUpRight, ArrowDownRight, Repeat as RepeatIcon, Trophy, TrendingUp,
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { computeStats, incomeVsExpenseData, monthlyExpenseData, expenseCategoryData, netWorthGrowthData, recentActivity } from '../lib/analytics';
import { formatCurrency, formatCompact, formatPercent, formatDateShort, classNames } from '../lib/utils';
import StatCard from '../components/ui/StatCard';
import ChartTooltip from '../components/ui/ChartTooltip';
import EmptyState from '../components/ui/EmptyState';
import IncomeFormModal from '../components/forms/IncomeFormModal';
import ExpenseFormModal from '../components/forms/ExpenseFormModal';
import HabitFormModal from '../components/forms/HabitFormModal';
import GoalFormModal from '../components/forms/GoalFormModal';

export default function Dashboard() {
  const finance = useFinance();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const currency = profile?.currency ?? 'USD';

  const [modal, setModal] = useState<null | 'income' | 'expense' | 'habit' | 'goal'>(null);

  const stats = useMemo(
    () => computeStats(finance.incomes, finance.expenses, finance.habits, finance.habitLogs, finance.goals, finance.investments, finance.assets),
    [finance],
  );
  const incVsExp = useMemo(() => incomeVsExpenseData(finance.incomes, finance.expenses), [finance.incomes, finance.expenses]);
  const monthlyExp = useMemo(() => monthlyExpenseData(finance.expenses), [finance.expenses]);
  const categoryData = useMemo(() => expenseCategoryData(finance.expenses), [finance.expenses]);
  const netWorthData = useMemo(() => netWorthGrowthData(finance.incomes, finance.expenses, finance.investments, finance.assets), [finance.incomes, finance.expenses, finance.investments, finance.assets]);
  const activity = useMemo(() => recentActivity(finance.incomes, finance.expenses, finance.habits, finance.goals, finance.investments), [finance]);

  if (finance.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const quickActions = [
    { label: 'Add Income', icon: Plus, color: 'primary', action: () => setModal('income') },
    { label: 'Add Expense', icon: TrendingDown, color: 'error', action: () => setModal('expense') },
    { label: 'Add Habit', icon: RepeatIcon, color: 'secondary', action: () => setModal('habit') },
    { label: 'Add Goal', icon: Target, color: 'accent', action: () => setModal('goal') },
  ] as const;

  const activityIcons = {
    income: { icon: ArrowUpRight, color: 'text-success-600 bg-success-100 dark:bg-success-500/15' },
    expense: { icon: ArrowDownRight, color: 'text-error-600 bg-error-100 dark:bg-error-500/15' },
    habit: { icon: Repeat, color: 'text-secondary-600 bg-secondary-100 dark:bg-secondary-500/15' },
    goal: { icon: Target, color: 'text-accent-600 bg-accent-100 dark:bg-accent-500/15' },
    investment: { icon: TrendingUp, color: 'text-info-600 bg-info-100 dark:bg-info-500/15' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's your financial overview for today</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={formatCurrency(stats.totalIncome, currency)} icon={<Wallet className="w-5 h-5" />} accent="primary" subtitle="All time" />
        <StatCard title="Total Expenses" value={formatCurrency(stats.totalExpenses, currency)} icon={<TrendingDown className="w-5 h-5" />} accent="error" subtitle="All time" />
        <StatCard title="Total Savings" value={formatCurrency(stats.totalSavings, currency)} icon={<PiggyBank className="w-5 h-5" />} accent="success" subtitle="Income - Expenses" />
        <StatCard title="Net Worth" value={formatCurrency(stats.netWorth, currency)} icon={<Diamond className="w-5 h-5" />} accent="info" subtitle="Savings + Inv + Assets - Liab" />
        <StatCard title="Savings Rate" value={formatPercent(stats.savingsRate)} icon={<Percent className="w-5 h-5" />} accent="secondary" subtitle="Of total income" />
        <StatCard title="Habit Streak" value={`${stats.habitStreak} days`} icon={<Repeat className="w-5 h-5" />} accent="accent" subtitle="Best current streak" />
        <StatCard title="Goal Progress" value={formatPercent(stats.goalProgress, 0)} icon={<Target className="w-5 h-5" />} accent="warning" subtitle="Avg across goals" />
        <StatCard title="Investment Value" value={formatCurrency(stats.investmentValue, currency)} icon={<LineIcon className="w-5 h-5" />} accent="primary" subtitle="Current value" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={a.action}
            className={classNames(
              'card p-4 flex items-center gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group text-left',
            )}
          >
            <div className={classNames('p-2.5 rounded-xl', `bg-${a.color}-50 text-${a.color}-600 dark:bg-${a.color}-500/10 dark:text-${a.color}-400`)}>
              <a.icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-white">Income vs Expense</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={incVsExp} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} cursor={{ fill: 'rgb(148 163 184 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-white">Monthly Expenses</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trend over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyExp}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
              <Line type="monotone" dataKey="amount" name="Expenses" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-white">Expense Categories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All-time breakdown</p>
            </div>
          </div>
          {categoryData.length === 0 ? (
            <EmptyState icon={<PieChart />} title="No expenses yet" description="Add expenses to see category breakdown" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-white">Net Worth Growth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={netWorthData}>
              <defs>
                <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
              <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#10b981" strokeWidth={3} fill="url(#nwGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-slate-800 dark:text-white">Recent Activity</h3>
          <button onClick={() => navigate('/income')} className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</button>
        </div>
        {activity.length === 0 ? (
          <EmptyState icon={<Trophy />} title="No activity yet" description="Start by adding income, expenses, habits, or goals" />
        ) : (
          <div className="space-y-1">
            {activity.map((item) => {
              const cfg = activityIcons[item.type];
              return (
                <div key={item.id} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={classNames('p-2 rounded-lg', cfg.color)}>
                    <cfg.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.subtitle}</p>
                  </div>
                  {item.amount !== undefined && (
                    <span className={classNames('text-sm font-bold', item.type === 'income' ? 'text-success-600' : item.type === 'expense' ? 'text-error-500' : 'text-slate-700 dark:text-slate-200')}>
                      {item.type === 'income' ? '+' : item.type === 'expense' ? '-' : ''}{formatCurrency(item.amount, currency)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{formatDateShort(item.date)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <IncomeFormModal open={modal === 'income'} onClose={() => setModal(null)} onSubmit={(d) => { finance.addIncome(d); setModal(null); }} currency={currency} />
      <ExpenseFormModal open={modal === 'expense'} onClose={() => setModal(null)} onSubmit={(d) => { finance.addExpense(d); setModal(null); }} currency={currency} />
      <HabitFormModal open={modal === 'habit'} onClose={() => setModal(null)} onSubmit={(d) => { finance.addHabit(d); setModal(null); }} />
      <GoalFormModal open={modal === 'goal'} onClose={() => setModal(null)} onSubmit={(d) => { finance.addGoal(d); setModal(null); }} currency={currency} />
    </div>
  );
}
