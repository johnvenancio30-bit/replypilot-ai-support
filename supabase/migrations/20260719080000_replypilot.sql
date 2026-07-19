create extension if not exists pgcrypto;

create table if not exists public.replypilot_knowledge_articles (
  id text primary key,
  title text not null,
  excerpt text not null,
  keywords text[] not null default '{}',
  content text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.replypilot_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  order_number text,
  topic text not null,
  message text not null,
  category text not null check (category in ('shipping','returns','billing','product','account','other')),
  priority text not null check (priority in ('low','normal','high','urgent')),
  sentiment text not null check (sentiment in ('positive','neutral','frustrated','angry')),
  summary text not null,
  confidence integer not null check (confidence between 0 and 100),
  suggested_action text not null,
  draft_subject text not null,
  draft_reply text not null,
  sources jsonb not null default '[]'::jsonb,
  ai_model text not null,
  degraded boolean not null default false,
  status text not null default 'pending_approval' check (status in ('pending_approval','approved','rejected','sent')),
  demo_token_hash text not null,
  email_id text,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.replypilot_ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.replypilot_tickets(id) on delete cascade,
  action text not null,
  actor text not null check (actor in ('customer','ai','agent','system')),
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists replypilot_tickets_created_at_idx on public.replypilot_tickets (created_at desc);
create index if not exists replypilot_tickets_status_idx on public.replypilot_tickets (status, priority);
create index if not exists replypilot_ticket_events_ticket_id_idx on public.replypilot_ticket_events (ticket_id, created_at);

alter table public.replypilot_knowledge_articles enable row level security;
alter table public.replypilot_tickets enable row level security;
alter table public.replypilot_ticket_events enable row level security;

revoke all on public.replypilot_knowledge_articles from anon, authenticated;
revoke all on public.replypilot_tickets from anon, authenticated;
revoke all on public.replypilot_ticket_events from anon, authenticated;

insert into public.replypilot_knowledge_articles (id, title, excerpt, keywords, content) values
('shipping-delays','Shipping and delivery times','Orders process in 1–2 business days. Tracking updates can take 24 hours to appear.',array['shipping','delivery','late','tracking','package','arrive','courier'],'Orders normally process in 1–2 business days. Standard delivery takes 3–5 business days after dispatch. Tracking links may take up to 24 hours to show their first scan. If tracking has not changed for 3 business days, support should open a courier investigation.'),
('returns-policy','30-day returns policy','Unused items can be returned within 30 days of delivery with their original packaging.',array['return','exchange','wrong size','changed mind','send back'],'Unused items in their original packaging may be returned within 30 days of delivery. Support provides a return authorization before the item is shipped back. Final-sale items are excluded unless they arrived damaged or incorrect.'),
('refund-timing','Refund processing','Approved refunds usually reach the original payment method within 5–10 business days.',array['refund','money back','charged','credit','payment'],'After a return is inspected, approved refunds are issued to the original payment method. Banks normally post the credit within 5–10 business days. Support should not promise a specific bank posting date.'),
('damaged-orders','Damaged or incorrect orders','Report damaged or incorrect items within seven days and include a clear photo.',array['damaged','broken','wrong item','missing','defective'],'Customers should report a damaged, defective, missing, or incorrect item within seven days of delivery. Ask for the order number and a clear photo of the item and package label. Support may offer a replacement or refund after verification.'),
('billing-help','Billing and duplicate charges','Pending authorizations usually disappear in 3–5 business days; completed duplicate charges need review.',array['billing','duplicate','charged twice','card','invoice','payment'],'A pending card authorization is not always a completed charge and usually disappears within 3–5 business days. If two charges are both completed, support should verify the order and escalate the duplicate payment for refund review.'),
('account-access','Account access and password reset','Password reset links expire after 30 minutes and should be requested again if expired.',array['account','login','password','reset','email','locked'],'Customers can request a password reset from the sign-in page. Reset links expire after 30 minutes. Support should never request a password or verification code. Repeated access failures require identity verification by an authorized agent.')
on conflict (id) do update set title = excluded.title, excerpt = excluded.excerpt, keywords = excluded.keywords, content = excluded.content, active = true, updated_at = now();

insert into public.replypilot_tickets (
  id,ticket_number,customer_name,customer_email,order_number,topic,message,category,priority,sentiment,summary,confidence,suggested_action,draft_subject,draft_reply,sources,ai_model,status,demo_token_hash,approved_at,sent_at,created_at,updated_at
) values
('e98f532a-2f16-46c1-945c-6359288d28db','RP-1048','Maya Rodriguez','maya@example.com','ORD-78214','Delayed delivery','My tracking has not changed for four days and the package was due yesterday.','shipping','high','frustrated','Delivery is late and tracking has not updated for four days.',94,'Open a courier investigation and update the customer within one business day.','Update on your delayed delivery','Hi Maya,\n\nI’m sorry your delivery is late. Your tracking has been unchanged long enough for us to open a courier investigation.','[{"id":"shipping-delays","title":"Shipping and delivery times","excerpt":"Tracking that has not changed for three business days should be investigated."}]'::jsonb,'gemini-3.5-flash','pending_approval','seed-only',null,null,now()-interval '18 minutes',now()-interval '16 minutes'),
('b8dd8d8b-ce0e-4a4d-a79b-c254e188c67c','RP-1047','Jordan Kim','jordan@example.com','ORD-78191','Duplicate charge','I can see two completed charges for the same order on my card.','billing','urgent','angry','Customer reports two completed card charges for one order.',97,'Verify both transactions and escalate the duplicate payment for refund review.','We’re reviewing the duplicate charge','Hi Jordan,\n\nI’m sorry about the duplicate charge. We’ll verify both completed transactions and escalate the duplicate payment for refund review.','[{"id":"billing-help","title":"Billing and duplicate charges","excerpt":"Completed duplicate charges require verification and refund review."}]'::jsonb,'gemini-3.5-flash','approved','seed-only',now()-interval '12 minutes',null,now()-interval '54 minutes',now()-interval '12 minutes'),
('8ef0d848-fc44-491d-876b-c5cb81b067f1','RP-1046','Alex Thompson','alex@example.com','ORD-78064','Return request','The item is unused and I would like to return it within the return window.','returns','normal','neutral','Customer wants to return an unused item within 30 days.',93,'Confirm delivery date and issue a return authorization.','Your return request','Hi Alex,\n\nYour unused item may be returned within 30 days in its original packaging.','[{"id":"returns-policy","title":"30-day returns policy","excerpt":"Unused items can be returned within 30 days of delivery."}]'::jsonb,'gemini-3.5-flash','sent','seed-only',now()-interval '96 minutes',now()-interval '92 minutes',now()-interval '132 minutes',now()-interval '92 minutes')
on conflict (id) do nothing;

insert into public.replypilot_ticket_events (ticket_id, action, actor, detail, created_at) values
('e98f532a-2f16-46c1-945c-6359288d28db','ticket_created','customer','Support request received',now()-interval '18 minutes'),
('e98f532a-2f16-46c1-945c-6359288d28db','ai_analyzed','ai','Classified as high-priority shipping issue',now()-interval '16 minutes'),
('b8dd8d8b-ce0e-4a4d-a79b-c254e188c67c','agent_approved','agent','Reply approved after billing review',now()-interval '12 minutes'),
('8ef0d848-fc44-491d-876b-c5cb81b067f1','email_sent','system','Approved reply delivered',now()-interval '92 minutes');
