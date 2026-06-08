-- Editable service pricing for the admin dashboard.
-- Applied to Supabase as migration: add_service_pricing_editor.
-- Seed rows were generated from src/lib/data/services.ts when the migration was applied.

create table if not exists public.service_pricing_groups (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  label text not null,
  note text,
  sort_order integer not null default 0,
  is_add_on boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_pricing_groups_service_slug_label_is_add_on_key unique (service_slug, label, is_add_on)
);

create table if not exists public.service_pricing_rows (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.service_pricing_groups(id) on delete cascade,
  item text not null,
  price text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_pricing_rows_group_id_item_key unique (group_id, item)
);

alter table public.service_pricing_groups enable row level security;
alter table public.service_pricing_rows enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.service_pricing_groups to anon, authenticated;
grant select on public.service_pricing_rows to anon, authenticated;
grant insert, update, delete on public.service_pricing_groups to authenticated;
grant insert, update, delete on public.service_pricing_rows to authenticated;

drop policy if exists "service_pricing_groups_public_select" on public.service_pricing_groups;
create policy "service_pricing_groups_public_select"
on public.service_pricing_groups
for select
to anon, authenticated
using (true);

drop policy if exists "service_pricing_groups_admin_insert" on public.service_pricing_groups;
create policy "service_pricing_groups_admin_insert"
on public.service_pricing_groups
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "service_pricing_groups_admin_update" on public.service_pricing_groups;
create policy "service_pricing_groups_admin_update"
on public.service_pricing_groups
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "service_pricing_groups_admin_delete" on public.service_pricing_groups;
create policy "service_pricing_groups_admin_delete"
on public.service_pricing_groups
for delete
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "service_pricing_rows_public_select" on public.service_pricing_rows;
create policy "service_pricing_rows_public_select"
on public.service_pricing_rows
for select
to anon, authenticated
using (true);

drop policy if exists "service_pricing_rows_admin_insert" on public.service_pricing_rows;
create policy "service_pricing_rows_admin_insert"
on public.service_pricing_rows
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "service_pricing_rows_admin_update" on public.service_pricing_rows;
create policy "service_pricing_rows_admin_update"
on public.service_pricing_rows
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "service_pricing_rows_admin_delete" on public.service_pricing_rows;
create policy "service_pricing_rows_admin_delete"
on public.service_pricing_rows
for delete
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
