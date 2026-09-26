import business from '../../shared/business.js';
import { scoreLead, fallbackReply, fallbackSummary } from '../../shared/scoring.js';

// Ask the Netlify function (which asks Claude). If it's unreachable
// — local `npm run dev`, rate limited, offline — score with the rules here.
export async function qualifyLead(answers) {
  try {
    const res = await fetch('/api/score-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    if (res.status === 400) {
      const data = await res.json().catch(() => ({}));
      if (data.fields) return { invalid: true, fields: data.fields };
    }
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    if (!data || !data.tier) throw new Error('bad payload');
    return data;
  } catch {
    const result = scoreLead(answers, business);
    return {
      ...result,
      reply: fallbackReply(result, answers, business),
      summary: fallbackSummary(result, answers),
      source: 'rules',
    };
  }
}
