-- Apply to existing Supabase projects before deploying the matching app code.
alter table public.users drop constraint if exists users_current_plan_check;
alter table public.users add constraint users_current_plan_check
  check (current_plan in ('basic', 'growth', 'pro', 'starter', 'student', 'graduate'));
alter table public.users
  add column if not exists trial_pages_processed_today integer not null default 0,
  add column if not exists trial_usage_reset_at timestamptz not null default now();
alter table public.summaries add column if not exists source_text text;

-- The auth trigger creates profiles. The browser may edit only the display name.
drop policy if exists "Users can insert own profile" on public.users;
revoke insert on public.users from public, anon, authenticated;
revoke update on public.users from public, anon, authenticated;
grant update (name) on public.users to authenticated;

create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  question text not null,
  answer text not null,
  source_ref text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists flashcards_document_id_idx on public.flashcards(document_id);
alter table public.flashcards enable row level security;

create policy "Users can view own flashcards" on public.flashcards for select
  using (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));
create policy "Users can insert own flashcards" on public.flashcards for insert
  with check (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));
create policy "Users can delete own flashcards" on public.flashcards for delete
  using (exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid()));

grant select, insert, delete on public.flashcards to authenticated;


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

create or replace function public.reset_monthly_usage()
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.users
  set pages_processed_this_month = 0,
      docs_processed_this_month = 0,
      humanizer_uses_this_month = 0,
      usage_reset_at = now()
  where date_trunc('month', usage_reset_at) < date_trunc('month', now());
end;
$$;
revoke all on function public.reset_monthly_usage() from public, anon, authenticated;
grant execute on function public.reset_monthly_usage() to service_role;
