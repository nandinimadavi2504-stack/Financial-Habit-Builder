import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';

export interface IncomeFormValues {
  amount: number;
  source: string;
  date: string;
  description: string;
}

const SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Bonus', 'Gift', 'Other'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: IncomeFormValues) => void;
  initial?: { amount?: number; source?: string; date?: string; description?: string | null };
  currency?: string;
}

export default function IncomeFormModal({ open, onClose, onSubmit, initial, currency = 'USD' }: Props) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setAmount(initial?.amount ? String(initial.amount) : '');
      setSource(initial?.source ?? 'Salary');
      setDate(initial?.date ?? new Date().toISOString().slice(0, 10));
      setDescription(initial?.description ?? '');
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (!source.trim()) { setError('Source is required'); return; }
    onSubmit({ amount: Number(amount), source, date, description });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Income' : 'Add Income'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="px-4 py-2.5 rounded-xl bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-300 text-sm">{error}</div>}
        <div>
          <label className="label-field">Amount ({currency})</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="input-field" autoFocus />
        </div>
        <div>
          <label className="label-field">Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="input-field appearance-none">
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes..." rows={2} className="input-field resize-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save' : 'Add Income'}</button>
        </div>
      </form>
    </Modal>
  );
}
