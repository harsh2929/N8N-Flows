import 'dotenv/config';
import fetch from 'node-fetch';
import { argv } from 'process';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('❌  SUPABASE_URL or SUPABASE_SERVICE_ROLE not set in .env');
  process.exit(1);
}

const DAYS = Number(argv[argv.indexOf('--days') + 1] || 9);
const table = 'newsletters';

function isoDaysAgo(offset: number) {
  const d = new Date(Date.now() - offset * 86_400_000);
  return d.toISOString();
}

async function backfill() {
  console.log(`🔄  Inserting ${DAYS} backfill rows…`);
  for (let i = DAYS; i >= 1; i--) {
    const body = {
      subject: `The Transcription Times – ${isoDaysAgo(i).slice(0, 10)}`,
      sent_at: isoDaysAgo(i),
      stories: JSON.stringify([{ title: 'Placeholder', url: 'https://example.com' }]),
      readability: 75 + Math.random() * 5,
      broadcast_id: null
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apiKey: SUPABASE_SERVICE_ROLE,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(body)
    });

    if (res.ok) console.log(`✅  Day -${i} inserted`);
    else console.error(`❌  Failed for day -${i}`, await res.text());
  }
}

backfill().catch((e) => {
  console.error(e);
  process.exit(1);
});
