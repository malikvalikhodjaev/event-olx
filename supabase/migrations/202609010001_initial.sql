create extension if not exists pgcrypto;

create type public.app_role as enum ('client', 'client_planner', 'supplier', 'supplier_planner', 'admin');
create type public.supplier_status as enum ('pending', 'active', 'banned');
create type public.service_status as enum ('draft', 'pending', 'published', 'hidden');
create type public.request_status as enum ('submitted', 'viewed', 'accepted_for_discussion', 'declined', 'closed');
create type public.moderation_status as enum ('pending', 'approved', 'changes_requested', 'hidden');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  primary key (profile_id, role)
);

create table public.supplier_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  name text not null check (char_length(name) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  city text not null,
  description text not null default '',
  status public.supplier_status not null default 'pending',
  verified_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.supplier_members (
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null check (role in ('supplier', 'supplier_planner')),
  primary key (supplier_id, profile_id)
);

create table public.categories (
  id uuid primary key,
  slug text not null unique,
  name text not null,
  wedding_required boolean not null default false,
  sort_order integer not null default 0
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  external_id text,
  title text not null check (char_length(title) between 2 and 180),
  description text not null check (char_length(description) between 10 and 2000),
  city text not null,
  price_from numeric(16,2) not null check (price_from >= 0),
  price_unit text not null check (price_unit in ('за услугу', 'за час', 'за гостя', 'за день')),
  status public.service_status not null default 'draft',
  available boolean not null default true,
  availability_confirmed_at timestamptz,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (supplier_id, external_id)
);

create table public.event_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  event_type text not null,
  event_date date,
  city text,
  budget numeric(16,2) not null default 0 check (budget >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.event_plans(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  service_id uuid references public.services(id) on delete set null,
  planned_budget numeric(16,2) not null default 0 check (planned_budget >= 0),
  completed boolean not null default false,
  unique (plan_id, category_id)
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  supplier_id uuid not null references public.supplier_profiles(id),
  service_id uuid not null references public.services(id),
  event_type text not null,
  event_date date not null,
  city text not null,
  guest_count integer not null check (guest_count between 1 and 10000),
  budget numeric(16,2) not null default 0 check (budget >= 0),
  message text not null check (char_length(message) between 10 and 1500),
  contact_name text not null,
  contact_phone text not null,
  status public.request_status not null default 'submitted',
  first_viewed_at timestamptz,
  first_responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  from_status public.request_status,
  to_status public.request_status not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id),
  supplier_id uuid references public.supplier_profiles(id),
  moderator_id uuid not null references public.profiles(id),
  status public.moderation_status not null,
  reason text not null check (char_length(reason) between 5 and 1000),
  created_at timestamptz not null default now(),
  check (service_id is not null or supplier_id is not null)
);

create index services_catalog_idx on public.services (status, category_id, city, updated_at desc);
create index requests_client_idx on public.requests (client_id, created_at desc);
create index requests_supplier_idx on public.requests (supplier_id, status, created_at desc);
create index moderation_actions_service_idx on public.moderation_actions (service_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profile_roles
    where profile_id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_supplier_member(target_supplier_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.supplier_members
    where supplier_id = target_supplier_id and profile_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_supplier_member(uuid) from public;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.is_supplier_member(uuid) to authenticated, anon;

alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.supplier_profiles enable row level security;
alter table public.supplier_members enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.event_plans enable row level security;
alter table public.plan_items enable row level security;
alter table public.requests enable row level security;
alter table public.request_events enable row level security;
alter table public.moderation_actions enable row level security;

create policy "profiles read own or admin" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "roles read own or admin" on public.profile_roles for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy "active suppliers are public" on public.supplier_profiles for select to anon, authenticated using (status = 'active' or (select public.is_supplier_member(id)) or (select public.is_admin()));
create policy "supplier members update profile" on public.supplier_profiles for update to authenticated using ((select public.is_supplier_member(id)) or (select public.is_admin())) with check ((select public.is_supplier_member(id)) or (select public.is_admin()));
create policy "members read own supplier" on public.supplier_members for select to authenticated using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy "categories public read" on public.categories for select to anon, authenticated using (true);
create policy "admins manage categories" on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "published services public" on public.services for select to anon, authenticated using (
  status = 'published' and exists (select 1 from public.supplier_profiles sp where sp.id = supplier_id and sp.status = 'active')
  or (select public.is_supplier_member(supplier_id))
  or (select public.is_admin())
);
create policy "supplier members create services" on public.services for insert to authenticated with check ((select public.is_supplier_member(supplier_id)) and status in ('draft', 'pending'));
create policy "supplier members update services" on public.services for update to authenticated using ((select public.is_supplier_member(supplier_id)) or (select public.is_admin())) with check (((select public.is_supplier_member(supplier_id)) and status in ('draft', 'pending')) or (select public.is_admin()));
create policy "admins delete services" on public.services for delete to authenticated using ((select public.is_admin()));

create policy "owners manage plans" on public.event_plans for all to authenticated using (owner_id = (select auth.uid()) or (select public.is_admin())) with check (owner_id = (select auth.uid()) or (select public.is_admin()));
create policy "owners manage plan items" on public.plan_items for all to authenticated using (exists (select 1 from public.event_plans p where p.id = plan_id and (p.owner_id = (select auth.uid()) or (select public.is_admin())))) with check (exists (select 1 from public.event_plans p where p.id = plan_id and (p.owner_id = (select auth.uid()) or (select public.is_admin()))));

create policy "request parties read" on public.requests for select to authenticated using (client_id = (select auth.uid()) or (select public.is_supplier_member(supplier_id)) or (select public.is_admin()));
create policy "clients create own request" on public.requests for insert to authenticated with check (client_id = (select auth.uid()) and status = 'submitted');
create policy "supplier or admin update request" on public.requests for update to authenticated using ((select public.is_supplier_member(supplier_id)) or (select public.is_admin())) with check ((select public.is_supplier_member(supplier_id)) or (select public.is_admin()));
create policy "request parties read history" on public.request_events for select to authenticated using (exists (select 1 from public.requests r where r.id = request_id and (r.client_id = (select auth.uid()) or (select public.is_supplier_member(r.supplier_id)) or (select public.is_admin()))));
create policy "request parties add history" on public.request_events for insert to authenticated with check (actor_id = (select auth.uid()) and exists (select 1 from public.requests r where r.id = request_id and (r.client_id = (select auth.uid()) or (select public.is_supplier_member(r.supplier_id)) or (select public.is_admin()))));

create policy "admins read moderation" on public.moderation_actions for select to authenticated using ((select public.is_admin()));
create policy "admins append moderation" on public.moderation_actions for insert to authenticated with check ((select public.is_admin()) and moderator_id = (select auth.uid()));
create policy "suppliers read related moderation" on public.moderation_actions for select to authenticated using ((supplier_id is not null and (select public.is_supplier_member(supplier_id))) or (service_id is not null and exists (select 1 from public.services s where s.id = service_id and (select public.is_supplier_member(s.supplier_id)))) or (select public.is_admin()));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.categories, public.supplier_profiles, public.services to anon;
grant select on public.categories, public.supplier_profiles, public.services to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.profile_roles, public.supplier_members to authenticated;
grant update (name, slug, city, description, updated_at) on public.supplier_profiles to authenticated;
grant insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.event_plans, public.plan_items to authenticated;
grant select, insert on public.requests to authenticated;
grant update (status, first_viewed_at, first_responded_at, updated_at) on public.requests to authenticated;
grant select, insert on public.request_events to authenticated;
grant select, insert on public.moderation_actions to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)), new.raw_user_meta_data ->> 'phone');
  insert into public.profile_roles (profile_id, role) values (new.id, 'client');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
