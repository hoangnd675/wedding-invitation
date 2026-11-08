drop policy if exists "guest_photos_storage_admin_delete" on storage.objects;

create policy "guest_photos_storage_admin_delete"
on storage.objects
for delete
to anon, authenticated
using (
  bucket_id = 'guest-photos'
  and private.is_admin_request()
);
