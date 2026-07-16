import { useState, FormEvent, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Mail, Lock, User, Phone, Briefcase, Eye, EyeOff, ArrowRight, Loader2,
  Check, X, Wallet, Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CURRENCIES, Currency } from '../types';

const OCCUPATIONS = ['Student', 'Software Engineer', 'Teacher', 'Doctor', 'Business Owner', 'Freelancer', 'Accountant', 'Designer', 'Marketing', 'Other'];
const COUNTRIES = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore', 'Japan', 'Other'];

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const colors = ['bg-error-500', 'bg-error-500', 'bg-warning-500', 'bg-accent-500', 'bg-primary-500', 'bg-success-500'];
  return { score, label: labels[score], color: colors[score] };
}

export default function Register() {
  const { signUp } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm: '',
    occupation: '', monthly_income: '', currency: 'USD' as Currency, country: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    else if (form.full_name.trim().length < 2) e.full_name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s()-]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = 'Include upper, lower, and a number';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (!form.occupation) e.occupation = 'Select your occupation';
    if (!form.monthly_income || Number(form.monthly_income) < 0) e.monthly_income = 'Enter a valid amount';
    if (!form.country) e.country = 'Select your country';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      full_name: form.full_name,
      phone: form.phone,
      occupation: form.occupation,
      monthly_income: form.monthly_income,
      currency: form.currency,
      country: form.country,
    });
    setLoading(false);
    if (error) {
      notify(error, 'error');
    } else {
      notify('Account created! Welcome to WealthWise.');
      navigate('/dashboard');
    }
  };

  const Err = ({ name }: { name: string }) =>
    errors[name] ? <p className="mt-1.5 text-xs text-error-600 dark:text-error-400 flex items-center gap-1"><X className="w-3.5 h-3.5" /> {errors[name]}</p> : null;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-secondary-600 via-primary-700 to-primary-800 p-12 flex-col justify-between">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5 text-white">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur"><Sparkles className="w-5 h-5" /></div>
          <span className="font-display font-bold text-lg">WealthWise</span>
        </Link>
        <div className="relative text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">Start building wealth, one habit at a time</h2>
          <p className="mt-4 text-primary-50 max-w-md">Join 50,000+ people tracking their money, hitting savings goals, and growing net worth.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm">
            {[
              { v: '₹120Cr+', l: 'Tracked monthly' },
              { v: '4.9/5', l: 'User rating' },
              { v: '23%', l: 'Avg. savings boost' },
              { v: '50K+', l: 'Active users' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <p className="text-2xl font-bold">{s.v}</p>
                <p className="text-sm text-primary-50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-primary-100 text-sm">© 2026 WealthWise. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8 animate-slide-up">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white"><Sparkles className="w-5 h-5" /></div>
            <span className="font-display font-bold text-lg">WealthWise</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start your journey to financial freedom</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Jane Doe" className="input-field pl-11" />
                </div>
                <Err name="full_name" />
              </div>
              <div>
                <label className="label-field">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="input-field pl-11" />
                </div>
                <Err name="email" />
              </div>
              <div>
                <label className="label-field">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 0123" className="input-field pl-11" />
                </div>
                <Err name="phone" />
              </div>
              <div>
                <label className="label-field">Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                  <select value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className="input-field pl-11 appearance-none">
                    <option value="">Select occupation</option>
                    {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <Err name="occupation" />
              </div>
              <div>
                <label className="label-field">Monthly Income</label>
                <div className="relative">
                  <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="number" min="0" value={form.monthly_income} onChange={(e) => set('monthly_income', e.target.value)} placeholder="5000" className="input-field pl-11" />
                </div>
                <Err name="monthly_income" />
              </div>
              <div>
                <label className="label-field">Currency</label>
                <div className="relative">
                  <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className="input-field appearance-none">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol}) — {c.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="label-field">Country</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <select value={form.country} onChange={(e) => set('country', e.target.value)} className="input-field pl-11 appearance-none">
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Err name="country" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" className="input-field pl-11 pr-11" />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{strength.label}</p>
                  </div>
                )}
                <Err name="password" />
              </div>
              <div>
                <label className="label-field">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="••••••••" className="input-field pl-11 pr-11" />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.confirm && form.confirm === form.password && (
                  <p className="mt-2 text-xs text-success-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Passwords match</p>
                )}
                <Err name="confirm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
