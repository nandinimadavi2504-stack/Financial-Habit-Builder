import { useState, useMemo } from 'react';
import {
  TrendingDown, Plus, Search, Pencil, Trash2, Filter, PieChart as PieIcon, BarChart3,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatCompact, formatDate, monthKey, monthLabel, classNames } from '../lib/utils';
import { EXPENSE_CATEGORIES, ExpenseCategory, Expense } from '../types';
import { expenseCategoryData, monthlyExpenseData } from '../lib/analytics';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import ChartTooltip from '../components/ui/ChartTooltip';
import ExpenseFormModal, { ExpenseFormValues } from '../components/forms/ExpenseFormModal';
import Modal from '../components/ui/Modal';
import { Badge } from '../components/ui/ProgressBar';

const categoryColors: Record<string, string> = {
  Food: 'success', Rent: 'info', Shopping: 'warning', Travel: 'secondary',
  Education: 'primary', Healthcare: 'error', Bills: 'secondary', Entertainment: 'warning',
  Investment: 'primary', Others: 'slate',
};

export default function Expenses() {
  const finance = useFinance();
  const { profile } = useAuth();
  const currency = profile?.currency ?? 'USD';

  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const months = useMemo(() => {
    const set = new Set<string>();
    finance.expenses.forEach((e) => set.add(monthKey(e.date)));
    return Array.from(set).sort().reverse();
  }, [finance.expenses]);

  const filtered = useMemo(() => {
    return finance.expenses.filter((e) => {
      const matchesSearch = !search ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesMonth = monthFilter === 'all' || monthKey(e.date) === monthFilter;
      const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
      return matchesSearch && matchesMonth && matchesCat;
    });
  }, [finance.expenses, search, monthFilter, categoryFilter]);

  const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const totalAll = finance.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const avgPerRecord = filtered.length > 0 ? totalFiltered / filtered.length : 0;

  const categoryData = useMemo(() => expenseCategoryData(filtered), [filtered]);
  const monthlyData = useMemo(() => monthlyExpenseData(finance.expenses), [finance.expenses]);

  const handleSubmit = (values: ExpenseFormValues) => {
    if (editing) finance.updateExpense(editing.id, values);
    else finance.addExpense(values);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Expense Tracker"
        subtitle="Track where your money goes"
        icon={<TrendingDown className="w-5 h-5" />}
        action={<button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add Expense</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Expenses" value={formatCurrency(totalAll, currency)} icon={<TrendingDown className="w-5 h-5" />} accent="error" />
        <StatCard title="Records" value={String(finance.expenses.length)} icon={<BarChart3 className="w-5 h-5" />} accent="info" subtitle="All time" />
        <StatCard title="Avg / Record" value={formatCurrency(avgPerRecord, currency)} icon={<PieIcon className="w-5 h-5" />} accent="warning" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">Expense by Category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Current filter breakdown</p>
          {categoryData.length === 0 ? (
            <EmptyState icon={<PieIcon className="w-8 h-8" />} title="No data" description="Add expenses to see breakdown" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(e) => e.name} labelLine={false}>
                  {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">Monthly Report</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(Number(v), currency)} />
              <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v, currency)} />} cursor={{ fill: 'rgb(148 163 184 / 0.1)' }} />
              <Bar dataKey="amount" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search category or description..." className="input-field pl-10 py-2.5" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field appearance-none py-2.5 sm:w-44">
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="input-field appearance-none py-2.5 sm:w-40">
            <option value="all">All Months</option>
            {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<TrendingDown className="w-8 h-8" />}
            title="No expense records"
            description="Add your first expense to start tracking"
            action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Expense</button>}
          />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3"><Badge color={categoryColors[exp.category] as 'success'}>{exp.category}</Badge></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{exp.payment_method ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{exp.description ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td className="px-4 py-3 text-right font-bold text-error-500 whitespace-nowrap">{formatCurrency(Number(exp.amount), currency)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditing(exp); setModalOpen(true); }} className="btn-ghost p-2 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(exp.id)} className="btn-ghost p-2 text-slate-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                  <td colSpan={4} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Total ({filtered.length} records)</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-error-500">{formatCurrency(totalFiltered, currency)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing ?? undefined}
        currency={currency}
      />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete this expense record? This action cannot be undone.</p>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (deleteId) finance.deleteExpense(deleteId); setDeleteId(null); }} className="btn-danger flex-1">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
