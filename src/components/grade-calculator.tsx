'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, CheckCircle2, Plus, Target, Trash2 } from 'lucide-react'

type GradeRow = { id: string; label: string; grade: string; coefficient: string }

const fieldClass = 'min-h-12 w-full rounded-xl border border-[#ead9cf] bg-white px-4 text-sm text-[#33252b] outline-none transition focus:border-[#c95b3e] focus:ring-2 focus:ring-[#f6d5c5]'
const numberFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })

function parseNumber(value: string) {
  if (!value.trim()) return NaN
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : NaN
}

function initialRows(): GradeRow[] {
  return [{ id: 'grade-1', label: '', grade: '', coefficient: '1' }]
}

export function GradeCalculator() {
  const [rows, setRows] = useState<GradeRow[]>(initialRows)
  const [target, setTarget] = useState('14')
  const [futureCoefficient, setFutureCoefficient] = useState('2')

  const updateRow = (id: string, patch: Partial<GradeRow>) => setRows(current => current.map(row => row.id === id ? { ...row, ...patch } : row))
  const validRows = rows.map(row => ({ ...row, value: parseNumber(row.grade), weight: parseNumber(row.coefficient) }))
    .filter(row => row.grade.trim() && row.value >= 0 && row.value <= 20 && row.weight > 0 && row.weight <= 50)
  const hasInvalidRow = rows.some(row => row.grade.trim() && !validRows.some(valid => valid.id === row.id))
  const weightSum = validRows.reduce((sum, row) => sum + row.weight, 0)
  const weightedSum = validRows.reduce((sum, row) => sum + row.value * row.weight, 0)
  const currentAverage = weightSum ? weightedSum / weightSum : null
  const goal = parseNumber(target)
  const nextWeight = parseNumber(futureCoefficient)
  const validProjection = currentAverage !== null && goal >= 0 && goal <= 20 && nextWeight > 0 && nextWeight <= 50
  const needed = validProjection ? (goal * (weightSum + nextWeight) - weightedSum) / nextWeight : null

  return <section id="calculateur" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
    <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[.96fr_1.04fr] lg:gap-10">
      <div className="rounded-[1.8rem] border border-[#efdcd0] bg-white p-5 shadow-[0_26px_65px_-45px_rgba(120,49,35,.25)] sm:p-8">
        <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe7d8] text-[#b84432]"><Calculator className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b34c37]">Tes notes</p><h2 className="font-editorial text-3xl leading-tight">Ajoute tes résultats</h2></div></div>
        <p className="mt-5 text-sm leading-6 text-[#7f7271]">Sur 20. Les coefficients peuvent être différents pour chaque note.</p>
        <div className="mt-6 space-y-3">{rows.map((row, index) => <div key={row.id} className="rounded-2xl border border-[#efdfd5] bg-[#fffbf8] p-4">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b46e56]">Note {index + 1}</p>{rows.length > 1 && <button type="button" onClick={() => setRows(current => current.filter(item => item.id !== row.id))} aria-label={`Retirer la note ${index + 1}`} className="rounded-lg p-1.5 text-[#9d8a87] hover:bg-[#fce8df] hover:text-[#a73d31]"><Trash2 className="size-4" /></button>}</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.3fr_.7fr_.7fr]">
            <label className="text-xs font-semibold text-[#62565a]">Matière ou devoir<input type="text" value={row.label} maxLength={40} onChange={event => updateRow(row.id, { label: event.target.value })} placeholder="Ex. Contrôle de maths" className={`mt-1.5 ${fieldClass}`} /></label>
            <label className="text-xs font-semibold text-[#62565a]">Note /20<input type="text" inputMode="decimal" value={row.grade} onChange={event => updateRow(row.id, { grade: event.target.value })} placeholder="Ex. 14,5" aria-invalid={!!row.grade.trim() && !(parseNumber(row.grade) >= 0 && parseNumber(row.grade) <= 20)} className={`mt-1.5 ${fieldClass}`} /></label>
            <label className="text-xs font-semibold text-[#62565a]">Coefficient<input type="text" inputMode="decimal" value={row.coefficient} onChange={event => updateRow(row.id, { coefficient: event.target.value })} aria-invalid={!(parseNumber(row.coefficient) > 0 && parseNumber(row.coefficient) <= 50)} className={`mt-1.5 ${fieldClass}`} /></label>
          </div>
        </div>)}</div>
        {rows.length < 20 && <button type="button" onClick={() => setRows(current => [...current, { id: `grade-${Date.now()}`, label: '', grade: '', coefficient: '1' }])} className="mt-4 inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-bold text-[#b84432] hover:text-[#922f28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]"><Plus className="size-4" />Ajouter une note</button>}
        {hasInvalidRow && <p role="alert" className="mt-4 rounded-xl border border-[#efb399] bg-[#fff9f5] p-3 text-sm text-[#963f2e]">Vérifie les notes (de 0 à 20) et les coefficients (supérieurs à 0).</p>}
        <div className="mt-8 border-t border-[#f0dfd5] pt-7"><div className="flex items-center gap-2"><Target className="size-5 text-[#b84432]" aria-hidden="true" /><h3 className="font-editorial text-2xl">Ton objectif</h3></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#493b3e]">Moyenne visée /20<input type="text" inputMode="decimal" value={target} onChange={event => setTarget(event.target.value)} className={`mt-2 ${fieldClass}`} /></label><label className="text-sm font-semibold text-[#493b3e]">Coefficient du prochain devoir<input type="text" inputMode="decimal" value={futureCoefficient} onChange={event => setFutureCoefficient(event.target.value)} className={`mt-2 ${fieldClass}`} /></label></div><p className="mt-3 text-xs leading-5 text-[#8b7a78]">Modifie ces valeurs pour voir la note nécessaire au prochain devoir.</p></div>
        <p className="mt-7 text-xs leading-5 text-[#8b7a78]">Calcul effectué dans ton navigateur. Aucune note n’est envoyée au serveur.</p>
      </div>

      <div aria-live="polite" className="rounded-[1.8rem] border border-[#efdcd0] bg-[#fff4ed] p-5 sm:p-8">
        {currentAverage === null ? <div className="flex min-h-[470px] flex-col justify-center"><span className="flex size-16 items-center justify-center rounded-[1.4rem] bg-white text-[#b84432] shadow-sm"><Target className="size-8" aria-hidden="true" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#b34c37]">Résultat instantané</p><h2 className="font-editorial mt-3 max-w-md text-4xl leading-tight text-[#33252b] sm:text-5xl">Savoir où tu en es, <span className="italic text-[#c25334]">puis où aller.</span></h2><p className="mt-5 max-w-md text-sm leading-7 text-[#756a69]">Saisis une première note pour calculer ta moyenne pondérée et la note à viser au prochain devoir.</p><div className="mt-8 rounded-2xl border border-[#f0dfd5] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b46e56]">Exemple</p><p className="mt-3 text-sm leading-7 text-[#67595b]">14/20 coefficient 2 et 11/20 coefficient 1 donnent une moyenne de <strong className="text-[#b84432]">13/20</strong>.</p></div></div> : <>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b34c37]">Ta moyenne actuelle</p><div className="mt-3 flex items-end gap-1"><strong className="font-editorial text-7xl font-normal leading-none text-[#33252b] sm:text-8xl">{numberFormat.format(currentAverage)}</strong><span className="mb-2 text-xl font-semibold text-[#98766d]">/20</span></div><p className="mt-3 text-sm text-[#796d6a]">Calculée sur {validRows.length} note{validRows.length > 1 ? 's' : ''} et {numberFormat.format(weightSum)} coefficient{weightSum > 1 ? 's' : ''} au total.</p><div className="mt-5 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-[#e97743] to-[#b84432]" style={{ width: `${Math.max(0, Math.min(100, currentAverage / 20 * 100))}%` }} /></div>
          <div className="mt-8 rounded-[1.4rem] bg-[#b84432] p-6 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffe0d0]">Pour atteindre {goal >= 0 && goal <= 20 ? numberFormat.format(goal) : '…'}/20</p>{needed === null ? <p className="font-editorial mt-3 text-3xl">Entre un objectif et un coefficient valides.</p> : needed > 20 ? <><p className="font-editorial mt-3 text-3xl">Pas atteignable en un seul devoir.</p><p className="mt-3 text-sm leading-6 text-[#ffded1]">Il faudrait {numberFormat.format(needed)}/20 au prochain devoir. Répartis l’objectif sur plusieurs évaluations ou ajuste ta cible.</p></> : needed <= 0 ? <><p className="font-editorial mt-3 text-4xl">Objectif déjà assuré.</p><p className="mt-3 text-sm leading-6 text-[#ffded1]">Même avec 0/20 au prochain devoir de ce coefficient, ta moyenne resterait au-dessus de l’objectif.</p></> : <><p className="font-editorial mt-3 text-5xl">{numberFormat.format(needed)}<span className="text-2xl">/20</span></p><p className="mt-3 text-sm leading-6 text-[#ffded1]">C’est la note à obtenir au prochain devoir, avec le coefficient indiqué.</p></>}</div>
          {validProjection && <div className="mt-7"><h3 className="font-editorial text-2xl text-[#33252b]">Et si tu obtiens…</h3><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[10, 12, 14, 16].map(score => <div key={score} className="rounded-xl bg-white p-3 text-center"><p className="text-xs text-[#8a7774]">{score}/20</p><p className="font-editorial mt-1 text-2xl text-[#b84432]">{numberFormat.format((weightedSum + score * nextWeight) / (weightSum + nextWeight))}</p><p className="text-[11px] text-[#8a7774]">moyenne</p></div>)}</div></div>}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#dbe5cf] bg-[#f6f9f2] p-4 text-sm leading-6 text-[#59704f]"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Une moyenne aide à se situer. Pour progresser, repère surtout les notions à revoir avant le prochain devoir.</div>
        </>}
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-5 rounded-[1.5rem] bg-[#33252b] px-6 py-7 text-white sm:px-9"><div><p className="font-editorial text-2xl">Une note à viser ? Prépare le chemin.</p><p className="mt-1 text-sm text-[#e2d4cf]">Transforme tes prochains chapitres en séances de révision.</p></div><Link href="/planificateur-revisions" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#a94031] transition hover:bg-[#fff0e6]">Créer mon planning gratuit <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
  </section>
}
