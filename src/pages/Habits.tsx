import { useState, useMemo } from 'react';
import {
  Repeat, Plus, Pencil, Trash2, Flame, Check, Calendar as CalIcon, Trophy, Award, Zap, Star,
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { classNames, formatDate } from '../lib/utils';
import { Habit } from '../types';
import { habitCurrentStreak, computeBestStreak } from '../lib/analytics';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import ProgressBar, { Badge } from '../components/ui/ProgressBar';
import HabitFormModal, { HabitFormValues } from '../components/forms/HabitFormModal';
import Modal from '../components/ui/Modal';

const BADGES = [
  { id: 'first', icon: Star, label: 'First Step', desc: 'Complete a habit once', color: 'accent' },
  { id: 'streak3', icon: Zap, label: 'On Fire', desc: '3-day streak', color: 'warning' },
  { id: 'streak7', icon: Flame, label: 'Week Warrior', desc: '7-day streak', color: 'error' },
  { id: 'streak21', icon: Trophy, label: 'Habit Master', desc: '21-day streak', color: 'primary' },
  { id: 'streak30', icon: Award, label: 'Unstoppable', desc: '30-day streak', color: 'secondary' },
] as const;

function MiniCalendar({ habitId, logs, onToggle }: { habitId: string; logs: string[]; onToggle: (date: string, checked: boolean) => void }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const logSet = new Set(logs.map((l) => l.slice(0, 10)));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push(dateStr);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} className="btn-ghost p-1 text-xs">‹</button>
          <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} className="btn-ghost p-1 text-xs">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const done = logSet.has(date);
          const isFuture = date > today;
          return (
            <button
              key={i}
              disabled={isFuture}
              onClick={() => onToggle(date, !done)}
              className={classNames(
                'aspect-square rounded-md text-[10px] font-medium flex items-center justify-center transition-all',
                done
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : isFuture
                    ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary-100 dark:hover:bg-primary-500/20',
              )}
            >
              {done ? <Check className="w-3 h-3" /> : Number(date.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Habits() {
  const finance = useFinance();
  const { profile } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openCal, setOpenCal] = useState<string | null>(null);

  const bestStreak = useMemo(() => computeBestStreak(finance.habits, finance.habitLogs), [finance.habits, finance.habitLogs]);
  const totalCompletions = finance.habitLogs.length;
  const activeHabits = finance.habits.filter((h) => h.status === 'active').length;

  // Completion percentage this month across all habits
  const monthPct = useMemo(() => {
    if (finance.habits.length === 0) return 0;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const daysSoFar = now.getDate();
    const expected = finance.habits.length * daysSoFar;
    const actual = finance.habitLogs.filter((l) => l.completed_date.startsWith(ym)).length;
    return expected > 0 ? Math.min(100, (actual / expected) * 100) : 0;
  }, [finance.habits, finance.habitLogs]);

  // Earned badges
  const earnedBadges = useMemo(() => {
    const earned = new Set<string>();
    if (totalCompletions > 0) earned.add('first');
    if (bestStreak >= 3) earned.add('streak3');
    if (bestStreak >= 7) earned.add('streak7');
    if (bestStreak >= 21) earned.add('streak21');
    if (bestStreak >= 30) earned.add('streak30');
    return earned;
  }, [bestStreak, totalCompletions]);

  const handleSubmit = (values: HabitFormValues) => {
    if (editing) finance.updateHabit(editing.id, values);
    else finance.addHabit(values);
    setModalOpen(false);
    setEditing(null);
  };

  const habitLogsFor = (habitId: string) => finance.habitLogs.filter((l) => l.habit_id === habitId).map((l) => l.completed_date);

  return (
    <div>
      <PageHeader
        title="Habit Tracker"
        subtitle="Build financial habits that stick"
        icon={<Repeat className="w-5 h-5" />}
        action={<button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary"><Plus className="w-4 h-4" /> New Habit</button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Habits" value={String(activeHabits)} icon={<Repeat className="w-5 h-5" />} accent="primary" />
        <StatCard title="Best Streak" value={`${bestStreak} days`} icon={<Flame className="w-5 h-5" />} accent="error" />
        <StatCard title="Completions" value={String(totalCompletions)} icon={<Check className="w-5 h-5" />} accent="success" />
        <StatCard title="This Month" value={`${monthPct.toFixed(0)}%`} icon={<Trophy className="w-5 h-5" />} accent="accent" subtitle="On track" />
      </div>

      {/* Badges */}
      <div className="card p-5 mb-6">
        <h3 className="font-display font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-accent-500" /> Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES.map((b) => {
            const earned = earnedBadges.has(b.id);
            return (
              <div
                key={b.id}
                className={classNames(
                  'rounded-xl p-4 text-center border transition-all',
                  earned
                    ? 'border-transparent shadow-card-hover ' + `bg-${b.color}-50 dark:bg-${b.color}-500/10`
                    : 'border-slate-200 dark:border-slate-800 opacity-50 grayscale',
                )}
              >
                <div className={classNames('mx-auto p-2.5 rounded-xl w-fit mb-2', `bg-${b.color}-100 dark:bg-${b.color}-500/15 text-${b.color}-600`)}>
                  <b.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{b.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
                {earned && <p className="text-xs font-semibold text-success-600 mt-1">Earned!</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Habits list */}
      {finance.habits.length === 0 ? (
        <div className="card p-5">
          <EmptyState
            icon={<Repeat className="w-8 h-8" />}
            title="No habits yet"
            description="Create your first financial habit to start building streaks"
            action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> New Habit</button>}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {finance.habits.map((habit) => {
            const streak = habitCurrentStreak(habit.id, finance.habitLogs);
            const logs = habitLogsFor(habit.id);
            const thisMonth = new Date().toISOString().slice(0, 7);
            const monthDone = logs.filter((d) => d.startsWith(thisMonth)).length;
            const daysInMonth = new Date().getDate();
            const pct = daysInMonth > 0 ? Math.min(100, (monthDone / daysInMonth) * 100) : 0;
            return (
              <div key={habit.id} className="card p-5 animate-slide-up">
                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white truncate">{habit.name}</h3>
                          <Badge color={habit.status === 'active' ? 'success' : habit.status === 'paused' ? 'warning' : 'info'}>{habit.status}</Badge>
                          <Badge color="secondary">{habit.frequency}</Badge>
                        </div>
                        {habit.target && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Target: {habit.target}</p>}
                        {habit.reminder_time && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><CalIcon className="w-3.5 h-3.5" /> Reminder at {habit.reminder_time}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setEditing(habit); setModalOpen(true); }} className="btn-ghost p-2 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(habit.id)} className="btn-ghost p-2 text-slate-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-error-500" />
                        <div>
                          <p className="text-xl font-bold text-slate-800 dark:text-white">{streak}</p>
                          <p className="text-xs text-slate-400">day streak</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success-500" />
                        <div>
                          <p className="text-xl font-bold text-slate-800 dark:text-white">{monthDone}</p>
                          <p className="text-xs text-slate-400">this month</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Completion this month</span>
                        <span>{pct.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={pct} color={pct >= 75 ? 'success' : pct >= 50 ? 'primary' : 'accent'} />
                    </div>

                    <button
                      onClick={() => finance.toggleHabitLog(habit.id, new Date().toISOString().slice(0, 10), !logs.includes(new Date().toISOString().slice(0, 10)))}
                      className={classNames('mt-4 btn-primary', logs.includes(new Date().toISOString().slice(0, 10)) && 'bg-success-600 hover:bg-success-700')}
                    >
                      <Check className="w-4 h-4" /> {logs.includes(new Date().toISOString().slice(0, 10)) ? 'Completed Today' : 'Mark Today Complete'}
                    </button>
                  </div>

                  <div className="lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-5 pt-4 lg:pt-0">
                    <button onClick={() => setOpenCal(openCal === habit.id ? null : habit.id)} className="text-sm font-semibold text-primary-600 mb-2 flex items-center gap-1.5">
                      <CalIcon className="w-4 h-4" /> {openCal === habit.id ? 'Hide' : 'Show'} Calendar
                    </button>
                    {openCal === habit.id && (
                      <MiniCalendar
                        habitId={habit.id}
                        logs={logs}
                        onToggle={(date, checked) => finance.toggleHabitLog(habit.id, date, checked)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <HabitFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing ?? undefined}
      />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Habit" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Delete this habit and all its completion logs? This cannot be undone.</p>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (deleteId) finance.deleteHabit(deleteId); setDeleteId(null); }} className="btn-danger flex-1">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
