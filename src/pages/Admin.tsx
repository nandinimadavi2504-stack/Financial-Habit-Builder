import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield, Users, Search, Trash2, Download, Wallet, TrendingDown, Repeat, Target,
  Loader2, Mail, Briefcase, Globe, UserCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Profile } from '../types';
import { formatDate } from '../lib/utils';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import { Badge } from '../components/ui/ProgressBar';

interface AdminStats {
  totalUsers: number;
  totalIncomes: number;
  totalExpenses: number;
  totalHabits: number;
  totalGoals: number;
}

export default function Admin() {
  const { profile } = useAuth();
  const { notify } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalIncomes: 0, totalExpenses: 0, totalHabits: 0, totalGoals: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [profiles, inc, exp, hab, goa] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('incomes').select('id', { count: 'exact', head: true }),
      supabase.from('expenses').select('id', { count: 'exact', head: true }),
      supabase.from('habits').select('id', { count: 'exact', head: true }),
      supabase.from('goals').select('id', { count: 'exact', head: true }),
    ]);
    if (profiles.data) setUsers(profiles.data as Profile[]);
    setStats({
      totalUsers: profiles.data?.length ?? 0,
      totalIncomes: inc.count ?? 0,
      totalExpenses: exp.count ?? 0,
      totalHabits: hab.count ?? 0,
      totalGoals: goa.count ?? 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      u.full_name.toLowerCase().includes(q) ||
      (u.occupation ?? '').toLowerCase().includes(q) ||
      (u.country ?? '').toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    // Profiles cascade-delete related rows via FK ON DELETE CASCADE,
    // but the auth.users row must be removed to fully delete the account.
    // We remove the profile row; admin_delete_profile policy allows it.
    // Note: auth.users deletion requires service-role; here we remove the profile.
    const { error } = await supabase.from('profiles').delete().eq('id', deleteId);
    setDeleting(false);
    if (error) { notify(error.message, 'error'); return; }
    notify('User profile deleted');
    setDeleteId(null);
    load();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Occupation', 'Country', 'Currency', 'Monthly Income', 'Admin', 'Joined'];
    const rows = filtered.map((u) => [
      `"${u.full_name}"`,
      `"${u.occupation ?? ''}"`,
      `"${u.country ?? ''}"`,
      u.currency,
      u.monthly_income,
      u.is_admin ? 'Yes' : 'No',
      formatDate(u.created_at),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wealthwise-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify('CSV exported');
  };

  return (
    <div>
      <PageHeader
        title="Admin Panel"
        subtitle="Platform overview and user management"
        icon={<Shield className="w-5 h-5" />}
        action={<button onClick={exportCSV} className="btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>}
      />

      {/* Analytics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Users" value={String(stats.totalUsers)} icon={<Users className="w-5 h-5" />} accent="primary" />
        <StatCard title="Income Records" value={String(stats.totalIncomes)} icon={<Wallet className="w-5 h-5" />} accent="success" />
        <StatCard title="Expense Records" value={String(stats.totalExpenses)} icon={<TrendingDown className="w-5 h-5" />} accent="error" />
        <StatCard title="Habits" value={String(stats.totalHabits)} icon={<Repeat className="w-5 h-5" />} accent="secondary" />
        <StatCard title="Goals" value={String(stats.totalGoals)} icon={<Target className="w-5 h-5" />} accent="accent" />
      </div>

      {/* Users table */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-bold text-slate-800 dark:text-white">Registered Users</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10 py-2.5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 text-primary-500 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>{search ? 'No users match your search' : 'No users registered yet'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Occupation</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Currency</th>
                  <th className="px-4 py-3 font-semibold text-right">Income</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.full_name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{u.full_name}</p>
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1"><Mail className="w-3 h-3" /> {u.id === profile?.id ? 'You' : 'User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{u.occupation ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{u.country ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.currency}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{Number(u.monthly_income).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {u.is_admin ? <Badge color="accent"><Shield className="w-3 h-3" /> Admin</Badge> : <Badge color="slate">Member</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteId(u.id)}
                        disabled={u.id === profile?.id}
                        className="btn-ghost p-2 text-slate-400 hover:text-error-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        title={u.id === profile?.id ? 'Cannot delete yourself' : 'Delete user'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete the user's profile and all their financial records (income, expenses, habits, goals, investments). This cannot be undone.
        </p>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1" disabled={deleting}>Cancel</button>
          <button onClick={handleDelete} className="btn-danger flex-1" disabled={deleting}>
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
