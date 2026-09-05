create table public.estimate_revisions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  revision_number integer not null check (revision_number > 0),
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_role text not null check (author_role in ('client', 'supplier')),
  event_date date not null,
  city text not null check (char_length(city) between 2 and 120),
  guest_count integer not null check (guest_count between 1 and 10000),
  note text not null default '' check (char_length(note) <= 1500),
  currency text not null default 'UZS' check (currency = 'UZS'),
  lines jsonb not null check (jsonb_typeof(lines) = 'array' and jsonb_array_length(lines) between 1 and 50),
  total numeric(18,2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  unique (conversation_id, revision_number)
);

create index estimate_revisions_conversation_idx
on public.estimate_revisions (conversation_id, revision_number);

alter table public.estimate_revisions enable row level security;

create policy "conversation parties read estimate revisions"
on public.estimate_revisions for select to authenticated
using (
  exists (
    select 1
    from public.conversations conversation
    where conversation.id = public.estimate_revisions.conversation_id
      and (
        conversation.client_id = (select auth.uid())
        or (select public.is_supplier_member(conversation.supplier_id))
        or (select public.is_admin())
      )
  )
);

create or replace function public.create_estimate_revision(
  p_conversation_id uuid,
  p_event_date date,
  p_city text,
  p_guest_count integer,
  p_note text,
  p_lines jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_conversation public.conversations%rowtype;
  next_revision integer;
  author_role_value text;
  line jsonb;
  line_quantity numeric;
  line_unit_price numeric;
  calculated_total numeric := 0;
  revision_id uuid;
begin
  select * into target_conversation
  from public.conversations
  where id = p_conversation_id
  for update;

  if not found then
    raise exception 'conversation_not_found';
  end if;

  if target_conversation.client_id = (select auth.uid()) then
    author_role_value := 'client';
  elsif (select public.is_supplier_member(target_conversation.supplier_id)) then
    author_role_value := 'supplier';
  else
    raise exception 'estimate_access_denied';
  end if;

  if p_event_date is null
    or char_length(trim(coalesce(p_city, ''))) not between 2 and 120
    or p_guest_count is null
    or p_guest_count not between 1 and 10000
    or char_length(coalesce(p_note, '')) > 1500
    or p_lines is null
    or jsonb_typeof(p_lines) <> 'array'
  then
    raise exception 'invalid_estimate_header';
  end if;

  if jsonb_array_length(p_lines) not between 1 and 50 then
    raise exception 'invalid_estimate_line_count';
  end if;

  for line in select value from jsonb_array_elements(p_lines)
  loop
    begin
      line_quantity := (line ->> 'quantity')::numeric;
      line_unit_price := (line ->> 'unitPrice')::numeric;
    exception when invalid_text_representation or numeric_value_out_of_range then
      raise exception 'invalid_estimate_line_number';
    end;

    if jsonb_typeof(line) <> 'object'
      or char_length(trim(coalesce(line ->> 'title', ''))) not between 2 and 180
      or char_length(trim(coalesce(line ->> 'unit', ''))) not between 1 and 60
      or line_quantity <= 0
      or line_unit_price < 0
    then
      raise exception 'invalid_estimate_line';
    end if;
    calculated_total := calculated_total + round(line_quantity * line_unit_price, 2);
  end loop;

  select coalesce(max(revision_number), 0) + 1 into next_revision
  from public.estimate_revisions
  where conversation_id = p_conversation_id;

  insert into public.estimate_revisions (
    conversation_id,
    revision_number,
    author_id,
    author_role,
    event_date,
    city,
    guest_count,
    note,
    lines,
    total
  ) values (
    p_conversation_id,
    next_revision,
    (select auth.uid()),
    author_role_value,
    p_event_date,
    trim(p_city),
    p_guest_count,
    trim(coalesce(p_note, '')),
    p_lines,
    calculated_total
  ) returning id into revision_id;

  update public.conversations
  set
    updated_at = now(),
    first_supplier_response_at = case
      when author_role_value = 'supplier' and first_supplier_response_at is null then now()
      else first_supplier_response_at
    end
  where id = p_conversation_id;

  return revision_id;
end;
$$;

revoke all on function public.create_estimate_revision(uuid, date, text, integer, text, jsonb) from public;
grant execute on function public.create_estimate_revision(uuid, date, text, integer, text, jsonb) to authenticated;
grant select on public.estimate_revisions to authenticated;
