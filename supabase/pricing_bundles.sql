-- Bundle specials composed from existing service_pricing_rows.
-- Applied to Supabase as migration: add_pricing_bundles.

create table if not exists public.pricing_bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  bundle_price text not null,
  bundle_amount_zar integer not null check (bundle_amount_zar >= 0),
  regular_total_zar integer not null check (regular_total_zar >= 0),
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  show_on_homepage boolean not null default false,
  service_slugs text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_bundles_date_range_check check (
    starts_at is null or ends_at is null or starts_at <= ends_at
  )
);

create table if not exists public.pricing_bundle_items (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references public.pricing_bundles(id) on delete cascade,
  pricing_row_id uuid not null references public.service_pricing_rows(id) on delete restrict,
  quantity integer not null check (quantity >= 1),
  sort_order integer not null default 0,
  item_label text not null,
  unit_price text not null,
  unit_amount_zar integer not null check (unit_amount_zar >= 0),
  created_at timestamptz not null default now(),
  constraint pricing_bundle_items_bundle_row_key unique (bundle_id, pricing_row_id)
);

create index if not exists pricing_bundles_sort_order_idx on public.pricing_bundles (sort_order);
create index if not exists pricing_bundles_service_slugs_idx on public.pricing_bundles using gin (service_slugs);
create index if not exists pricing_bundle_items_bundle_id_idx on public.pricing_bundle_items (bundle_id);

alter table public.pricing_bundles enable row level security;
alter table public.pricing_bundle_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.pricing_bundles to anon, authenticated;
grant select on public.pricing_bundle_items to anon, authenticated;
grant insert, update, delete on public.pricing_bundles to authenticated;
grant insert, update, delete on public.pricing_bundle_items to authenticated;

drop policy if exists "pricing_bundles_public_select" on public.pricing_bundles;
create policy "pricing_bundles_public_select"
on public.pricing_bundles
for select
to anon, authenticated
using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists "pricing_bundles_admin_insert" on public.pricing_bundles;
create policy "pricing_bundles_admin_insert"
on public.pricing_bundles
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundles_admin_update" on public.pricing_bundles;
create policy "pricing_bundles_admin_update"
on public.pricing_bundles
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundles_admin_delete" on public.pricing_bundles;
create policy "pricing_bundles_admin_delete"
on public.pricing_bundles
for delete
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundles_admin_select" on public.pricing_bundles;
create policy "pricing_bundles_admin_select"
on public.pricing_bundles
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundle_items_public_select" on public.pricing_bundle_items;
create policy "pricing_bundle_items_public_select"
on public.pricing_bundle_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.pricing_bundles b
    where b.id = pricing_bundle_items.bundle_id
      and b.is_active = true
      and (b.starts_at is null or b.starts_at <= now())
      and (b.ends_at is null or b.ends_at >= now())
  )
);

drop policy if exists "pricing_bundle_items_admin_insert" on public.pricing_bundle_items;
create policy "pricing_bundle_items_admin_insert"
on public.pricing_bundle_items
for insert
to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundle_items_admin_update" on public.pricing_bundle_items;
create policy "pricing_bundle_items_admin_update"
on public.pricing_bundle_items
for update
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundle_items_admin_delete" on public.pricing_bundle_items;
create policy "pricing_bundle_items_admin_delete"
on public.pricing_bundle_items
for delete
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

drop policy if exists "pricing_bundle_items_admin_select" on public.pricing_bundle_items;
create policy "pricing_bundle_items_admin_select"
on public.pricing_bundle_items
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
