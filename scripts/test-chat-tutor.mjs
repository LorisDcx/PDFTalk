import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { buildTutorPrompt, selectTutorProfile } from '../src/lib/chat-tutor.ts'

const thermodynamics = selectTutorProfile(
  'Tu me fais cet exercice ? Compression adiabatique et isotherme : calculer le travail, Q et ΔU.',
  '[[PAGE 1]] V1=8 L, V2=5 L, T=27 °C, P1=1 atm, Cp=7 cal K-1 mol-1.',
)
assert.equal(thermodynamics.domain, 'physics')
assert.equal(thermodynamics.intent, 'solve')
assert.equal(thermodynamics.model, 'gpt-5.6-terra')
assert.equal(thermodynamics.reasoningEffort, 'medium')

const prompt = buildTutorPrompt(thermodynamics, '[[PAGE 1]] T=27 °C')
assert.match(prompt, /complete worked solution/)
assert.match(prompt, /established subject knowledge/)
assert.match(prompt, /sign convention/)
assert.match(prompt, /LaTeX/)
assert.match(prompt, /OCR errors/)

const organic = selectTutorProfile('Résous cet exercice de chimie organique', 'Réaction de substitution nucléophile')
assert.equal(organic.domain, 'chemistry')
assert.equal(organic.intent, 'solve')

const overview = selectTutorProfile('Explique le résumé de ce PDF', 'Introduction à la littérature')
assert.equal(overview.intent, 'explain')
assert.equal(overview.model, 'gpt-5-mini')

const rendered = renderToStaticMarkup(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [[rehypeKatex, { trust: false, strict: 'ignore', throwOnError: false }]],
  children: 'La pression vaut $P_2=1{,}60\\,\\mathrm{atm}$.\n\n$$W=\\int_{V_2}^{V_1}P\\,dV$$\n\n| Cas | Travail |\n|---|---:|\n| Isotherme | $3{,}76$ |',
}))
assert.match(rendered, /class="katex"/)
assert.match(rendered, /<table>/)
assert.doesNotMatch(rendered, /\$P_2/)

console.log('Tutor routing, worked-exercise contract and math rendering passed')
