import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../types';

export interface ExpenseFormValues {
  amount: number;
  category: ExpenseCategory;
  payment_method: string;
  description: string;
  date: string;
}

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Wallet', 'Other'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
  initial?: { amount?: number; category?: ExpenseCategory; payment_method?: string | null; description?: string | null; date?: string };
  currency?: string;
}

export default function ExpenseFormModal({ open, onClose, onSubmit, initial, currency = 'USD' }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setAmount(initial?.amount ? String(initial.amount) : '');
      setCategory(initial?.category ?? 'Food');
      setPaymentMethod(initial?.payment_method ?? 'Cash');
      setDescription(initial?.description ?? '');
      setDate(initial?.date ?? new Date().toISOString().slice(0, 10));
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount'); return; }
    onSubmit({ amount: Number(amount), category, payment_method: paymentMethod, description, date });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="px-4 py-2.5 rounded-xl bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-300 text-sm">{error}</div>}
        <div>
          <label className="label-field">Amount ({currency})</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="input-field" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className="input-field appearance-none">
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field appearance-none">
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
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
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save' : 'Add Expense'}</button>
        </div>
      </form>
    </Modal>
  );
}
