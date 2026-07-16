import { useState, useMemo } from 'react';
import {
  Target, Plus, Pencil, Trash2, TrendingUp, Calendar, AlertCircle, History, CheckCircle,
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, daysBetween, classNames } from '../lib/utils';
import { Goal, GoalContribution } from '../types';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import ProgressBar, { Badge } from '../components/ui/ProgressBar';
import GoalFormModal, { GoalFormValues } from '../components/forms/GoalFormModal';
import Modal from '../components/ui/Modal';

const priorityColor = { low: 'slate', medium: 'info', high: 'error' } as const;

export default function Goals() {
  const finance = useFinance();
  const { profile } = useAuth();
  const currency = profile?.currency ?? 'USD';

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [contribGoal, setContribGoal] = useState<Goal | null>(null);
  const [contribAmount, setContribAmount] = useState('');
  const [historyGoal, setHistoryGoal] = useState<Goal | null>(null);

  const totalTarget = finance.goals.reduce((s, g) => s + Number(g.target_amount), 0);
  const totalSaved = finance.goals.reduce((s, g) => s + Number(g.current_amount), 0);
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completedGoals = finance.goals.filter((g) => Number(g.current_amount) >= Number(g.target_amount)).length;

  const handleSubmit = (values: GoalFormValues) => {
    if (editing) finance.updateGoal(editing.id, values);
    else finance.addGoal(values);
    setModalOpen(false);
    setEditing(null);
  };

  const handleContribute = () => {
    if (!contribGoal || !contribAmount) return;
    finance.addContribution(contribGoal.id, Number(contribAmount));
    setContribGoal(null);
    setContribAmount('');
  };

  const contributionsFor = (goalId: string): GoalContribution[] =>
    finance.contributions.filter((c) => c.goal_id === goalId);

  return (
    <div>
      <PageHeader
        title="Savings Goals"
        subtitle="Set targets and watch your savings grow"
        icon={<Target className="w-5 h-5" />}
        action={<button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary"><Plus className="w-4 h-4" /> New Goal</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Saved" value={formatCurrency(totalSaved, currency)} icon={<TrendingUp className="w-5 h-5" />} accent="success" subtitle={`of ${formatCurrency(totalTarget, currency)}`} />
        <StatCard title="Overall Progress" value={`${overallPct.toFixed(0)}%`} icon={<Target className="w-5 h-5" />} accent="primary" />
        <StatCard title="Goals Completed" value={String(completedGoals)} icon={<CheckCircle className="w-5 h-5" />} accent="accent" subtitle={`of ${finance.goals.length}`} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {finance.goals.length === 0 ? (
          <div className="col-span-full card p-5">
            <EmptyState
              icon={<Target className="w-8 h-8" />}
              title="No savings goals"
              description="Set your first savings goal to start working toward it"
              action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> New Goal</button>}
            />
          </div>
        ) : (
          finance.goals.map((goal) => {
            const pct = Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100);
            const remaining = Number(goal.target_amount) - Number(goal.current_amount);
            const daysLeft = goal.deadline ? daysBetween(new Date(), goal.deadline) : null;
            const isComplete = pct >= 100;
            const contribs = contributionsFor(goal.id);

            return (
              <div key={goal.id} className="card p-5 hover:shadow-card-hover transition-all animate-slide-up flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-800 dark:text-white truncate">{goal.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge color={priorityColor[goal.priority]}>Priority: {goal.priority}</Badge>
                      {isComplete && <Badge color="success"><CheckCircle className="w-3 h-3" /> Complete</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditing(goal); setModalOpen(true); }} className="btn-ghost p-1.5 text-slate-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(goal.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-error-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">{formatCurrency(Number(goal.current_amount), currency)}</span>
                    <span className="text-sm text-slate-400">/ {formatCurrency(Number(goal.target_amount), currency)}</span>
                  </div>
                  <ProgressBar value={pct} color={isComplete ? 'success' : pct >= 75 ? 'primary' : 'accent'} height="h-3" />
                  <p className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{pct.toFixed(0)}% complete</p>
                </div>

                <div className="space-y-2 text-sm flex-1">
                  {goal.deadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Deadline</span>
                      <span className={classNames('font-semibold', daysLeft !== null && daysLeft < 0 ? 'text-error-500' : daysLeft !== null && daysLeft < 30 ? 'text-warning-600' : 'text-slate-700 dark:text-slate-200')}>
                        {formatDate(goal.deadline)}
                      </span>
                    </div>
                  )}
                  {daysLeft !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Days left</span>
                      <span className={classNames('font-semibold', daysLeft < 0 ? 'text-error-500' : 'text-slate-700 dark:text-slate-200')}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : `${daysLeft} days`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Remaining</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(remaining, currency)}</span>
                  </div>
                  <button onClick={() => setHistoryGoal(goal)} className="flex items-center gap-1.5 text-xs font-semibold text-info-600 hover:text-info-700">
                    <History className="w-3.5 h-3.5" /> {contribs.length} contributions
                  </button>
                </div>

                <button
                  onClick={() => setContribGoal(goal)}
                  disabled={isComplete}
                  className="btn-primary mt-4 w-full disabled:bg-success-600"
                >
                  {isComplete ? <><CheckCircle className="w-4 h-4" /> Goal Reached!</> : <><Plus className="w-4 h-4" /> Add Contribution</>}
                </button>
              </div>
            );
          })
        )}
      </div>

      <GoalFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing ?? undefined}
        currency={currency}
      />

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Goal" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">Delete this savings goal and all contribution history? This cannot be undone.</p>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { if (deleteId) finance.deleteGoal(deleteId); setDeleteId(null); }} className="btn-danger flex-1">Delete</button>
        </div>
      </Modal>

      <Modal open={!!contribGoal} onClose={() => { setContribGoal(null); setContribAmount(''); }} title={`Contribute to ${contribGoal?.name ?? ''}`} size="sm">
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Current:</span><span className="font-semibold">{formatCurrency(Number(contribGoal?.current_amount ?? 0), currency)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Target:</span><span className="font-semibold">{formatCurrency(Number(contribGoal?.target_amount ?? 0), currency)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Remaining:</span><span className="font-semibold text-primary-600">{formatCurrency(Number(contribGoal?.target_amount ?? 0) - Number(contribGoal?.current_amount ?? 0), currency)}</span></div>
          </div>
          <div>
            <label className="label-field">Contribution Amount ({currency})</label>
            <input type="number" min="0" step="0.01" value={contribAmount} onChange={(e) => setContribAmount(e.target.value)} placeholder="0.00" className="input-field" autoFocus />
          </div>
          <button onClick={handleContribute} className="btn-primary w-full">Add Contribution</button>
        </div>
      </Modal>

      <Modal open={!!historyGoal} onClose={() => setHistoryGoal(null)} title={`Contribution History — ${historyGoal?.name ?? ''}`}>
        {contributionsFor(historyGoal?.id ?? '').length === 0 ? (
          <EmptyState icon={<History className="w-8 h-8" />} title="No contributions yet" description="Add your first contribution to start tracking progress" />
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {contributionsFor(historyGoal?.id ?? '').map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(Number(c.amount), currency)}</p>
                  <p className="text-xs text-slate-400">{formatDate(c.date)}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-success-500" />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
