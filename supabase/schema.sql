-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Locker item type enum
create type public.locker_item_type as enum (
  'code_snippet',
  'shell_command',
  'ai_prompt',
  'agent_skill',
  'project_idea',
  'config',
  'debug_fix',
  'note'
);

-- Locker items
create table public.locker_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  content text not null,
  item_type public.locker_item_type not null default 'note',
  language text,
  framework text,
  source_url text,
  is_favorite boolean not null default false,
  is_archived boolean not null default false,
  copy_count integer not null default 0,
  last_copied_at timestamptz,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(language, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(framework, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tags
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique(user_id, slug)
);

-- Many-to-many: items <-> tags
create table public.locker_item_tags (
  locker_item_id uuid not null references public.locker_items(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (locker_item_id, tag_id)
);

-- Collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

-- Many-to-many: items <-> collections
create table public.locker_item_collections (
  locker_item_id uuid not null references public.locker_items(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (locker_item_id, collection_id)
);

-- Usage events
create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  locker_item_id uuid not null references public.locker_items(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'copy', 'edit', 'export')),
  created_at timestamptz not null default now()
);

-- Indexes
create index locker_items_user_id_idx on public.locker_items(user_id);
create index locker_items_type_idx on public.locker_items(item_type);
create index locker_items_favorite_idx on public.locker_items(is_favorite);
create index locker_items_search_idx on public.locker_items using gin(search_vector);
create index tags_user_id_idx on public.tags(user_id);
create index usage_events_user_id_idx on public.usage_events(user_id);

-- Profile creation trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Updated at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger set_locker_items_updated_at
before update on public.locker_items
for each row execute procedure public.set_updated_at();

create trigger set_collections_updated_at
before update on public.collections
for each row execute procedure public.set_updated_at();

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.locker_items enable row level security;
alter table public.tags enable row level security;
alter table public.locker_item_tags enable row level security;
alter table public.collections enable row level security;
alter table public.locker_item_collections enable row level security;
alter table public.usage_events enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can CRUD own locker items" on public.locker_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can CRUD own tags" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can CRUD own collections" on public.collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can CRUD own usage events" on public.usage_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own locker item tags" on public.locker_item_tags for all
using (
  exists (select 1 from public.locker_items where locker_items.id = locker_item_tags.locker_item_id and locker_items.user_id = auth.uid())
  and exists (select 1 from public.tags where tags.id = locker_item_tags.tag_id and tags.user_id = auth.uid())
)
with check (
  exists (select 1 from public.locker_items where locker_items.id = locker_item_tags.locker_item_id and locker_items.user_id = auth.uid())
  and exists (select 1 from public.tags where tags.id = locker_item_tags.tag_id and tags.user_id = auth.uid())
);

create policy "Users can manage own locker item collections" on public.locker_item_collections for all
using (
  exists (select 1 from public.locker_items where locker_items.id = locker_item_collections.locker_item_id and locker_items.user_id = auth.uid())
  and exists (select 1 from public.collections where collections.id = locker_item_collections.collection_id and collections.user_id = auth.uid())
)
with check (
  exists (select 1 from public.locker_items where locker_items.id = locker_item_collections.locker_item_id and locker_items.user_id = auth.uid())
  and exists (select 1 from public.collections where collections.id = locker_item_collections.collection_id and collections.user_id = auth.uid())
);
