import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { signIn } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      notify(error, 'error');
    } else {
      notify('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5 text-white">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg">WealthWise</span>
        </Link>
        <div className="relative text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">Welcome back to your wealth journey</h2>
          <p className="mt-4 text-primary-100 max-w-md">Sign in to track your habits, grow your savings, and watch your net worth climb.</p>
          <div className="mt-8 space-y-3">
            {['Real-time net worth tracking', 'Habit streaks that motivate', 'Goal progress that excites'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-primary-50">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-primary-100 text-sm">© 2026 WealthWise. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">WealthWise</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 text-error-700 dark:text-error-300 text-sm animate-scale-in">
                {error}
              </div>
            )}
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
              <button type="button" className="text-sm font-semibold text-primary-600 hover:text-primary-700" onClick={() => notify('Password reset link would be sent in production', 'info')}>
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
