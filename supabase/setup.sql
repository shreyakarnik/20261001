-- =========================================================
-- PFX internal tool: Supabase setup (blog)
-- ---------------------------------------------------------
-- Run once: Supabase dashboard -> SQL Editor -> New query ->
-- paste this whole file -> Run. Safe to run again.
--
-- What it creates:
--   * public.team       the email addresses allowed to use the
--                       internal tool (add your team at the bottom)
--   * public.posts      blog posts (draft or published)
--   * blog-images       public storage bucket for post images
--   * access rules      anyone can READ published posts; only
--                       people on the team list can write
-- =========================================================

-- ---------- team allow-list ----------
create table if not exists public.team (
  email text primary key,
  added_at timestamptz not null default now()
);
alter table public.team enable row level security;
-- No policies on purpose: the list can't be read or changed from a web page.

create or replace function public.is_team()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.team
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_team() from public;
grant execute on function public.is_team() to anon, authenticated;

-- ---------- blog posts ----------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title      text not null default '',
  excerpt    text not null default '',
  body       text not null default '',
  image      text,
  author     text not null default 'PFX Team',
  tags       text[] not null default '{}',
  date       date not null default current_date,
  status     text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text default (auth.jwt() ->> 'email')
);

create or replace function public.touch_post()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end;
$$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_post();

alter table public.posts enable row level security;

drop policy if exists "Anyone can read published posts" on public.posts;
create policy "Anyone can read published posts" on public.posts
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Team can read all posts" on public.posts;
create policy "Team can read all posts" on public.posts
  for select to authenticated
  using (public.is_team());

drop policy if exists "Team can add posts" on public.posts;
create policy "Team can add posts" on public.posts
  for insert to authenticated
  with check (public.is_team());

drop policy if exists "Team can edit posts" on public.posts;
create policy "Team can edit posts" on public.posts
  for update to authenticated
  using (public.is_team()) with check (public.is_team());

drop policy if exists "Team can delete posts" on public.posts;
create policy "Team can delete posts" on public.posts
  for delete to authenticated
  using (public.is_team());

grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;

-- ---------- image storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Team can upload blog images" on storage.objects;
create policy "Team can upload blog images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_team());

drop policy if exists "Team can change blog images" on storage.objects;
create policy "Team can change blog images" on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-images' and public.is_team());

drop policy if exists "Team can delete blog images" on storage.objects;
create policy "Team can delete blog images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_team());

-- ---------- YOUR TEAM ----------
-- Put the email of everyone who should be able to post here,
-- then create a login for each one under Authentication -> Users.
insert into public.team (email) values
  ('your.email@example.com')   -- <- replace with your login email; add more lines like this one
on conflict (email) do nothing;
