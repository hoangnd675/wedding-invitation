create or replace function private.is_active_wedding_couple(p_couple_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.couples c
    where c.id::text = p_couple_id
      and c.status = 'active'
  );
$$;

revoke all on function private.is_active_wedding_couple(text) from public;
grant execute on function private.is_active_wedding_couple(text) to anon, authenticated;

drop policy if exists guest_photos_storage_public_insert on storage.objects;

create policy guest_photos_storage_public_insert
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'guest-photos'
  and (
    lower(name) like '%.jpg'
    or lower(name) like '%.jpeg'
    or lower(name) like '%.png'
    or lower(name) like '%.webp'
  )
  and private.is_active_wedding_couple(split_part(name, '/', 1))
);
