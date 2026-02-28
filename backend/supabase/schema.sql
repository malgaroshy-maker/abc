create extension if not exists "pgcrypto";

create table if not exists factories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists users (
  id uuid primary key references auth.users(id),
  factory_id uuid not null references factories(id),
  section_id uuid references sections(id),
  full_name text not null,
  role text not null check (role in ('engineer','supervisor','admin')),
  language text not null default 'en',
  accent_color text not null default '16 185 129',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists machines (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  machine_code text not null,
  machine_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists lines (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  line_code text not null,
  line_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists engineers (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  user_id uuid references users(id),
  engineer_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists spare_parts (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  sku text not null,
  name text not null,
  unit text not null,
  stock_qty numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists log_entries (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  date date not null,
  shift text not null check (shift in ('night','morning','evening')),
  machine_id uuid not null references machines(id),
  line_ids uuid[] not null,
  engineer_ids uuid[] not null,
  start_time time not null,
  end_time time not null,
  downtime_minutes integer not null default 0,
  work_description text not null,
  notes text not null default '',
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists log_entry_stoppages (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  log_entry_id uuid not null references log_entries(id) on delete cascade,
  start_time time not null,
  end_time time not null,
  minutes integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists spare_part_usage (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  log_entry_id uuid not null references log_entries(id) on delete cascade,
  spare_part_id uuid not null references spare_parts(id),
  quantity numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists todo_items (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  title text not null,
  priority text not null check (priority in ('low','medium','high')),
  completed boolean not null default false,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists preventive_maintenance (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid not null references factories(id),
  section_id uuid not null references sections(id),
  machine_id uuid not null references machines(id),
  yearly_frequency integer not null check (yearly_frequency > 0),
  last_completed date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['factories','sections','users','machines','lines','engineers','spare_parts','log_entries','log_entry_stoppages','spare_part_usage','todo_items','preventive_maintenance']
  loop
    execute format('drop trigger if exists trg_%I_updated_at on %I;', t, t);
    execute format('create trigger trg_%I_updated_at before update on %I for each row execute function set_updated_at();', t, t);
  end loop;
end $$;
