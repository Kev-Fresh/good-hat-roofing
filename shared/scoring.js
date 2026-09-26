// Rules-based scoring. The AI builds on top of this; if the AI is
// unavailable, this alone scores the lead so the demo never breaks.

export function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function estimateText(job) {
  if (!job) return '$10,000–14,000';
  return `${money(job.estLow)}–${money(job.estHigh).slice(1)}`;
}

export function tierFor(points, business) {
  if (points >= business.tiers.hot) return 'HOT';
  if (points >= business.tiers.warm) return 'WARM';
  return 'COLD';
}

function fmt(n) {
  if (n > 0) return '+' + n;
  if (n < 0) return '−' + Math.abs(n);
  return '0';
}

export function findOption(business, field, id) {
  return business.form[field].options.find((o) => o.id === id) || null;
}

export function areaMatch(area, business) {
  const text = (area || '').toLowerCase();
  return business.serviceArea.find((town) => text.includes(town.toLowerCase())) || null;
}

export function scoreLead(answers, business) {
  const job = findOption(business, 'job', answers.job);
  const timeline = findOption(business, 'timeline', answers.timeline);
  const insurance = findOption(business, 'insurance', answers.insurance);

  const breakdown = [];
  if (job) breakdown.push({ label: job.label, points: job.points, display: fmt(job.points) });
  if (timeline) breakdown.push({ label: `Timeline: ${timeline.label}`, points: timeline.points, display: fmt(timeline.points) });
  if (insurance) breakdown.push({ label: `Insurance: ${insurance.label}`, points: insurance.points, display: fmt(insurance.points) });

  const town = areaMatch(answers.area, business);
  breakdown.push({
    label: town ? `In service area (${town})` : 'Service area: confirm on call',
    points: 0,
    display: town ? 'OK' : '?',
  });

  const points = breakdown.reduce((sum, b) => sum + b.points, 0);
  const tier = tierFor(points, business);

  return {
    points,
    tier,
    breakdown,
    estimate: estimateText(job),
    estimateMid: job ? (job.estLow + job.estHigh) / 2 : 12000,
    jobLabel: job ? job.label : 'General question',
  };
}

export function fallbackReply(result, answers, business) {
  const thanks = (answers.name || '').trim() ? `Thanks, ${firstName(answers.name)}.` : 'Thanks for reaching out.';
  const job = findOption(business, 'job', answers.job);
  const opener = {
    HOT: "That sounds like it shouldn't wait, so we've flagged it for a quick follow-up.",
    WARM: 'We got your request and someone from our team will follow up.',
    COLD: "No rush. Here's some info to help you plan.",
  }[result.tier];
  const phrase = job ? job.phrase : 'roof work';
  const [low, high] = result.estimate.split('–');
  return `${thanks} ${opener} For reference, ${phrase} jobs we see often fall somewhere between ${low} and $${high}, but every roof is different and this isn't a quote. The real number depends on what we find. If you'd like an inspection, ${business.inspectionSlots.join(' and ')} are open. We'll confirm with you before anything is booked.`;
}

export function fallbackSummary(result, answers) {
  const bits = [result.jobLabel];
  if (answers.area) bits.push(answers.area);
  return `${bits.join(' · ')}. Scored ${result.tier.toLowerCase()} on your rules.`;
}

export function firstName(name) {
  return (name || '').trim().split(/\s+/)[0] || 'neighbor';
}
