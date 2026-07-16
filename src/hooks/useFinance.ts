import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Income, Expense, Habit, HabitLog, Goal, GoalContribution, Investment, Asset } from '../types';
import { useToast } from '../context/ToastContext';

export function useFinance() {
  const { user, profile } = useAuth();
  const { notify } = useToast();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [inc, exp, hab, logs, goa, con, inv, ast] = await Promise.all([
      supabase.from('incomes').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('habit_logs').select('*').eq('user_id', user.id),
      supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('goal_contributions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('investments').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('assets').select('*').eq('user_id', user.id),
    ]);
    if (inc.data) setIncomes(inc.data as Income[]);
    if (exp.data) setExpenses(exp.data as Expense[]);
    if (hab.data) setHabits(hab.data as Habit[]);
    if (logs.data) setHabitLogs(logs.data as HabitLog[]);
    if (goa.data) setGoals(goa.data as Goal[]);
    if (con.data) setContributions(con.data as GoalContribution[]);
    if (inv.data) setInvestments(inv.data as Investment[]);
    if (ast.data) setAssets(ast.data as Asset[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ---- Incomes ----
  const addIncome = async (data: Omit<Income, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('incomes').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify('Income added'); loadAll();
  };
  const updateIncome = async (id: string, data: Partial<Income>) => {
    const { error } = await supabase.from('incomes').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Income updated'); loadAll();
  };
  const deleteIncome = async (id: string) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Income deleted'); loadAll();
  };

  // ---- Expenses ----
  const addExpense = async (data: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('expenses').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify('Expense added'); loadAll();
  };
  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const { error } = await supabase.from('expenses').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Expense updated'); loadAll();
  };
  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Expense deleted'); loadAll();
  };

  // ---- Habits ----
  const addHabit = async (data: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('habits').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify('Habit created'); loadAll();
  };
  const updateHabit = async (id: string, data: Partial<Habit>) => {
    const { error } = await supabase.from('habits').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Habit updated'); loadAll();
  };
  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Habit deleted'); loadAll();
  };
  const toggleHabitLog = async (habitId: string, date: string, checked: boolean) => {
    if (checked) {
      const { error } = await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, completed_date: date });
      if (error && !error.message.includes('duplicate')) { notify(error.message, 'error'); return; }
    } else {
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_date', date);
      if (error) { notify(error.message, 'error'); return; }
    }
    loadAll();
  };

  // ---- Goals ----
  const addGoal = async (data: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('goals').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify('Goal created'); loadAll();
  };
  const updateGoal = async (id: string, data: Partial<Goal>) => {
    const { error } = await supabase.from('goals').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Goal updated'); loadAll();
  };
  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Goal deleted'); loadAll();
  };
  const addContribution = async (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newAmount = Math.min(goal.current_amount + amount, goal.target_amount);
    const { error: e1 } = await supabase.from('goal_contributions').insert({
      goal_id: goalId, amount, date: new Date().toISOString().slice(0, 10),
    });
    if (e1) { notify(e1.message, 'error'); return; }
    const { error: e2 } = await supabase
      .from('goals')
      .update({ current_amount: newAmount })
      .eq('id', goalId);
    if (e2) { notify(e2.message, 'error'); return; }
    notify('Contribution added'); loadAll();
  };

  // ---- Investments ----
  const addInvestment = async (data: Omit<Investment, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('investments').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify('Investment added'); loadAll();
  };
  const updateInvestment = async (id: string, data: Partial<Investment>) => {
    const { error } = await supabase.from('investments').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Investment updated'); loadAll();
  };
  const deleteInvestment = async (id: string) => {
    const { error } = await supabase.from('investments').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Investment deleted'); loadAll();
  };

  // ---- Assets ----
  const addAsset = async (data: Omit<Asset, 'id' | 'user_id' | 'created_at'>) => {
    const { error } = await supabase.from('assets').insert(data);
    if (error) { notify(error.message, 'error'); return; }
    notify(`${data.kind === 'asset' ? 'Asset' : 'Liability'} added`); loadAll();
  };
  const updateAsset = async (id: string, data: Partial<Asset>) => {
    const { error } = await supabase.from('assets').update(data).eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Updated'); loadAll();
  };
  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) { notify(error.message, 'error'); return; }
    notify('Deleted'); loadAll();
  };

  return {
    profile, loading,
    incomes, expenses, habits, habitLogs, goals, contributions, investments, assets,
    addIncome, updateIncome, deleteIncome,
    addExpense, updateExpense, deleteExpense,
    addHabit, updateHabit, deleteHabit, toggleHabitLog,
    addGoal, updateGoal, deleteGoal, addContribution,
    addInvestment, updateInvestment, deleteInvestment,
    addAsset, updateAsset, deleteAsset,
    reload: loadAll,
  };
}

export type Finance = ReturnType<typeof useFinance>;
