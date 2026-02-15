-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create study_logs table
create table public.study_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  study_date date not null,
  hours numeric not null default 0,
  topic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_logs enable row level security;

create policy "Users can view own study logs."
  on study_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own study logs."
  on study_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own study logs."
  on study_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete own study logs."
  on study_logs for delete
  using ( auth.uid() = user_id );

-- Create journal_entries table
create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.journal_entries enable row level security;

create policy "Users can view own journal entries."
  on journal_entries for select
  using ( auth.uid() = user_id );

create policy "Users can insert own journal entries."
  on journal_entries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own journal entries."
  on journal_entries for update
  using ( auth.uid() = user_id );

create policy "Users can delete own journal entries."
  on journal_entries for delete
  using ( auth.uid() = user_id );

-- Create mock_scores table
create table public.mock_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.mock_scores enable row level security;

create policy "Users can view own mock scores."
  on mock_scores for select
  using ( auth.uid() = user_id );

create policy "Users can insert own mock scores."
  on mock_scores for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own mock scores."
  on mock_scores for update
  using ( auth.uid() = user_id );

create policy "Users can delete own mock scores."
  on mock_scores for delete
  using ( auth.uid() = user_id );

-- Create distraction_logs table
create table public.distraction_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.distraction_logs enable row level security;

create policy "Users can view own distraction logs."
  on distraction_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own distraction logs."
  on distraction_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own distraction logs."
  on distraction_logs for update
  using ( auth.uid() = user_id );

create policy "Users can delete own distraction logs."
  on distraction_logs for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
