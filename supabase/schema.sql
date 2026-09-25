-- CramDesk Database Schema for Supabase

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
  current_plan text check (current_plan in ('starter', 'student', 'graduate')),
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
  subscription_id text unique,
  pages_processed_this_month integer default 0 not null,
  docs_processed_this_month integer default 0 not null,
  humanizer_uses_this_month integer default 0 not null,
  usage_reset_at timestamp with time zone default timezone('utc'::text, now()) not null,
  trial_pages_processed_today integer default 0 not null,
  trial_usage_reset_at timestamp with time zone default timezone('utc'::text, now()) not null
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
  source_text text,
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

-- Generated flashcards belong to a document and are available across devices.
create table public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents on delete cascade not null,
  question text not null,
  answer text not null,
  source_ref text,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index documents_user_id_idx on public.documents(user_id);
create index documents_created_at_idx on public.documents(created_at desc);
create index summaries_document_id_idx on public.summaries(document_id);
create index analytics_events_user_id_idx on public.analytics_events(user_id);
create index analytics_events_event_type_idx on public.analytics_events(event_type);
create index flashcards_document_id_idx on public.flashcards(document_id);

-- Row Level Security (RLS)

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.summaries enable row level security;
alter table public.analytics_events enable row level security;
alter table public.flashcards enable row level security;

-- Users policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Profiles are inserted by the auth trigger, never by a browser request.
revoke insert on public.users from public, anon, authenticated;
revoke update on public.users from public, anon, authenticated;
grant update (name) on public.users to authenticated;

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

create policy "Users can view own flashcards" on public.flashcards for select
  using (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));
create policy "Users can insert own flashcards" on public.flashcards for insert
  with check (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));
create policy "Users can delete own flashcards" on public.flashcards for delete
  using (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));
grant select, insert, delete on public.flashcards to authenticated;

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
    humanizer_uses_this_month = 0,
    usage_reset_at = timezone('utc'::text, now())
  where date_trunc('month', usage_reset_at) < date_trunc('month', now());
end;
$$ language plpgsql security definer;

revoke all on function public.reset_monthly_usage() from public, anon, authenticated;
grant execute on function public.reset_monthly_usage() to service_role;


-- Atomic quota consumption; only the server's service-role client can call these.
create or replace function public.consume_pages(
  p_user_id uuid, p_pages integer, p_document boolean default false
) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  updated_rows integer;
begin
  if p_pages <= 0 then return false; end if;

  update public.users
  set pages_processed_this_month =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then pages_processed_this_month + p_pages else p_pages end,
      docs_processed_this_month =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then docs_processed_this_month + (case when p_document then 1 else 0 end)
          else (case when p_document then 1 else 0 end) end,
      humanizer_uses_this_month =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then humanizer_uses_this_month else 0 end,
      usage_reset_at =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then usage_reset_at else now() end,
      trial_pages_processed_today =
        case when trial_usage_reset_at::date = now()::date
          then trial_pages_processed_today + p_pages else p_pages end,
      trial_usage_reset_at =
        case when trial_usage_reset_at::date = now()::date
          then trial_usage_reset_at else now() end
  where id = p_user_id
    and (
      (subscription_status = 'trialing' and trial_end_at > now()
        and (case when trial_usage_reset_at::date = now()::date
          then trial_pages_processed_today else 0 end) + p_pages <= 200)
      or
      (subscription_status = 'active'
        and (case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then pages_processed_this_month else 0 end) + p_pages <=
          (case current_plan
            when 'student' then 800 when 'growth' then 800
            when 'graduate' then 10000 when 'pro' then 10000
            else 300 end))
    );

  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;
revoke all on function public.consume_pages(uuid, integer, boolean) from public, anon, authenticated;
grant execute on function public.consume_pages(uuid, integer, boolean) to service_role;

create or replace function public.consume_humanizer_credit(p_user_id uuid)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  updated_rows integer;
begin
  update public.users
  set humanizer_uses_this_month =
        (case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then humanizer_uses_this_month else 0 end) + 1,
      pages_processed_this_month =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then pages_processed_this_month else 0 end,
      docs_processed_this_month =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then docs_processed_this_month else 0 end,
      usage_reset_at =
        case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then usage_reset_at else now() end
  where id = p_user_id
    and (
      (subscription_status = 'trialing' and trial_end_at > now()
        and (case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then humanizer_uses_this_month else 0 end) < 2)
      or
      (subscription_status = 'active'
        and (case when date_trunc('month', usage_reset_at) = date_trunc('month', now())
          then humanizer_uses_this_month else 0 end) <
          (case current_plan
            when 'student' then 10 when 'growth' then 10
            when 'graduate' then 20 when 'pro' then 20
            else 5 end))
    );

  get diagnostics updated_rows = row_count;
  return updated_rows = 1;
end;
$$;
revoke all on function public.consume_humanizer_credit(uuid) from public, anon, authenticated;
grant execute on function public.consume_humanizer_credit(uuid) to service_role;
