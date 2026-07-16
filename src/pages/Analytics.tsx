import { useState, useMemo } from 'react';
import {
  TrendingUp, Plus, Trash2, LineChart as LineIcon, AreaChart, Diamond, PiggyBank,
  Percent, Wallet, TrendingDown, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatCompact, formatPercent, classNames } from '../lib/utils';
import { computeStats, incomeVsExpenseData, netWorthGrowthData } from '../lib/analytics';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ChartTooltip from '../components/ui/ChartTooltip';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

export default function Analytics() {
  const finance = useFinance();
  const { profile } = useAuth();
  const currency = profile?.currency ?? 'USD';

  const [addInvOpen, setAddInvOpen] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [invForm, setInvForm] = useState({ name: '', type: 'Stocks', amount_invested: '', current_value: '' });
  const [assetForm, setAssetForm] = useState({ name: '', kind: 'asset' as 'asset' | 'liability', type: 'Cash', value: '' });

  const stats = useMemo(
    () => computeStats(finance.incomes, finance.expenses, finance.habits, finance.habitLogs, finance.goals, finance.investments, finance.assets),
    [finance],
  );
  const incVsExp = useMemo(() => incomeVsExpenseData(finance.incomes, finance.expenses, 12), [finance.incomes, finance.expenses]);
  const netWorthData = useMemo(() => netWorthGrowthData(finance.incomes, finance.expenses, finance.investments, finance.assets, 12), [finance]);

  const assetValue = finance.assets.filter((a) => a.kind === 'asset').reduce((s, a) => s + Number(a.value), 0);
  const liabValue = finance.assets.filter((a) => a.kind === 'liability').reduce((s, a) => s + Number(a.value), 0);

  // Monthly growth %
  const lastMonth = netWorthData[netWorthData.length - 1];
  const prevMonth = netWorthData[netWorthData.length - 2];
  const monthlyGrowth = lastMonth && prevMonth && prevMonth.netWorth > 0
    ? ((lastMonth.netWorth - prevMonth.netWorth) / Math.abs(prevMonth.netWorth)) * 100
    : 0;

  const summary = [
    { label: 'Total Income', value: formatCurrency(stats.totalIncome, currency), icon: Wallet, color: 'primary' },
    { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses, currency), icon: TrendingDown, color: 'error' },
    { label: 'Total Savings', value: formatCurrency(stats.totalSavings, currency), icon: PiggyBank, color: 'success' },
    { label: 'Investments', value: formatCurrency(stats.investmentValue, currency), icon: TrendingUp, color: 'info' },
    { label: 'Assets', value: formatCurrency(assetValue, currency), icon: Diamond, color: 'secondary' },
    { label: 'Liabilities', value: formatCurrency(liabValue, currency), icon: TrendingDown, color: 'warning' },
    { label: 'Savings Rate', value: formatPercent(stats.savingsRate), icon: Percent, color: 'primary' },
    { label: 'Net Worth', value: formatCurrency(stats.netWorth, currency), icon: Diamond, color: 'success' },
  ] as const;

  const handleAddInv = () => {
    if (!invForm.name || !invForm.current_value) return;
    finance.addInvestment({
      name: invForm.name,
      type: invForm.type,
      amount_invested: Number(invForm.amount_invested) || 0,
      current_value: Number(invForm.current_value),
      date: new Date().toISOString().slice(0, 10),
    });
    setInvForm({ name: '', type: 'Stocks', amount_invested: '', current_value: '' });
    setAddInvOpen(false);
  };

  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.value) return;
    finance.addAsset({ name: assetForm.name, kind: assetForm.kind, type: assetForm.type, value: Number(assetForm.value) });
    setAssetForm({ name: '', kind: 'asset', type: 'Cash', value: '' });
    setAddAssetOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Wealth Analytics"
        subtitle="Understand your financial trajectory"
        icon={<TrendingUp className="w-5 h-5" />}
        action={
          <div className="flex gap-2">
            <button onClick={() => setAddInvOpen(true)} className="btn-secondary"><Plus className="w-4 h-4" /> Investment</button>
            <button onClick={() => setAddAssetOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Asset/Liability</button>
          </div>
        }
      />

      {/* Net worth hero */}
      <div className="card p-6 mb-6 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-primary-50 text-sm font-medium">Your Net Worth</p>
          <p className="text-4xl font-bold font-display mt-1">{formatCurrency(stats.netWorth, currency)}</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20"><Percent className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-primary-50">Monthly Growth</p>
                <p className="font-bold">{monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20"><PiggyBank className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-primary-50">Savings Rate</p>
                <p className="font-bold">{formatPercent(stats.savingsRate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20"><Diamond className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-primary-50">Investments</p>
                <p className="font-bold">{formatCurrency(stats.investmentValue, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map((s) => (
          <StatCard key={s.label} title={s.label} value={s.value} icon={<s.icon className="w-5 h-5" />} accent={s.color as 'primary'} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">Wealth Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Net worth over 12 months</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={netWorthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
              <Line type="monotone" dataKey="netWorth" name="Net Worth" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">Savings Flow</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Monthly savings over 12 months</p>
          <ResponsiveContainer width="100%" height={300}>
            <ReAreaChart data={netWorthData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
              <Area type="monotone" dataKey="savings" name="Monthly Savings" stroke="#3b82f6" strokeWidth={3} fill="url(#savingsGrad)" />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Expense 12mo */}
      <div className="card p-5 mb-6">
        <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">Income vs Expense — 12 Months</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Full year comparison</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incVsExp}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
            <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Investments + Assets tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-4">Investments</h3>
          {finance.investments.length === 0 ? (
            <EmptyState icon={<TrendingUp className="w-8 h-8" />} title="No investments" description="Add your investment holdings" />
          ) : (
            <div className="space-y-2">
              {finance.investments.map((inv) => {
                const gain = Number(inv.current_value) - Number(inv.amount_invested);
                const gainPct = inv.amount_invested > 0 ? (gain / Number(inv.amount_invested)) * 100 : 0;
                return (
                  <div key={inv.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{inv.name}</p>
                      <p className="text-xs text-slate-400">{inv.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(Number(inv.current_value), currency)}</p>
                      <p className={classNames('text-xs font-semibold flex items-center gap-0.5 justify-end', gain >= 0 ? 'text-success-600' : 'text-error-500')}>
                        {gain >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
                      </p>
                    </div>
                    <button onClick={() => finance.deleteInvestment(inv.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-4">Assets & Liabilities</h3>
          {finance.assets.length === 0 ? (
            <EmptyState icon={<Diamond className="w-8 h-8" />} title="No assets or liabilities" description="Add what you own and owe" />
          ) : (
            <div className="space-y-2">
              {finance.assets.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{a.name}</p>
                    <p className="text-xs text-slate-400">{a.type} • {a.kind}</p>
                  </div>
                  <span className={classNames('font-bold', a.kind === 'asset' ? 'text-success-600' : 'text-error-500')}>
                    {a.kind === 'asset' ? '+' : '-'}{formatCurrency(Number(a.value), currency)}
                  </span>
                  <button onClick={() => finance.deleteAsset(a.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Investment Modal */}
      <Modal open={addInvOpen} onClose={() => setAddInvOpen(false)} title="Add Investment">
        <div className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input value={invForm.name} onChange={(e) => setInvForm({ ...invForm, name: e.target.value })} placeholder="e.g. S&P 500 ETF" className="input-field" autoFocus />
          </div>
          <div>
            <label className="label-field">Type</label>
            <select value={invForm.type} onChange={(e) => setInvForm({ ...invForm, type: e.target.value })} className="input-field appearance-none">
              {['Stocks', 'Mutual Funds', 'ETF', 'Real Estate', 'Crypto', 'Bonds', 'Gold', 'Other'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Amount Invested ({currency})</label>
              <input type="number" min="0" step="0.01" value={invForm.amount_invested} onChange={(e) => setInvForm({ ...invForm, amount_invested: e.target.value })} placeholder="0.00" className="input-field" />
            </div>
            <div>
              <label className="label-field">Current Value ({currency})</label>
              <input type="number" min="0" step="0.01" value={invForm.current_value} onChange={(e) => setInvForm({ ...invForm, current_value: e.target.value })} placeholder="0.00" className="input-field" />
            </div>
          </div>
          <button onClick={handleAddInv} className="btn-primary w-full">Add Investment</button>
        </div>
      </Modal>

      {/* Add Asset Modal */}
      <Modal open={addAssetOpen} onClose={() => setAddAssetOpen(false)} title="Add Asset or Liability">
        <div className="space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} placeholder="e.g. Car / Credit Card Debt" className="input-field" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Kind</label>
              <select value={assetForm.kind} onChange={(e) => setAssetForm({ ...assetForm, kind: e.target.value as 'asset' | 'liability' })} className="input-field appearance-none">
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
              </select>
            </div>
            <div>
              <label className="label-field">Type</label>
              <select value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })} className="input-field appearance-none">
                {['Cash', 'Property', 'Vehicle', 'Jewelry', 'Loan', 'Credit Card', 'Mortgage', 'Other'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Value ({currency})</label>
            <input type="number" min="0" step="0.01" value={assetForm.value} onChange={(e) => setAssetForm({ ...assetForm, value: e.target.value })} placeholder="0.00" className="input-field" />
          </div>
          <button onClick={handleAddAsset} className="btn-primary w-full">Add</button>
        </div>
      </Modal>
    </div>
  );
}
