-- seed_newsletters.sql
create table if not exists public.newsletters (
  id            uuid primary key default gen_random_uuid(),
  subject       text not null,
  sent_at       timestamptz not null,
  stories       jsonb,
  readability   numeric,
  broadcast_id  bigint,
  open_rate     numeric,
  click_rate    numeric
);

insert into public.newsletters (subject, sent_at, stories, readability, broadcast_id)
values (
  'The Transcription Times – Seed Edition',
  now(),
  '[{"title":"Placeholder","url":"https://example.com","summary":"seed row"}]'::jsonb,
  72.0,
  null
)
on conflict do nothing;
