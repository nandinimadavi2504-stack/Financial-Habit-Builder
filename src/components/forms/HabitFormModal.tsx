import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import { HabitFrequency, HabitStatus } from '../../types';

export interface HabitFormValues {
  name: string;
  frequency: HabitFrequency;
  target: string;
  reminder_time: string;
  status: HabitStatus;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: HabitFormValues) => void;
  initial?: { name?: string; frequency?: HabitFrequency; target?: string | null; reminder_time?: string | null; status?: HabitStatus };
}

const SUGGESTIONS = [
  'Save ₹100 Daily', 'Track Every Expense', 'Invest Monthly', 'Review Budget Weekly',
  'No Impulse Buying', 'Save 20% of Income', 'Check Subscriptions',
];

export default function HabitFormModal({ open, onClose, onSubmit, initial }: Props) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('Daily');
  const [target, setTarget] = useState('');
  const [reminder, setReminder] = useState('09:00');
  const [status, setStatus] = useState<HabitStatus>('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setFrequency(initial?.frequency ?? 'Daily');
      setTarget(initial?.target ?? '');
      setReminder(initial?.reminder_time ?? '09:00');
      setStatus(initial?.status ?? 'active');
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Habit name is required'); return; }
    onSubmit({ name: name.trim(), frequency, target, reminder_time: reminder, status });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Habit' : 'Create Habit'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="px-4 py-2.5 rounded-xl bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-300 text-sm">{error}</div>}
        <div>
          <label className="label-field">Habit Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Save ₹100 Daily" className="input-field" autoFocus />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button key={s} type="button" onClick={() => setName(s)} className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-500/15">
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as HabitFrequency)} className="input-field appearance-none">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as HabitStatus)} className="input-field appearance-none">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Target</label>
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. ₹3000/month" className="input-field" />
          </div>
          <div>
            <label className="label-field">Reminder Time</label>
            <input type="time" value={reminder} onChange={(e) => setReminder(e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save' : 'Create Habit'}</button>
        </div>
      </form>
    </Modal>
  );
}
