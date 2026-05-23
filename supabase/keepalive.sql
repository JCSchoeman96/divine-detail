create table if not exists public.keepalive (
  id int primary key
);

insert into public.keepalive (id)
values (1)
on conflict (id) do nothing;

alter table public.keepalive enable row level security;

drop policy if exists "allow anon read keepalive" on public.keepalive;

create policy "allow anon read keepalive"
on public.keepalive
for select
to anon
using (true);

grant usage on schema public to anon;
grant select on public.keepalive to anon;
