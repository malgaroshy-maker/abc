alter table factories enable row level security;
alter table sections enable row level security;
alter table users enable row level security;
alter table machines enable row level security;
alter table lines enable row level security;
alter table engineers enable row level security;
alter table spare_parts enable row level security;
alter table log_entries enable row level security;
alter table log_entry_stoppages enable row level security;
alter table spare_part_usage enable row level security;
alter table todo_items enable row level security;
alter table preventive_maintenance enable row level security;

create or replace function current_profile()
returns users
language sql
stable
security definer
as $$
  select * from users where id = auth.uid()
$$;

create or replace function can_access_section(target_factory uuid, target_section uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from users u
    where u.id = auth.uid()
      and u.factory_id = target_factory
      and (
        u.role = 'admin'
        or (u.section_id = target_section and u.role in ('engineer','supervisor'))
      )
  )
$$;

create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((select role = 'admin' from users where id = auth.uid()), false)
$$;

create policy users_select_self_or_admin on users
for select using (id = auth.uid() or is_admin());

create policy users_update_self_or_admin on users
for update using (id = auth.uid() or is_admin())
with check (id = auth.uid() or is_admin());

create policy sections_by_scope on sections
for all using (can_access_section(factory_id, id))
with check (can_access_section(factory_id, id));

create policy machines_by_scope on machines
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy lines_by_scope on lines
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy engineers_by_scope on engineers
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy spare_parts_by_scope on spare_parts
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy log_entries_by_scope on log_entries
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy stoppage_by_scope on log_entry_stoppages
for all using (
  exists (
    select 1 from log_entries le where le.id = log_entry_id and can_access_section(le.factory_id, le.section_id)
  )
)
with check (
  exists (
    select 1 from log_entries le where le.id = log_entry_id and can_access_section(le.factory_id, le.section_id)
  )
);

create policy usage_by_scope on spare_part_usage
for all using (
  exists (
    select 1 from log_entries le where le.id = log_entry_id and can_access_section(le.factory_id, le.section_id)
  )
)
with check (
  exists (
    select 1 from log_entries le where le.id = log_entry_id and can_access_section(le.factory_id, le.section_id)
  )
);

create policy todo_select_by_scope on todo_items
for select using (can_access_section(factory_id, section_id));

create policy todo_insert_by_scope on todo_items
for insert with check (can_access_section(factory_id, section_id));

create policy todo_update_by_scope on todo_items
for update using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy todo_delete_creator_or_admin on todo_items
for delete using (created_by = auth.uid() or is_admin());

create policy pm_by_scope on preventive_maintenance
for all using (can_access_section(factory_id, section_id))
with check (can_access_section(factory_id, section_id));

create policy factories_admin_only on factories
for all using (is_admin()) with check (is_admin());
