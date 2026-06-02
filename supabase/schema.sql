-- ============================================================
-- Humans — схема базы данных для Supabase
-- Запусти этот скрипт целиком в Supabase → SQL Editor (одним прогоном).
-- Безопасно запускать повторно: используются IF NOT EXISTS / on conflict.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- users — пользователи Mini App (берутся из Telegram)
-- ============================================================
create table if not exists public.users (
  telegram_id  bigint primary key,
  first_name   text not null,
  last_name    text,
  username     text,
  photo_url    text,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- ============================================================
-- channels — каталог каналов (добавляет администратор)
-- ============================================================
create table if not exists public.channels (
  id          uuid primary key default gen_random_uuid(),
  username    text not null unique,
  title       text not null,
  category    text not null check (category in ('crypto', 'news', 'pro', 'blog')),
  niche       text not null default '',
  description text not null default '',
  subscribers bigint not null default 0,
  tags        text[] not null default '{}',
  verified    boolean not null default false,
  avatar_url  text,
  created_by  bigint references public.users (telegram_id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists channels_category_idx on public.channels (category);
create index if not exists channels_subscribers_idx on public.channels (subscribers desc);

-- ============================================================
-- people — анкеты раздела «Люди»
-- ============================================================
create table if not exists public.people (
  id          uuid primary key default gen_random_uuid(),
  telegram_id bigint references public.users (telegram_id) on delete set null,
  name        text not null,
  username    text,
  goal        text not null,
  interests   text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists people_created_at_idx on public.people (created_at desc);

-- ============================================================
-- Row Level Security
-- Каталог каналов и анкеты читаются публично (через anon-ключ).
-- Запись идёт только через сервер с service role (он обходит RLS),
-- предварительно проверяя Telegram initData. Поэтому для anon
-- открываем только SELECT, а на users — ничего.
-- ============================================================
alter table public.channels enable row level security;
alter table public.people   enable row level security;
alter table public.users    enable row level security;

drop policy if exists "channels public read" on public.channels;
create policy "channels public read"
  on public.channels for select
  using (true);

drop policy if exists "people public read" on public.people;
create policy "people public read"
  on public.people for select
  using (true);

-- ============================================================
-- Storage — публичный бакет для аватарок каналов.
-- Бакет публичный, поэтому файлы отдаются по прямому URL без RLS-политики.
-- Отдельную SELECT-политику на storage.objects НЕ создаём: для публичного
-- бакета она не нужна и лишь разрешила бы листинг всех файлов.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- ============================================================
-- (Опционально) Демонстрационные данные.
-- Удали этот блок, если хочешь начать с пустого каталога.
-- ============================================================
insert into public.channels (username, title, category, niche, description, subscribers, tags, verified) values
  ('bitcoin',    'Bitcoin',      'crypto', 'Криптовалюта',   'Главные новости биткоина и крипторынка: курсы, движения китов, регуляции и техника.', 1800000, array['GLOBAL'],        true),
  ('forklog',    'ForkLog',      'crypto', 'Криптовалюта',   'Издание о криптовалютах, блокчейне и децентрализованных финансах.',                  1120000, array['CIS'],           false),
  ('defipulse',  'DeFi Pulse',   'crypto', 'DeFi',           'Протоколы, доходность, ончейн-метрики и разбор новых запусков в DeFi.',              1040000, array['GLOBAL'],        false),
  ('breaking',   'Breaking News','news',   'Новости',        'Срочные международные новости в реальном времени, без воды.',                        2400000, array['GLOBAL'],        true),
  ('worldtoday', 'World Today',  'news',   'Новости',        'Политика, экономика и общество — обзор главного за день.',                           1650000, array['GLOBAL'],        false),
  ('durov',      'Pavel Durov',  'pro',    'Технологии',     'Личный канал основателя Telegram о приватности, продукте и свободе.',                1530000, array['GLOBAL'],        true),
  ('roxman',     'Roxman',       'pro',    'Контент / медиа','Заметки о медиа, продакшене и жизни за кадром от известного блогера.',               940000,  array['CIS','GLOBAL'],  true),
  ('maxim',      'Maxim',        'pro',    'Бизнес',         'Предпринимательство, продукты и личная эффективность без инфоцыганства.',            610000,  array['CIS'],           false),
  ('devnotes',   'Dev Notes',    'blog',   'Разработка',     'Дневник самоучки: Python, проекты и путь к первой работе в IT.',                     48200,   array['CIS'],           false),
  ('studyflow',  'Study Flow',   'blog',   'Образование',    'Как учиться эффективно: системы, заметки и привычки.',                               21400,   array['CIS'],           false),
  ('minimallife','Minimal Life', 'blog',   'Лайфстайл',      'Минимализм, фокус и осознанное потребление в эпоху шума.',                           12900,   array['GLOBAL'],        false)
on conflict (username) do nothing;

insert into public.people (name, username, goal, interests) values
  ('Амир', 'amir_codes', 'Ищу напарника для пет-проекта на Next.js', array['Frontend', 'Telegram Mini Apps', 'Дизайн']),
  ('Дина', 'dina_ml',    'Собираю команду для соревнований по ML',    array['Python', 'ML', 'Kaggle']),
  ('Тимур', null,        'Хочу найти единомышленников по крипте и трейдингу', array['Crypto', 'DeFi', 'Аналитика']);
