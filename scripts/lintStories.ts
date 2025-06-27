import 'dotenv/config';
import fetch from 'node-fetch';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;
const table = 'newsletters';
const lookback = 7; // days

async function main() {
  const since = new Date(Date.now() - lookback * 86_400_000).toISOString();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?sent_at=gt.${since}&select=id,subject,stories`,
    {
      headers: {
        apiKey: SUPABASE_SERVICE_ROLE!,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`
      }
    }
  );

  const rows = (await res.json()) as Array<{ id: string; subject: string; stories: string }>;
  const bad: Array<{ newsletter: string; url: string; status: number | string }> = [];

  for (const row of rows) {
    const stories = JSON.parse(row.stories || '[]');
    for (const { url } of stories) {
      try {
        const r = await fetch(url, { method: 'HEAD', redirect: 'follow', timeout: 8000 });
        if (r.status >= 400) bad.push({ newsletter: row.subject, url, status: r.status });
      } catch (e) {
        bad.push({ newsletter: row.subject, url, status: 'timeout' });
      }
    }
  }

  if (bad.length === 0) {
    console.log('✅  All recent links look good!');
  } else {
    console.table(bad);
    process.exitCode = 1;
  }
}

main().catch((e) => console.error(e));
