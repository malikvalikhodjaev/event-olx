create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  supplier_id uuid not null references public.supplier_profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  first_supplier_response_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, service_id)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index conversations_client_idx on public.conversations (client_id, updated_at desc);
create index conversations_supplier_idx on public.conversations (supplier_id, updated_at desc);
create index chat_messages_conversation_idx on public.chat_messages (conversation_id, created_at);

alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;

create policy "conversation parties read"
on public.conversations for select to authenticated
using (
  client_id = (select auth.uid())
  or (select public.is_supplier_member(supplier_id))
  or (select public.is_admin())
);

create policy "clients start conversation"
on public.conversations for insert to authenticated
with check (
  client_id = (select auth.uid())
  and exists (
    select 1
    from public.services service
    join public.supplier_profiles supplier on supplier.id = service.supplier_id
    where service.id = public.conversations.service_id
      and service.supplier_id = public.conversations.supplier_id
      and service.status = 'published'
      and supplier.status = 'active'
  )
);

create policy "conversation parties read messages"
on public.chat_messages for select to authenticated
using (
  exists (
    select 1
    from public.conversations conversation
    where conversation.id = public.chat_messages.conversation_id
      and (
        conversation.client_id = (select auth.uid())
        or (select public.is_supplier_member(conversation.supplier_id))
        or (select public.is_admin())
      )
  )
);

create policy "conversation parties send messages"
on public.chat_messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1
    from public.conversations conversation
    where conversation.id = public.chat_messages.conversation_id
      and (
        conversation.client_id = (select auth.uid())
        or (select public.is_supplier_member(conversation.supplier_id))
      )
  )
);

create policy "conversation parties mark messages read"
on public.chat_messages for update to authenticated
using (
  sender_id <> (select auth.uid())
  and exists (
    select 1
    from public.conversations conversation
    where conversation.id = public.chat_messages.conversation_id
      and (
        conversation.client_id = (select auth.uid())
        or (select public.is_supplier_member(conversation.supplier_id))
      )
  )
)
with check (
  sender_id <> (select auth.uid())
  and exists (
    select 1
    from public.conversations conversation
    where conversation.id = public.chat_messages.conversation_id
      and (
        conversation.client_id = (select auth.uid())
        or (select public.is_supplier_member(conversation.supplier_id))
      )
  )
);

create or replace function public.sync_conversation_after_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations conversation
  set
    updated_at = new.created_at,
    first_supplier_response_at = case
      when conversation.first_supplier_response_at is null
        and (select public.is_supplier_member(conversation.supplier_id))
      then new.created_at
      else conversation.first_supplier_response_at
    end
  where conversation.id = new.conversation_id;
  return new;
end;
$$;

revoke all on function public.sync_conversation_after_message() from public;

create trigger sync_conversation_after_message
after insert on public.chat_messages
for each row execute function public.sync_conversation_after_message();

grant select, insert on public.conversations to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant update (read_at) on public.chat_messages to authenticated;
