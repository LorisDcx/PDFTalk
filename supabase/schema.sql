-- PDFTalk Database Schema for Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  trial_end_at timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days') not null,
  stripe_customer_id text unique,
  current_plan text check (current_plan in ('basic', 'growth', 'pro')),
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
  subscription_id text unique,
  pages_processed_this_month integer default 0 not null,
  docs_processed_this_month integer default 0 not null,
  usage_reset_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  pages_count integer not null,
  document_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')) not null
);

-- Summaries table
create table public.summaries (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents on delete cascade unique not null,
  summary jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  key_clauses jsonb not null default '[]'::jsonb,
  easy_reading text,
  tokens_used integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics events table
create table public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete set null,
  event_type text not null,
  event_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index documents_user_id_idx on public.documents(user_id);
create index documents_created_at_idx on public.documents(created_at desc);
create index summaries_document_id_idx on public.summaries(document_id);
create index analytics_events_user_id_idx on public.analytics_events(user_id);
create index analytics_events_event_type_idx on public.analytics_events(event_type);

-- Row Level Security (RLS)

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.summaries enable row level security;
alter table public.analytics_events enable row level security;

-- Users policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Documents policies
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Summaries policies
create policy "Users can view summaries for own documents"
  on public.summaries for select
  using (
    exists (
      select 1 from public.documents
      where documents.id = summaries.document_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can insert summaries for own documents"
  on public.summaries for insert
  with check (
    exists (
      select 1 from public.documents
      where documents.id = summaries.document_id
      and documents.user_id = auth.uid()
    )
  );

-- Analytics policies (users can only insert their own events)
create policy "Users can insert own analytics events"
  on public.analytics_events for insert
  with check (auth.uid() = user_id or user_id is null);

-- Storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict do nothing;

-- Storage policies
create policy "Users can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, trial_end_at, subscription_status)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    timezone('utc'::text, now()) + interval '7 days',
    'trialing'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to reset monthly usage (run via cron job)
create or replace function public.reset_monthly_usage()
returns void as $$
begin
  update public.users
  set 
    pages_processed_this_month = 0,
    docs_processed_this_month = 0,
    usage_reset_at = timezone('utc'::text, now())
  where usage_reset_at < timezone('utc'::text, now()) - interval '30 days';
end;
$$ language plpgsql security definer;
