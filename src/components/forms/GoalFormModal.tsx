import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';

export interface GoalFormValues {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GoalFormValues) => void;
  initial?: { name?: string; target_amount?: number; current_amount?: number; deadline?: string | null; priority?: 'low' | 'medium' | 'high' };
  currency?: string;
}

export default function GoalFormModal({ open, onClose, onSubmit, initial, currency = 'USD' }: Props) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setTarget(initial?.target_amount ? String(initial.target_amount) : '');
      setCurrent(initial?.current_amount ? String(initial.current_amount) : '0');
      setDeadline(initial?.deadline ?? '');
      setPriority(initial?.priority ?? 'medium');
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Goal name is required'); return; }
    if (!target || Number(target) <= 0) { setError('Target amount must be greater than 0'); return; }
    onSubmit({
      name: name.trim(),
      target_amount: Number(target),
      current_amount: Number(current) || 0,
      deadline,
      priority,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Goal' : 'Create Savings Goal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="px-4 py-2.5 rounded-xl bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-300 text-sm">{error}</div>}
        <div>
          <label className="label-field">Goal Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emergency Fund" className="input-field" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Target Amount ({currency})</label>
            <input type="number" min="0" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="10000" className="input-field" />
          </div>
          <div>
            <label className="label-field">Already Saved ({currency})</label>
            <input type="number" min="0" step="0.01" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')} className="input-field appearance-none">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save' : 'Create Goal'}</button>
        </div>
      </form>
    </Modal>
  );
}
