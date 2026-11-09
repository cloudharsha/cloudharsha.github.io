// Generates certifications.md and study-guides.md for cloudharsha.github.io
// from the get-your-cert build output. Only links URLs present in the live sitemap.
// Usage: node gen-pages.mjs <get-your-cert repo> <sitemap urls.txt> <out dir>
import fs from 'node:fs';
import path from 'node:path';

const [repo, urlsFile, out] = process.argv.slice(2);
const SITE = 'https://getyourcert.org';
const live = new Set(fs.readFileSync(urlsFile, 'utf8').split('\n').map((u) => u.trim()).filter(Boolean));
const certs = JSON.parse(fs.readFileSync(path.join(repo, 'webapp/public/questions/index.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(repo, 'webapp/public/guides/index.json'), 'utf8'));
const exams = fs.readdirSync(path.join(repo, 'webapp/public/exams')).filter((f) => /-\d+\.json$/.test(f));

const examCount = (c) => exams.filter((f) => f.replace(/-\d+\.json$/, '') === c).length;
const certBy = Object.fromEntries(certs.map((c) => [c.cert, c]));
const isLive = (p) => live.has(SITE + p);
const esc = (s) => s.replace(/\|/g, '\\|');

const GROUPS = [
  ['aws', 'AWS', 'Amazon Web Services certifications, from Cloud Practitioner to Professional.'],
  ['azure', 'Microsoft Azure', 'Azure fundamentals, administrator, architect and AI certifications.'],
  ['gcp', 'Google Cloud', 'Google Cloud associate, professional and generative AI certifications.'],
  ['cncf', 'Kubernetes (CNCF)', 'The CNCF Kubernetes exams: CKA, CKAD and CKS.'],
  ['genai', 'Generative AI', 'Certifications on large language models, agents and AI skills.'],
  ['mlops', 'MLOps', 'Machine learning engineering and operations certifications.'],
];
const TOPICS = [
  ['general-it', 'General IT'],
  ['interview', 'Interview preparation'],
  ['other', 'Other topics'],
];

const guidesFor = (code) => guides.filter((g) => g.certs.includes(code) && isLive(`/guides/${g.slug}`))
  .sort((a, b) => a.certs.length - b.certs.length || a.title.localeCompare(b.title));

// ---------- certifications.md ----------
let c = `---
title: Free certification practice questions
permalink: /certifications/
description: >-
  Free practice questions, timed mock exams and study guides for AWS, Azure, Google Cloud,
  Kubernetes, generative AI and MLOps certifications, on getyourcert.org.
---

# Free certification practice questions

Every certification below has free practice tests on [Get Your Cert](${SITE}/), an independent
study site. Each question has its own page with the answer and a full explanation of why each
option is right or wrong. No sign-up is needed. Some exams also have a full-length timed mock exam
that copies the real exam's length, time limit and domain weights.

The same questions are in the Get Your Cert Android app, which works fully offline.

`;
for (const [vendor, name, blurb] of GROUPS) {
  const list = certs.filter((x) => x.vendor === vendor && x.status === 'active' && isLive(`/cert/${x.cert}`));
  if (!list.length) continue;
  c += `## ${name}\n\n${blurb} All practice questions: [${name} on Get Your Cert](${SITE}/provider/${vendor}).\n\n`;
  c += `| Exam | Practice | Study guides |\n|---|---|---|\n`;
  for (const x of list) {
    const parts = [`${x.questionCount} questions ([list](${SITE}/cert/${x.cert}/questions))`];
    const n = examCount(x.cert);
    if (n) parts.push(n === 1 ? 'a timed mock exam' : `${n} timed mock exams`);
    const g = guidesFor(x.cert).slice(0, 3).map((gg) => `[${esc(gg.title)}](${SITE}/guides/${gg.slug})`);
    c += `| [${esc(x.title)}](${SITE}/cert/${x.cert}) | ${parts.join(', ')} | ${g.join('<br>') || '—'} |\n`;
  }
  c += '\n';
}
c += `## Beyond vendor exams\n\nPractice sets for technical interviews and IT fundamentals, not tied to one exam.\n\n`;
for (const [vendor, name] of TOPICS) {
  const list = certs.filter((x) => x.vendor === vendor && isLive(`/cert/${x.cert}`));
  if (!list.length) continue;
  c += `- **[${name}](${SITE}/provider/${vendor}):** ` +
    list.map((x) => `[${x.title}](${SITE}/cert/${x.cert}/questions)`).join(', ') + '\n';
}
const retired = certs.filter((x) => x.status === 'retired' && isLive(`/cert/${x.cert}`));
if (retired.length) {
  c += `\n## Retired exams\n\nThese exams have closed. Their questions are kept as an archive in [retired exams](${SITE}/provider/retired), with the exam that replaced each one:\n\n`;
  for (const x of retired) {
    c += `- [${x.title}](${SITE}/cert/${x.cert}), retired ${x.retiredOn}${x.successor ? `; replaced by ${x.successor}` : ''}\n`;
  }
}
c += `\nSee also: [all study guides](/study-guides/).\n`;

// ---------- study-guides.md ----------
const vendorOf = (g) => {
  const vs = new Set(g.certs.map((code) => certBy[code]?.vendor).filter(Boolean));
  if (vs.size > 1) return 'choosing';
  return [...vs][0] || 'other';
};
const GUIDE_GROUPS = [['choosing', 'Choosing a certification and career paths', ''], ...GROUPS, ['general-it', 'Interview and IT skills', ''], ['interview', 'Interview and IT skills', ''], ['other', 'Interview and IT skills', '']];
let s = `---
title: Certification study guides
permalink: /study-guides/
description: >-
  Free long-form study guides for AWS, Azure, Google Cloud, Kubernetes, AI and MLOps
  certification exams, each linked to practice questions on getyourcert.org.
---

# Certification study guides

Long-form guides from [Get Your Cert](${SITE}/guides), each on one topic the exams test heavily or
one decision people get stuck on, such as which certification to take next. Every guide links to
practice questions on the same topic.

_List updated ${new Date().toISOString().slice(0, 10)}._

`;
const seen = new Set();
const byHeading = new Map();
for (const g of guides) {
  if (!isLive(`/guides/${g.slug}`)) continue;
  const v = vendorOf(g);
  const heading = (GUIDE_GROUPS.find(([k]) => k === v) || [, 'Other'])[1];
  if (!byHeading.has(heading)) byHeading.set(heading, []);
  byHeading.get(heading).push(g);
}
const order = [...new Set(GUIDE_GROUPS.map(([, h]) => h)), 'Other'];
for (const h of order) {
  const list = byHeading.get(h);
  if (!list || seen.has(h)) continue;
  seen.add(h);
  list.sort((a, b) => a.title.localeCompare(b.title));
  s += `## ${h}\n\n`;
  for (const g of list) s += `- **[${g.title}](${SITE}/guides/${g.slug})**: ${g.description}\n`;
  s += '\n';
}
s += `See also: [practice questions for every certification](/certifications/).\n`;

fs.writeFileSync(path.join(out, 'certifications.md'), c);
fs.writeFileSync(path.join(out, 'study-guides.md'), s);
const linked = (c + s).match(/https:\/\/getyourcert\.org[^)\s]*/g);
const bad = linked.filter((u) => !live.has(u));
console.log('links', linked.length, 'unique', new Set(linked).size, 'not in sitemap', [...new Set(bad)]);
console.log('guides listed', [...byHeading.values()].flat().length);
