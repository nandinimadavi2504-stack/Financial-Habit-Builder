import { useState, useRef, FormEvent } from 'react';
import {
  User, Mail, Phone, Briefcase, Wallet, Globe, Camera, Save, Loader2, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { CURRENCIES, Currency } from '../types';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';

const OCCUPATIONS = ['Student', 'Software Engineer', 'Teacher', 'Doctor', 'Business Owner', 'Freelancer', 'Accountant', 'Designer', 'Marketing', 'Other'];
const COUNTRIES = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore', 'Japan', 'Other'];

export default function Profile() {
  const { user, profile, refreshProfile, isAdmin } = useAuth();
  const { notify } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    occupation: profile?.occupation ?? '',
    monthly_income: String(profile?.monthly_income ?? 0),
    currency: (profile?.currency ?? 'USD') as Currency,
    country: profile?.country ?? '',
    avatar_url: profile?.avatar_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      setForm((f) => ({ ...f, avatar_url: pub.publicUrl }));
      notify('Photo uploaded — save to apply');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone: form.phone,
        occupation: form.occupation,
        monthly_income: Number(form.monthly_income) || 0,
        currency: form.currency,
        country: form.country,
        avatar_url: form.avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);
    setSaving(false);
    if (error) notify(error.message, 'error');
    else { notify('Profile updated'); refreshProfile(); }
  };

  const initials = (profile?.full_name ?? 'U')[0]?.toUpperCase();

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal information and preferences" icon={<User className="w-5 h-5" />} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card p-6 text-center lg:sticky lg:top-24 h-fit">
          <div className="relative inline-block group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-4xl overflow-hidden mx-auto ring-4 ring-primary-100 dark:ring-primary-500/20">
              {form.avatar_url ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" /> : initials}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </div>
          <h3 className="mt-4 font-display font-bold text-lg text-slate-800 dark:text-white">{profile?.full_name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {isAdmin && (
              <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            <span className="chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {profile?.occupation ?? '—'}
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-400">Member since {new Date(profile?.created_at ?? Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="card p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-field">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="label-field">Email (read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={user?.email ?? ''} readOnly className="input-field pl-11 bg-slate-50 dark:bg-slate-800/50 text-slate-500" />
                </div>
              </div>
              <div>
                <label className="label-field">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 0123" className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="label-field">Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="input-field pl-11 appearance-none">
                    <option value="">Select occupation</option>
                    {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-field">Monthly Income</label>
                <div className="relative">
                  <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" min="0" value={form.monthly_income} onChange={(e) => setForm({ ...form, monthly_income: e.target.value })} className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="label-field">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })} className="input-field appearance-none">
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol}) — {c.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field pl-11 appearance-none">
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <StatCard title="Currency" value={form.currency} icon={<Wallet className="w-5 h-5" />} accent="primary" />
            <StatCard title="Monthly Income" value={form.monthly_income ? `${CURRENCIES.find((c) => c.code === form.currency)?.symbol ?? ''}${Number(form.monthly_income).toLocaleString()}` : '—'} icon={<Wallet className="w-5 h-5" />} accent="success" />
            <StatCard title="Role" value={isAdmin ? 'Admin' : 'Member'} icon={<Shield className="w-5 h-5" />} accent="accent" />
            <StatCard title="Country" value={form.country || '—'} icon={<Globe className="w-5 h-5" />} accent="info" />
          </div>
        </div>
      </div>
    </div>
  );
}
