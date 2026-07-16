import { useState, useMemo } from 'react';
import { Wallet, Plus, Search, Pencil, Trash2, Filter, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, monthKey, monthLabel, classNames } from '../lib/utils';
import type { Income } from '../types';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import IncomeFormModal, { IncomeFormValues } from '../components/forms/IncomeFormModal';
import Modal from '../components/ui/Modal';

export default function Income() {
  const finance = useFinance();
  const { profile } = useAuth();
  const currency = profile?.currency ?? 'USD';

  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const months = useMemo(() => {
    const set = new Set<string>();
    finance.incomes.forEach((i) => set.add(monthKey(i.date)));
    return Array.from(set).sort().reverse();
  }, [finance.incomes]);

  const filtered = useMemo(() => {
    return finance.incomes.filter((i) => {
      const matchesSearch = !search ||
        i.source.toLowerCase().includes(search.toLowerCase()) ||
        (i.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesMonth = monthFilter === 'all' || monthKey(i.date) === monthFilter;
      return matchesSearch && matchesMonth;
    });
  }, [finance.incomes, search, monthFilter]);

  const totalFiltered = filtered.reduce((s, i) => s + Number(i.amount), 0);
  const totalAll = finance.incomes.reduce((s, i) => s + Number(i.amount), 0);
  const avgMonthly = months.length > 0 ? totalAll / months.length : 0;

  const handleSubmit = (values: IncomeFormValues) => {
    if (editing) finance.updateIncome(editing.id, values);
    else finance.addIncome(values);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Income Tracker"
        subtitle="Manage and monitor all your income sources"
        icon={<Wallet className="w-5 h-5" />}
        action={<button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary"><Plus className="w-4 h-4" /> Add Income</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Income" value={formatCurrency(totalAll, currency)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <StatCard title="Records" value={String(finance.incomes.length)} icon={<ArrowUpRight className="w-5 h-5" />} accent="info" subtitle="All time" />
        <StatCard title="Avg / Month" value={formatCurrency(avgMonthly, currency)} icon={<ArrowUpRight className="w-5 h-5" />} accent="success" />
      </div>

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search source or description..." className="input-field pl-10 py-2.5" />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="input-field pl-10 appearance-none py-2.5">
              <option value="all">All Months</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Wallet className="w-8 h-8" />}
            title="No income records"
            description="Add your first income source to start tracking"
            action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Income</button>}
          />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{inc.source}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{inc.description ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(inc.date)}</td>
                    <td className="px-4 py-3 text-right font-bold text-success-600 whitespace-nowrap">{formatCurrency(Number(inc.amount), currency)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditing(inc); setModalOpen(true); }} className="btn-ghost p-2 text-slate-400 hover:text-primary-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(inc.id)} className="btn-ghost p-2 text-slate-400 hover:text-error-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                  <td colSpan={3} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Total ({filtered.length} records)</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-success-600">{formatCurrency(totalFiltered, currency)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <IncomeFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing ?? undefined}
        currency={currency}
      />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Income" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete this income record? This action cannot be undone.</p>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (deleteId) finance.deleteIncome(deleteId); setDeleteId(null); }} className="btn-danger flex-1">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
