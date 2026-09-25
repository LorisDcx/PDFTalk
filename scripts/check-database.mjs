import { readFileSync } from 'node:fs'
import { lookup } from 'node:dns/promises'

const settings = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter(line => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map(line => {
      const equals = line.indexOf('=')
      return [line.slice(0, equals), line.slice(equals + 1).trim().replace(/^("|')|("|')$/g, '')]
    }),
)

const url = settings.NEXT_PUBLIC_SUPABASE_URL
const anonKey = settings.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey || !settings.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Configuration Supabase incomplète dans .env.local (URL, clé anon ou clé service_role).')
  process.exit(1)
}

let projectUrl
try {
  projectUrl = new URL(url)
  if (projectUrl.protocol !== 'https:') throw new Error('HTTPS requis')
} catch {
  console.error('NEXT_PUBLIC_SUPABASE_URL n’est pas une URL HTTPS valide.')
  process.exit(1)
}

const projectRef = projectUrl.hostname.split('.')[0]
for (const name of ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) {
  const key = settings[name]
  const newKeyPrefix = name === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' ? 'sb_publishable_' : 'sb_secret_'
  if (key.startsWith(newKeyPrefix)) {
    console.log(`${name} : nouveau format reconnu (la référence du projet ne peut être vérifiée qu’en ligne).`)
    continue
  }
  try {
    const claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8'))
    if (claims.ref !== projectRef) {
      console.error(`${name} appartient à un autre projet que ${projectUrl.hostname}.`)
      process.exit(1)
    }
  } catch {
    console.error(`${name} n’est pas un JWT Supabase lisible.`)
    process.exit(1)
  }
}

console.log(`Projet configuré : ${projectUrl.hostname}. Les clés JWT présentes correspondent à cette référence.`)

try {
  await lookup(projectUrl.hostname)
} catch (error) {
  console.error(`DNS indisponible pour ${projectUrl.hostname} (${error.code ?? 'erreur inconnue'}).`)
  console.error('Vérifie dans le tableau de bord Supabase si ce projet existe encore, puis copie son URL et ses nouvelles clés si nécessaire.')
  process.exit(1)
}

const headers = { apikey: anonKey }
for (const [label, endpoint] of [
  ['Auth', '/auth/v1/health'],
  ['Table users', '/rest/v1/users?select=id&limit=0'],
  ['Colonnes de suivi d’essai', '/rest/v1/users?select=trial_pages_processed_today,trial_usage_reset_at&limit=0'],
  ['Texte source des fiches', '/rest/v1/summaries?select=source_text&limit=0'],
  ['Table flashcards', '/rest/v1/flashcards?select=id&limit=0'],
]) {
  try {
    const response = await fetch(new URL(endpoint, projectUrl), {
      headers,
      signal: AbortSignal.timeout(10000),
    })
    console.log(`${label} : HTTP ${response.status}`)
    if (!response.ok) {
      process.exitCode = 1
      if (label === 'Colonnes de suivi d’essai') {
        const detail = await response.json().catch(() => null)
        if (detail?.code && detail?.message) console.error(`${detail.code} : ${detail.message}`)
        console.error('Le schéma users est incomplet. Appliquer supabase/migrations/20260924_align_web_schema.sql dans le SQL Editor du projet Supabase, puis relancer npm run db:check.')
      }
    }
  } catch (error) {
    console.error(`${label} : connexion impossible (${error.cause?.code ?? error.name}).`)
    process.exitCode = 1
  }
}

try {
  const response = await fetch(new URL('/rest/v1/rpc/consume_pages', projectUrl), {
    method: 'POST',
    headers: {
      apikey: settings.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${settings.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_pages: 1,
      p_document: false,
    }),
    signal: AbortSignal.timeout(10000),
  })
  const result = await response.json().catch(() => null)
  console.log(`Fonction de quota : HTTP ${response.status}, résultat ${result}`)
  if (!response.ok || result !== false) process.exitCode = 1
} catch (error) {
  console.error(`Fonction de quota : connexion impossible (${error.cause?.code ?? error.name}).`)
  process.exitCode = 1
}
