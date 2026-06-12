-- VibeSchool: схема базы данных для Supabase.
-- Выполни этот файл целиком в Supabase → SQL Editor → New query → Run.

-- ============ ПРОФИЛИ ============
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'teacher')),
  display_name text not null default '',
  class_code text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Профиль создаётся автоматически при регистрации из метаданных signUp()
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name, class_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    upper(coalesce(new.raw_user_meta_data ->> 'class_code', ''))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Свой профиль виден и редактируется самим пользователем
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Учитель видит профили учеников своего класса.
-- Вспомогательная функция с security definer, чтобы политика не зацикливалась.
create or replace function public.my_teacher_class()
returns text
language sql
security definer set search_path = public
stable
as $$
  select class_code from public.profiles
  where id = auth.uid() and role = 'teacher';
$$;

create policy "profiles: teacher reads class"
  on public.profiles for select
  using (class_code = public.my_teacher_class());

-- ============ ПРОМПТЫ ============
create table if not exists public.prompts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text,
  language text not null default 'python' check (language in ('python', 'javascript')),
  prompt text not null,
  generated_code text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists prompts_user_created_idx
  on public.prompts (user_id, created_at desc);

alter table public.prompts enable row level security;

-- Ученик пишет и читает только свои промпты
create policy "prompts: insert own"
  on public.prompts for insert
  with check (auth.uid() = user_id);

create policy "prompts: read own"
  on public.prompts for select
  using (auth.uid() = user_id);

-- Учитель читает промпты учеников своего класса
create policy "prompts: teacher reads class"
  on public.prompts for select
  using (
    exists (
      select 1 from public.profiles s
      where s.id = prompts.user_id
        and s.class_code = public.my_teacher_class()
    )
  );
