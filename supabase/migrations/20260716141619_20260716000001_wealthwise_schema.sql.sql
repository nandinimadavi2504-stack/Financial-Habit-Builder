/*
# WealthWise — Financial Habit Builder & Wealth Growth Tracker

## Overview
Creates the complete data model for a multi-user personal finance application:
profiles, incomes, expenses, habits (+ completion logs), savings goals
(+ contribution history), investments, and assets/liabilities.

## New Tables
1. `profiles` — extends auth.users with demographic + financial preferences.
2. `incomes` — user income records. amount, source, date, description.
3. `expenses` — user expense records. amount, category, payment_method, description, date.
4. `habits` — financial habits. name, frequency, target, reminder_time, status.
5. `habit_logs` — one row per habit completion per date. unique(habit_id, completed_date).
6. `goals` — savings goals. name, target_amount, current_amount, deadline, priority.
7. `goal_contributions` — contribution history per goal. amount, date.
8. `investments` — investment holdings. name, type, amount_invested, current_value, date.
9. `assets` — assets & liabilities (kind column distinguishes them).

## Security (RLS)
- All tables have RLS enabled.
- Owner-scoped CRUD: each authenticated user can SELECT/INSERT/UPDATE/DELETE
  only their own rows. Owner columns default to auth.uid().
- Admins can SELECT across user-data tables and DELETE profiles.
- Helper function `is_admin()` checks the caller's profile.is_admin flag.

## Triggers
- `handle_new_user` — fires on auth.users INSERT; creates a matching profiles
  row from signUp metadata. The FIRST user to register is auto-promoted to admin.
*/

-- =========================================================
-- profiles (created first so is_admin() can reference it)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  occupation text,
  monthly_income numeric(14,2) default 0,
  currency text not null default 'USD',
  country text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Helper: is_admin()  (defined after profiles exists)
-- =========================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Now enable RLS + policies on profiles
alter table public.profiles enable row level security;

drop policy if exists "select_own_or_admin_profiles" on public.profiles;
create policy "select_own_or_admin_profiles" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "insert_own_profile" on public.profiles;
create policy "insert_own_profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "update_own_profile" on public.profiles;
create policy "update_own_profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "admin_delete_profile" on public.profiles;
create policy "admin_delete_profile" on public.profiles
  for delete to authenticated using (public.is_admin());

-- =========================================================
-- incomes
-- =========================================================
create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(14,2) not null check (amount >= 0),
  source text not null,
  date date not null default current_date,
  description text,
  created_at timestamptz not null default now()
);

alter table public.incomes enable row level security;

drop policy if exists "select_own_incomes" on public.incomes;
create policy "select_own_incomes" on public.incomes
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_incomes" on public.incomes;
create policy "insert_own_incomes" on public.incomes
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_incomes" on public.incomes;
create policy "update_own_incomes" on public.incomes
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_incomes" on public.incomes;
create policy "delete_own_incomes" on public.incomes
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- expenses
-- =========================================================
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(14,2) not null check (amount >= 0),
  category text not null check (category in ('Food','Rent','Shopping','Travel','Education','Healthcare','Bills','Entertainment','Investment','Others')),
  payment_method text,
  description text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

drop policy if exists "select_own_expenses" on public.expenses;
create policy "select_own_expenses" on public.expenses
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_expenses" on public.expenses;
create policy "insert_own_expenses" on public.expenses
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_expenses" on public.expenses;
create policy "update_own_expenses" on public.expenses
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_expenses" on public.expenses;
create policy "delete_own_expenses" on public.expenses
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- habits
-- =========================================================
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  frequency text not null check (frequency in ('Daily','Weekly','Monthly')),
  target text,
  reminder_time time,
  status text not null default 'active' check (status in ('active','paused','completed')),
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "select_own_habits" on public.habits;
create policy "select_own_habits" on public.habits
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_habits" on public.habits;
create policy "insert_own_habits" on public.habits
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_habits" on public.habits;
create policy "update_own_habits" on public.habits
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_habits" on public.habits;
create policy "delete_own_habits" on public.habits
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- habit_logs (completion records)
-- =========================================================
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  completed_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_date)
);

alter table public.habit_logs enable row level security;

drop policy if exists "select_own_habit_logs" on public.habit_logs;
create policy "select_own_habit_logs" on public.habit_logs
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_habit_logs" on public.habit_logs;
create policy "insert_own_habit_logs" on public.habit_logs
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "delete_own_habit_logs" on public.habit_logs;
create policy "delete_own_habit_logs" on public.habit_logs
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- goals
-- =========================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14,2) not null check (target_amount > 0),
  current_amount numeric(14,2) not null default 0 check (current_amount >= 0),
  deadline date,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

drop policy if exists "select_own_goals" on public.goals;
create policy "select_own_goals" on public.goals
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_goals" on public.goals;
create policy "insert_own_goals" on public.goals
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_goals" on public.goals;
create policy "update_own_goals" on public.goals
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_goals" on public.goals;
create policy "delete_own_goals" on public.goals
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- goal_contributions
-- =========================================================
create table if not exists public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.goal_contributions enable row level security;

drop policy if exists "select_own_goal_contributions" on public.goal_contributions;
create policy "select_own_goal_contributions" on public.goal_contributions
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_goal_contributions" on public.goal_contributions;
create policy "insert_own_goal_contributions" on public.goal_contributions
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "delete_own_goal_contributions" on public.goal_contributions;
create policy "delete_own_goal_contributions" on public.goal_contributions
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- investments
-- =========================================================
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type text,
  amount_invested numeric(14,2) not null default 0 check (amount_invested >= 0),
  current_value numeric(14,2) not null default 0 check (current_value >= 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.investments enable row level security;

drop policy if exists "select_own_investments" on public.investments;
create policy "select_own_investments" on public.investments
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_investments" on public.investments;
create policy "insert_own_investments" on public.investments
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_investments" on public.investments;
create policy "update_own_investments" on public.investments
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_investments" on public.investments;
create policy "delete_own_investments" on public.investments
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- assets (assets + liabilities via kind column)
-- =========================================================
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('asset','liability')),
  type text,
  value numeric(14,2) not null default 0 check (value >= 0),
  created_at timestamptz not null default now()
);

alter table public.assets enable row level security;

drop policy if exists "select_own_assets" on public.assets;
create policy "select_own_assets" on public.assets
  for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert_own_assets" on public.assets;
create policy "insert_own_assets" on public.assets
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update_own_assets" on public.assets;
create policy "update_own_assets" on public.assets
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete_own_assets" on public.assets;
create policy "delete_own_assets" on public.assets
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- Trigger: auto-create profile on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, occupation, monthly_income, currency, country, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'occupation',
    coalesce((new.raw_user_meta_data->>'monthly_income')::numeric, 0),
    coalesce(new.raw_user_meta_data->>'currency', 'USD'),
    new.raw_user_meta_data->>'country',
    (select count(*) = 0 from public.profiles)  -- first user becomes admin
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- Indexes
-- =========================================================
create index if not exists idx_incomes_user_date on public.incomes(user_id, date desc);
create index if not exists idx_expenses_user_date on public.expenses(user_id, date desc);
create index if not exists idx_expenses_user_category on public.expenses(user_id, category);
create index if not exists idx_habit_logs_habit_date on public.habit_logs(habit_id, completed_date desc);
create index if not exists idx_goal_contributions_goal on public.goal_contributions(goal_id, date desc);
create index if not exists idx_investments_user on public.investments(user_id);
create index if not exists idx_assets_user_kind on public.assets(user_id, kind);
