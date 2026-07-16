import { Link } from 'react-router-dom';
import {
  Sparkles, TrendingUp, Target, Repeat, Wallet, PieChart, Shield,
  ArrowRight, Check, BarChart3, LineChart, Award, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: Wallet, title: 'Income & Expense Tracking', desc: 'Log every transaction with categories, payment methods, and rich descriptions for complete visibility.' },
  { icon: Repeat, title: 'Financial Habit Builder', desc: 'Build streaks with daily, weekly, and monthly habits. Track Every Expense, Invest Monthly, and more.' },
  { icon: Target, title: 'Savings Goals', desc: 'Set targets with deadlines and priorities. Watch progress bars fill as you contribute toward your dreams.' },
  { icon: PieChart, title: 'Wealth Analytics', desc: 'Net worth, savings rate, and growth trends visualized across beautiful interactive charts.' },
  { icon: BarChart3, title: 'Smart Reports', desc: 'Monthly breakdowns, category insights, and year-over-year comparisons to understand your patterns.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Bank-grade encryption with JWT auth. Your financial data is protected and never shared.' },
];

const benefits = [
  { icon: TrendingUp, title: 'Grow Your Net Worth', desc: 'Average users see a 23% increase in savings rate within 3 months of consistent tracking.' },
  { icon: Award, title: 'Build Lasting Habits', desc: 'Streaks and badges keep you motivated. 87% of users maintain their habits past 90 days.' },
  { icon: LineChart, title: 'See the Full Picture', desc: 'Dashboard aggregates income, expenses, savings, investments, and goals in one view.' },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '₹120Cr+', label: 'Tracked Monthly' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '23%', label: 'Avg. Savings Boost' },
];

export default function Landing() {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">WealthWise</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#benefits" className="hover:text-primary-600 transition-colors">Benefits</a>
            <a href="#stats" className="hover:text-primary-600 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost p-2.5">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {session ? (
              <Link to="/dashboard" className="btn-primary text-sm">Go to Dashboard <ArrowRight className="w-4 h-4" /></Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/80 via-white to-white dark:from-primary-500/5 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-secondary-200/30 dark:bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Your path to financial freedom starts here
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                Build financial habits.<br />
                <span className="text-gradient">Grow your wealth.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Track income and expenses, build lasting money habits, set savings goals,
                and watch your net worth grow — all in one beautifully simple dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary text-base px-6 py-3">
                  Start Free Today <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#features" className="btn-secondary text-base px-6 py-3">Explore Features</a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success-500" /> No credit card</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-success-500" /> Free forever</div>
              </div>
            </div>

            {/* Hero preview card */}
            <div className="relative animate-scale-in">
              <div className="card p-6 shadow-card-hover rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-slate-500">Total Net Worth</p>
                    <p className="text-3xl font-bold font-display text-gradient">₹8,42,500</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-success-100 dark:bg-success-500/15 text-success-700 dark:text-success-300 text-xs font-bold">
                    ▲ 12.4%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Income', value: '₹1,20,000', color: 'text-primary-600' },
                    { label: 'Expenses', value: '₹68,400', color: 'text-error-500' },
                    { label: 'Savings', value: '₹51,600', color: 'text-success-600' },
                    { label: 'Investments', value: '₹4,20,000', color: 'text-info-600' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-end gap-1.5 h-24">
                  {[40, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary-500 to-secondary-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Last 8 months</span>
                  <span className="flex items-center gap-1 text-success-600 font-semibold">
                    <Repeat className="w-3.5 h-3.5" /> 21-day streak
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 card p-4 shadow-card-hover -rotate-2 hover:rotate-0 transition-transform duration-500 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-500/15 text-accent-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Vacation Fund</p>
                    <p className="text-sm font-bold">78% complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section id="stats" className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold font-display text-gradient">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to master your money</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Powerful features designed to make financial tracking effortless and habit-building addictive.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Why WealthWise works</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">It's not just tracking — it's transformation. Built on behavioral science to make good financial habits stick.</p>
              <div className="mt-8 space-y-6">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shrink-0">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg">{b.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Repeat, label: 'Habit Streak', value: '21 days', color: 'from-primary-500 to-secondary-500' },
                { icon: TrendingUp, label: 'Savings Rate', value: '43%', color: 'from-success-500 to-primary-500' },
                { icon: Target, label: 'Goals Hit', value: '7 / 10', color: 'from-accent-500 to-warning-500' },
                { icon: Award, label: 'Badges', value: '12 earned', color: 'from-info-500 to-secondary-500' },
              ].map((c) => (
                <div key={c.label} className="card p-6 text-center hover:shadow-card-hover transition-all">
                  <div className={`mx-auto p-3 rounded-xl bg-gradient-to-br ${c.color} text-white w-fit`}>
                    <c.icon className="w-6 h-6" />
                  </div>
                  <p className="mt-3 text-2xl font-bold font-display">{c.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 p-10 sm:p-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Ready to take control of your finances?</h2>
            <p className="mt-4 text-primary-50 max-w-xl mx-auto">Join thousands building better money habits. It's free, secure, and takes less than a minute to start.</p>
            <Link to="/register" className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-base hover:scale-105 active:scale-95 transition-transform shadow-lg">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold">WealthWise</span>
            <span className="text-sm text-slate-400">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600">Features</a>
            <a href="#benefits" className="hover:text-primary-600">Benefits</a>
            <Link to="/login" className="hover:text-primary-600">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
