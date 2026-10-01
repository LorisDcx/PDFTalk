import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

// Crawl the actual HTTP output, including Next.js metadata, rather than source files.
const origin = (process.argv[2] || 'https://www.cramdesk.com').replace(/\/$/, '')
const reportPath = process.argv[3] || '.next/seo-audit/report.json'
const canonicalOrigin = 'https://www.cramdesk.com'
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]))
}
function links(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0]))
}
async function fetchText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
  return { response, body: await response.text() }
}
const { body: xml, response: sitemapResponse } = await fetchText(`${origin}/sitemap.xml`)
if (!sitemapResponse.ok || !xml.includes('<urlset')) throw new Error('Sitemap unavailable or invalid')
const entries = [...xml.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)].map(match => ({
  url: decode(match[1].match(/<loc>(.*?)<\/loc>/)?.[1] || ''),
  alternates: Object.fromEntries([...match[1].matchAll(/<xhtml:link\b[^>]*>/g)].map(link => attributes(link[0])).map(link => [link.hreflang, link.href])),
}))
const urls = new Set(entries.map(entry => entry.url))
const { body: robots } = await fetchText(`${origin}/robots.txt`)
const rules = robots.split('\n').map(line => line.trim()).filter(line => /^(Disallow|Allow):/i.test(line)).map(line => {
  const [directive, ...rest] = line.split(':')
  const value = rest.join(':').trim()
  const escaped = value.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return { allow: directive.toLowerCase() === 'allow', value, pattern: new RegExp(`^${escaped}`) }
})
function blocked(path) {
  const matching = rules.filter(rule => rule.value && rule.pattern.test(path)).sort((a, b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow))
  return matching.length ? !matching[0].allow : false
}
let cursor = 0
const pages = []
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < entries.length) {
    const entry = entries[cursor++]
    const path = new URL(entry.url).pathname
    try {
      const { response, body } = await fetchText(`${origin}${path}`)
      const tags = links(body)
      const meta = [...body.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]))
      const canonical = tags.find(link => link.rel === 'canonical')?.href
      const alternates = Object.fromEntries(tags.filter(link => link.rel === 'alternate' && link.hreflang).map(link => [link.hreflang, link.href]))
      const title = decode(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
      const description = meta.find(tag => tag.name === 'description')?.content || ''
      const issues = []
      if (response.status !== 200) issues.push(`http:${response.status}`)
      if (new URL(response.url).pathname !== path) issues.push(`redirect:${response.url}`)
      if (canonical?.replace(/\/$/, '') !== entry.url.replace(/\/$/, '')) issues.push(`canonical:${canonical || 'missing'}`)
      if (!title) issues.push('missing-title')
      if (!description) issues.push('missing-description')
      if (meta.some(tag => ['robots', 'googlebot'].includes(tag.name) && /noindex/i.test(tag.content))) issues.push('noindex')
      if (/noindex/i.test(response.headers.get('x-robots-tag') || '')) issues.push('noindex-header')
      if (blocked(path)) issues.push('robots-blocked')
      if (/^\/(dashboard|documents|billing|settings|writer|flashcards|login|signup|forgot-password|reset-password)(\/|$)/.test(path)) issues.push('private-url-in-sitemap')
      const h1Count = [...body.matchAll(/<h1\b/gi)].length
      if (h1Count !== 1) issues.push(`h1:${h1Count}`)
      for (const [language, target] of Object.entries(entry.alternates)) {
        if (!urls.has(target)) issues.push(`alternate-outside-sitemap:${language}:${target}`)
        if (alternates[language]?.replace(/\/$/, '') !== target.replace(/\/$/, '')) issues.push(`alternate-html-mismatch:${language}`)
      }
      const internalLinks = [...body.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href).filter(Boolean).map(href => {
        try { const url = new URL(href, canonicalOrigin); return url.origin === canonicalOrigin ? url.pathname : null } catch { return null }
      }).filter(Boolean)
      pages.push({ url: entry.url, status: response.status, canonical, title, description, h1Count, language: attributes(body.match(/<html\b[^>]*>/i)?.[0] || '').lang, alternates, internalLinks: [...new Set(internalLinks)], issues })
    } catch (error) {
      pages.push({ url: entry.url, issues: [`fetch:${error.message}`] })
    }
  }
}))
for (const entry of entries) {
  for (const [language, target] of Object.entries(entry.alternates)) {
    const counterpart = entries.find(other => other.url === target)
    if (counterpart && JSON.stringify(Object.entries(counterpart.alternates).sort()) !== JSON.stringify(Object.entries(entry.alternates).sort())) {
      pages.find(page => page.url === entry.url).issues.push(`alternate-not-reciprocal:${language}`)
    }
  }
}
const privateChecks = await Promise.all(['/login', '/signup', '/forgot-password', '/reset-password', '/dashboard', '/documents', '/billing', '/flashcards'].map(async path => {
  try {
    const { response, body } = await fetchText(`${origin}${path}`)
    const tags = [...body.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]))
    const noindex = /noindex/i.test(response.headers.get('x-robots-tag') || '') || tags.some(tag => ['robots', 'googlebot'].includes(tag.name) && /noindex/i.test(tag.content))
    return { path, status: response.status, noindex, crawlAllowed: !blocked(path), passed: response.ok && noindex && !blocked(path) }
  } catch (error) { return { path, passed: false, error: error.message } }
}))
// Identical words in two different languages are not a duplicate-title problem.
const duplicateTitles = Object.values(Object.groupBy(pages.filter(page => page.title), page => `${page.language}:${page.title}`)).filter(group => group.length > 1).map(group => ({ title: group[0].title, language: group[0].language, urls: group.map(page => page.url) }))
const summary = { origin, checkedAt: new Date().toISOString(), urls: entries.length, uniqueUrls: urls.size, localizedEntries: entries.filter(entry => Object.keys(entry.alternates).length).length, failedPages: pages.filter(page => page.issues.length).length, failedPrivateChecks: privateChecks.filter(check => !check.passed).length, duplicateTitleGroups: duplicateTitles.length }
await mkdir(dirname(reportPath), { recursive: true })
await writeFile(reportPath, JSON.stringify({ summary, robots, privateChecks, duplicateTitles, pages: pages.sort((a, b) => a.url.localeCompare(b.url)) }, null, 2))
console.log(JSON.stringify({ ...summary, failures: pages.filter(page => page.issues.length).map(({ url, issues }) => ({ url, issues })), privateChecks, duplicateTitles }, null, 2))
if (summary.failedPages || summary.failedPrivateChecks || summary.duplicateTitleGroups || summary.urls !== summary.uniqueUrls) process.exitCode = 1
