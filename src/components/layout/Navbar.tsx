import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 glass border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 w-72">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none flex-1 placeholder-slate-400 dark:placeholder-slate-500 text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost p-2.5" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="btn-ghost p-2.5 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 card p-4 animate-scale-in origin-top-right">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3">Notifications</p>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Welcome to WealthWise!</p>
                      <p className="text-xs text-slate-400">Start by adding your first income record.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-accent-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Habit reminder</p>
                      <p className="text-xs text-slate-400">Track every expense today.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.[0] ?? 'U').toUpperCase()
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {profile?.full_name?.split(' ')[0] ?? 'User'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">
                {profile?.is_admin ? 'Admin' : 'Member'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
