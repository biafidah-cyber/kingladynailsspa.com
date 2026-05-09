-- Supabase SQL schema for posts table
-- Run this in your Supabase SQL editor at https://app.supabase.com/project/YOUR_PROJECT/sql

create table if not exists posts (
  id             uuid         primary key default gen_random_uuid(),
  slug           text         unique not null,
  title          text         not null default '',
  description    text         not null default '',
  content        text         not null default '',   -- raw markdown body
  primary_keyword text        not null default '',
  category       text         not null default '',
  tags           text[]       not null default '{}',
  image          text         not null default '/images/default-post.jpg',
  author         text         not null default 'Editorial Team',
  word_count     integer      not null default 0,
  publish_date   date,                               -- null = published immediately
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

-- Full-text search index for admin blog search
create index if not exists posts_title_fts   on posts using gin(to_tsvector('english', title));
create index if not exists posts_content_fts on posts using gin(to_tsvector('english', content));

-- Automatically update updated_at on row update
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger posts_updated_at
  before update on posts
  for each row execute procedure update_updated_at();

-- Row-level security: service role key bypasses all policies
alter table posts enable row level security;
create policy "service_role_all" on posts
  using (true)
  with check (true);

-- ── Subscribers table ─────────────────────────────────────────────────────────

create table if not exists subscribers (
  id             uuid         primary key default gen_random_uuid(),
  email          text         unique not null,
  name           text         not null default '',
  source         text         not null default 'site',
  subscribed_at  timestamptz  not null default now()
);

alter table subscribers enable row level security;
create policy "service_role_all" on subscribers
  using (true)
  with check (true);

-- ── Contacts table ────────────────────────────────────────────────────────────

create table if not exists contacts (
  id             uuid         primary key default gen_random_uuid(),
  name           text         not null,
  email          text         not null,
  message        text         not null,
  submitted_at   timestamptz  not null default now(),
  read           boolean      not null default false
);

create index if not exists contacts_submitted_at_idx on contacts (submitted_at desc);

alter table contacts enable row level security;
create policy "service_role_all" on contacts
  using (true)
  with check (true);

-- ── Comments table ────────────────────────────────────────────────────────────
-- Self-hosted, SEO-crawlable comments on blog posts.
-- New comments start with approved=false — approve in Admin → Leads → Comments.
-- Approved comments are server-rendered in HTML so Google can crawl them.

create table if not exists comments (
  id             uuid         primary key default gen_random_uuid(),
  post_slug      text         not null,
  author_name    text         not null,
  author_email   text         not null,
  body           text         not null,
  submitted_at   timestamptz  not null default now(),
  approved       boolean      not null default false
);

create index if not exists comments_slug_idx         on comments (post_slug);
create index if not exists comments_submitted_at_idx on comments (submitted_at desc);

alter table comments enable row level security;
create policy "service_role_all" on comments
  using (true)
  with check (true);
