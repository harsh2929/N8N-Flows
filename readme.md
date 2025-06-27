# The Transcription Times – Automated Newsletter System

**Live newsletter** → <https://harsh-kumar-4.kit.com/posts/>  
**Subscribe** → <https://harsh-kumar-4.kit.com/subscribe>

### Tech stack
| Layer | Tool |
|-------|------|
| Ingestion | n8n RSS / HTTP (7 sources) |
| AI curation & writing | Google Gemini 2 Flash |
| Storage | Supabase (Postgres) |
| Email | ConvertKit (v4) |
| Automation | n8n Cloud |
| Monitoring | Slack + Supabase dashboard |

### Local setup
```bash
pnpm i
# import the three JSON workflows in n8n
cp .env.sample .env      # fill keys
ts-node scripts/backfill.ts --days 9   # optional
