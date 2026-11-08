drop policy if exists "rsvps_admin_delete" on public.rsvps;

create policy "rsvps_admin_delete"
on public.rsvps
for delete
to anon, authenticated
using (private.is_admin_request());
