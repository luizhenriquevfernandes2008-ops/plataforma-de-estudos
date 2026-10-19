-- Execute uma vez no SQL Editor de um projeto Supabase seu.
-- Cada usuário acessa somente o próprio progresso; a chave service_role nunca vai no app.
begin;
create table if not exists public.pep_progress (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  revision bigint not null default 1 check (revision > 0),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 10000000),
  updated_at timestamptz not null default now()
);
alter table public.pep_progress enable row level security;
revoke all on public.pep_progress from anon;
grant select, insert, update on public.pep_progress to authenticated;
drop policy if exists pep_own_select on public.pep_progress;
drop policy if exists pep_own_insert on public.pep_progress;
drop policy if exists pep_own_update on public.pep_progress;
create policy pep_own_select on public.pep_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy pep_own_insert on public.pep_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pep_own_update on public.pep_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.pep_save_progress(p_expected bigint, p_payload jsonb)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare next_revision bigint;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 10000000 then raise exception 'Invalid payload'; end if;
  if p_expected = 0 then
    insert into public.pep_progress(user_id, revision, payload)
    values (auth.uid(), 1, p_payload) on conflict (user_id) do nothing
    returning revision into next_revision;
  else
    update public.pep_progress set payload=p_payload, revision=revision+1, updated_at=now()
    where user_id=auth.uid() and revision=p_expected returning revision into next_revision;
  end if;
  if next_revision is null then raise sqlstate '40001' using message='Concurrent update; sync again'; end if;
  return next_revision;
end;
$$;
revoke all on function public.pep_save_progress(bigint,jsonb) from public, anon;
grant execute on function public.pep_save_progress(bigint,jsonb) to authenticated;
commit;
