// What crawlers and AI agents read. GPTBot, ClaudeBot and PerplexityBot fetch the HTML but never run
// JavaScript, so on their own they only get an empty #root. Built from content.ts at build time by the
// static-profile plugin in vite.config.ts, so it can't drift from the page.
import { highlights, journey, mcpAudit, nfcSdk, profile, projects, skills } from '../data/content.ts'

const fullName = `${profile.firstName} ${profile.lastName}`
const headline = `${profile.role} chez ${profile.employer}`
const contactReasons = 'Un poste, une mission, ou une question sur MCP et les agents IA'
const mcpTitle = 'mcp-audit, proxy d’audit open source pour le Model Context Protocol'
const nfcTitle = 'SDK NFC pour pièces d’identité'
// Most recent first, the way a CV reads.
const timeline = journey.toReversed()

const esc = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const a = (href: string, label: string) => `<a href="${esc(href)}">${esc(label)}</a>`
const ul = (items: string[]) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`

export const profileHtml = () => `<article class="static-profile">
<header>
<h1>${esc(fullName)}</h1>
<p>${esc(headline)}. ${esc(profile.stack)}. ${esc(profile.focus)}. ${esc(profile.location)}.</p>
<p>${esc(profile.pitch)}</p>
<p>${a(profile.github, 'GitHub')} · ${a(profile.linkedin, 'LinkedIn')} · ${a('/llms.txt', 'Profil en Markdown')}</p>
</header>
<section><h2>En bref</h2>${ul(highlights)}</section>
<section><h2>${esc(nfcTitle)}</h2><p>${esc(nfcSdk.summary)}</p>${ul(nfcSdk.facts)}</section>
<section><h2>${esc(mcpTitle)}</h2><p>${esc(mcpAudit.summary)}</p>
<ul>${mcpAudit.facts.map((f) => `<li><strong>${esc(f.value)}</strong> ${esc(f.label)}</li>`).join('')}</ul>
${ul(mcpAudit.features)}
${mcpAudit.ecosystem.map((p) => `<p>${esc(p)}</p>`).join('')}
<p>${a(mcpAudit.repo, 'Voir mcp-audit sur GitHub')}</p></section>
<section><h2>Parcours</h2>
${timeline.map((s) => `<h3>${esc(s.title)}</h3><p>${esc(s.period)}. ${esc(s.summary)}</p>${s.points.length ? ul(s.points) : ''}`).join('\n')}
</section>
<section><h2>Projets</h2>
${projects
  .map(
    (p) =>
      `<h3>${esc(p.name)}</h3><p>${esc(p.pitch)} ${esc(p.proof)}.</p><p>${esc(p.detail)}</p>` +
      `<p>Stack : ${esc(p.stack.join(', '))}. ${p.links.map((l) => a(l.href, l.label)).join(' · ')}</p>`,
  )
  .join('\n')}
</section>
<section><h2>Compétences</h2><dl>${skills.map((s) => `<dt>${esc(s.area)}</dt><dd>${esc(s.items)}</dd>`).join('')}</dl></section>
<section><h2>Contact</h2><p>${esc(contactReasons)} : écrivez-moi sur ${a(profile.linkedin, 'LinkedIn')}. Tout mon code public est sur ${a(profile.github, 'GitHub')}.</p></section>
</article>`

// https://llmstxt.org: a Markdown file at the root, written for language models.
export const llmsTxt = () =>
  [
    `# ${fullName}`,
    '',
    `> ${headline}. ${profile.pitch}`,
    '',
    `${profile.focus}. ${profile.stack}. Basé à ${profile.location}. ${profile.school}.`,
    '',
    '## En bref',
    '',
    ...highlights.map((h) => `- ${h}`),
    '',
    `## ${nfcTitle}`,
    '',
    nfcSdk.summary,
    '',
    ...nfcSdk.facts.map((f) => `- ${f}`),
    '',
    `## ${mcpTitle}`,
    '',
    mcpAudit.summary,
    '',
    ...mcpAudit.facts.map((f) => `- **${f.value}** ${f.label}`),
    ...mcpAudit.features.map((f) => `- ${f}`),
    '',
    ...mcpAudit.ecosystem.flatMap((p) => [p, '']),
    `Code source : ${mcpAudit.repo}`,
    '',
    '## Parcours',
    '',
    ...timeline.flatMap((s) => [
      `### ${s.title}`,
      '',
      `${s.period}. ${s.summary}`,
      '',
      ...(s.points.length ? [...s.points.map((p) => `- ${p}`), ''] : []),
    ]),
    '## Projets',
    '',
    ...projects.flatMap((p) => [
      `### ${p.name}`,
      '',
      `${p.pitch} ${p.proof}. ${p.detail}`,
      '',
      `Stack : ${p.stack.join(', ')}.`,
      ...p.links.map((l) => `- [${l.label}](${l.href})`),
      '',
    ]),
    '## Compétences',
    '',
    ...skills.map((s) => `- **${s.area}** : ${s.items}`),
    '',
    '## Liens',
    '',
    `- [Portfolio](${profile.site}): version interactive de ce profil, démos NFC et mcp-audit comprises`,
    `- [GitHub](${profile.github}): tout le code public`,
    `- [LinkedIn](${profile.linkedin}): ${contactReasons.toLowerCase()}`,
    '',
  ].join('\n')

export const jsonLd = () => {
  const person = `${profile.site}#person`
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': profile.site,
        url: profile.site,
        name: `${fullName}, ${profile.role}`,
        inLanguage: 'fr-FR',
        mainEntity: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: fullName,
        givenName: profile.firstName,
        familyName: profile.lastName,
        alternateName: profile.handle,
        jobTitle: profile.role,
        description: profile.pitch,
        url: profile.site,
        image: `${profile.github}.png`,
        worksFor: { '@type': 'Organization', name: profile.employer, url: profile.employerUrl },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'EPITECH Paris' },
        address: { '@type': 'PostalAddress', addressLocality: profile.location, addressCountry: 'FR' },
        knowsLanguage: ['fr', 'en'],
        knowsAbout: [
          ...new Set([
            ...skills.filter((s) => s.area !== 'Langues').flatMap((s) => s.items.split(', ')),
            'KYC / KYB',
            'ICAO 9303',
            'IA agentique',
          ]),
        ],
        sameAs: [profile.github, profile.linkedin],
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'mcp-audit',
        description: mcpAudit.summary,
        codeRepository: mcpAudit.repo,
        programmingLanguage: 'Go',
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        author: { '@id': person },
      },
      ...projects.map((p) => {
        const repo = p.links.find((l) => l.href.startsWith('https://github.com/'))?.href
        return {
          '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
          name: p.name,
          description: `${p.pitch} ${p.detail}`,
          url: p.links[0].href,
          ...(repo && { codeRepository: repo }),
          keywords: p.stack.join(', '),
          author: { '@id': person },
        }
      }),
    ],
  }
  // Inside a <script>, a "</script>" in the data would end it early.
  return JSON.stringify(graph).replaceAll('<', '\\u003c')
}

export const robotsTxt = () =>
  `# Everyone is welcome, AI crawlers included. The page needs JavaScript, but its whole content
# is also in the HTML and in /llms.txt.
User-agent: *
Allow: /

Sitemap: ${profile.site}sitemap.xml
`

export const sitemapXml = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${profile.site}</loc></url>
</urlset>
`
