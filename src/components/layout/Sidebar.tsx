import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, TrendingDown, Repeat, Target, TrendingUp,
  User, Shield, LogOut, Sparkles, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { classNames } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/income', label: 'Income Tracker', icon: Wallet },
  { to: '/expenses', label: 'Expense Tracker', icon: TrendingDown },
  { to: '/habits', label: 'Habit Tracker', icon: Repeat },
  { to: '/goals', label: 'Savings Goals', icon: Target },
  { to: '/analytics', label: 'Wealth Analytics', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={classNames(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0',
          'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
          'flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white">WealthWise</span>
          </NavLink>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200',
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="pt-3 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
                  )
                }
              >
                <Shield className="w-5 h-5 shrink-0" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.[0] ?? 'U').toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                {profile?.full_name ?? 'User'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {profile?.occupation ?? 'Member'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10 dark:hover:text-error-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
