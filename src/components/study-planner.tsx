'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, BookOpenText, CalendarDays, CheckCircle2, Download, Plus, Trash2 } from 'lucide-react'
import { createStudyPlan, studyPlanToIcs, type StudyPlan, type StudySubject } from '@/lib/study-plan'

const weekdayOptions = [
  { value: 1, label: 'Lun' }, { value: 2, label: 'Mar' }, { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' }, { value: 5, label: 'Ven' }, { value: 6, label: 'Sam' }, { value: 0, label: 'Dim' },
]

const fieldClass = 'min-h-12 w-full rounded-xl border border-[#ead9cf] bg-white px-4 text-sm text-[#33252b] outline-none transition focus:border-[#c95b3e] focus:ring-2 focus:ring-[#f6d5c5]'
const dateLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

function inputDate(date: Date) {
  const pad = (number: number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function daysFromNow(count: number) {
  const date = new Date()
  date.setDate(date.getDate() + count)
  return inputDate(date)
}

function initialSubjects(): StudySubject[] {
  return [{ id: 'subject-1', name: '', chapters: 4, difficulty: 2 }]
}

function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours} h ${remainder}` : `${hours} h`
}

export function StudyPlanner() {
  const [examDate, setExamDate] = useState(() => daysFromNow(21))
  const [minutesPerDay, setMinutesPerDay] = useState(90)
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5])
  const [subjects, setSubjects] = useState<StudySubject[]>(initialSubjects)
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)

  const updateSubject = (id: string, patch: Partial<StudySubject>) => {
    setSubjects(current => current.map(subject => subject.id === id ? { ...subject, ...patch } : subject))
    setPlan(null)
  }

  const addSubject = () => {
    setSubjects(current => [...current, { id: `subject-${Date.now()}`, name: '', chapters: 4, difficulty: 2 }])
    setPlan(null)
  }

  const removeSubject = (id: string) => {
    setSubjects(current => current.filter(subject => subject.id !== id))
    setPlan(null)
  }

  const toggleWeekday = (value: number) => {
    setWeekdays(current => current.includes(value) ? current.filter(day => day !== value) : [...current, value])
    setPlan(null)
  }

  const generate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!subjects.length || subjects.some(subject => !subject.name.trim() || subject.chapters < 1)) {
      setError('Donne un nom et au moins un chapitre à chaque matière avant de créer ton planning.')
      return
    }
    if (!weekdays.length) {
      setError('Choisis au moins un jour de révision.')
      return
    }
    const result = createStudyPlan({ examDate, minutesPerDay, weekdays, subjects })
    if (!result) {
      setError('Choisis une date d’examen future avec au moins un jour disponible avant cette date.')
      return
    }
    setPlan(result)
    setShowAll(false)
  }

  const exportCalendar = () => {
    if (!plan) return
    const blob = new Blob([studyPlanToIcs(plan)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'planning-revisions-cramdesk.ics'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const displayedDays = showAll ? plan?.days : plan?.days.slice(0, 10)
  const uncovered = plan ? plan.totalChapters - plan.introducedChapters : 0

  return (
    <section id="outil" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
        <form onSubmit={generate} className="rounded-[1.8rem] border border-[#efdcd0] bg-white p-5 shadow-[0_26px_65px_-45px_rgba(120,49,35,.25)] sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe7d8] text-[#b84432]"><CalendarDays className="size-5" aria-hidden="true" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b34c37]">Ton planning</p><h2 className="font-editorial text-3xl leading-tight">Prépare ton examen</h2></div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#493b3e]">Date de l’examen
              <input type="date" value={examDate} min={daysFromNow(1)} max={daysFromNow(180)} onChange={event => { setExamDate(event.target.value); setPlan(null) }} required className={`mt-2 ${fieldClass}`} />
            </label>
            <label className="block text-sm font-semibold text-[#493b3e]">Temps disponible par jour
              <select value={minutesPerDay} onChange={event => { setMinutesPerDay(Number(event.target.value)); setPlan(null) }} className={`mt-2 ${fieldClass}`}>
                {[45, 90, 135, 180, 225].map(minutes => <option key={minutes} value={minutes}>{durationLabel(minutes)}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="mt-7">
            <legend className="text-sm font-semibold text-[#493b3e]">Jours où tu peux réviser</legend>
            <div className="mt-3 grid grid-cols-7 gap-1.5" role="group" aria-label="Jours disponibles">
              {weekdayOptions.map(day => <button key={day.value} type="button" aria-pressed={weekdays.includes(day.value)} onClick={() => toggleWeekday(day.value)} className={`min-h-10 rounded-xl border text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] ${weekdays.includes(day.value) ? 'border-[#b84432] bg-[#b84432] text-white' : 'border-[#ead9cf] bg-[#fffaf6] text-[#71666a] hover:border-[#cdab99]'}`}>{day.label}</button>)}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div><h3 className="text-sm font-bold text-[#493b3e]">Matières à réviser</h3><p className="mt-1 text-xs text-[#85777b]">Indique le nombre de chapitres à couvrir.</p></div>
            <span className="rounded-full bg-[#fff0e6] px-3 py-1 text-xs font-bold text-[#b34c37]">{subjects.length}/8</span>
          </div>
          <div className="mt-4 space-y-3">
            {subjects.map((subject, index) => <div key={subject.id} className="rounded-2xl border border-[#efdfd5] bg-[#fffbf8] p-4">
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b46e56]">Matière {index + 1}</p>{subjects.length > 1 && <button type="button" onClick={() => removeSubject(subject.id)} aria-label={`Retirer ${subject.name || `la matière ${index + 1}`}`} className="rounded-lg p-1.5 text-[#9d8a87] hover:bg-[#fce8df] hover:text-[#a73d31]"><Trash2 className="size-4" /></button>}</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1.5fr_.75fr_1fr]">
                <label className="text-xs font-semibold text-[#62565a]">Nom<input type="text" value={subject.name} onChange={event => updateSubject(subject.id, { name: event.target.value })} placeholder="Ex. Biologie" maxLength={40} required className={`mt-1.5 ${fieldClass}`} /></label>
                <label className="text-xs font-semibold text-[#62565a]">Chapitres<input type="number" min={1} max={40} value={subject.chapters || ''} onChange={event => updateSubject(subject.id, { chapters: event.target.value === '' ? 0 : Math.max(1, Math.min(40, Number(event.target.value))) })} required className={`mt-1.5 ${fieldClass}`} /></label>
                <label className="text-xs font-semibold text-[#62565a]">Difficulté<select value={subject.difficulty} onChange={event => updateSubject(subject.id, { difficulty: Number(event.target.value) as StudySubject['difficulty'] })} className={`mt-1.5 ${fieldClass}`}><option value={1}>Difficile</option><option value={2}>Moyenne</option><option value={3}>Facile</option></select></label>
              </div>
            </div>)}
          </div>
          {subjects.length < 8 && <button type="button" onClick={addSubject} className="mt-4 inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-bold text-[#b84432] hover:text-[#922f28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]"><Plus className="size-4" /> Ajouter une matière</button>}

          {error && <p role="alert" className="mt-5 flex gap-2 rounded-xl border border-[#f0bdad] bg-[#fff1e9] p-3 text-sm text-[#9b3629]"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{error}</p>}
          <button type="submit" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-6 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:-translate-y-0.5 hover:bg-[#973326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2">Créer mon planning gratuit <ArrowRight className="size-4" aria-hidden="true" /></button>
          <p className="mt-4 text-center text-xs leading-5 text-[#8b7a78]">Aucun compte requis. Ton planning n’est pas envoyé au serveur.</p>
        </form>

        <div id="study-results" className="min-w-0 rounded-[1.8rem] border border-[#efdcd0] bg-[#fff4ed] p-5 sm:p-8">
          {plan ? <>
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b34c37]">Plan personnalisé</p><h2 className="font-editorial mt-2 text-4xl leading-tight text-[#33252b]">Prêt à réviser, <span className="italic text-[#c25334]">à ton rythme.</span></h2></div><span className="flex size-12 items-center justify-center rounded-2xl bg-white text-[#b84432]"><CheckCircle2 className="size-6" aria-hidden="true" /></span></div>
            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
              {[[String(plan.days.length), 'jours'], [String(plan.introducedChapters), 'chapitres'], [String(plan.recallSessions), 'rappels']].map(([value, label]) => <div key={label} className="rounded-2xl bg-white px-3 py-4 text-center"><p className="font-editorial text-3xl text-[#b84432]">{value}</p><p className="mt-1 text-xs font-semibold text-[#806f70]">{label}</p></div>)}
            </div>
            {uncovered > 0 ? <p role="status" className="mt-5 flex gap-2 rounded-xl border border-[#efb399] bg-[#fff9f5] p-4 text-sm leading-6 text-[#963f2e]"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{uncovered} chapitre{uncovered > 1 ? 's' : ''} ne rentre{uncovered > 1 ? 'nt' : ''} pas dans ce planning. Ajoute des jours ou augmente ton temps quotidien.</p> : plan.recallSessions === 0 ? <p role="status" className="mt-5 flex gap-2 rounded-xl border border-[#efb399] bg-[#fff9f5] p-4 text-sm leading-6 text-[#963f2e]"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Tous les chapitres sont placés, mais il manque du temps pour les rappels. Ajoute des jours ou augmente ton temps quotidien.</p> : <p role="status" className="mt-5 flex gap-2 rounded-xl border border-[#d9dfc8] bg-[#f7f9f1] p-4 text-sm leading-6 text-[#536846]"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Tous les chapitres sont placés. Les créneaux restants servent au rappel actif et aux quiz.</p>}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><h3 className="font-editorial text-2xl text-[#33252b]">Tes séances</h3><button type="button" onClick={exportCalendar} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dbb7a4] bg-white px-4 text-xs font-bold text-[#a83e30] hover:bg-[#fff8f3]"><Download className="size-4" aria-hidden="true" />Exporter le calendrier</button></div>
            <div className="mt-4 max-h-[700px] space-y-3 overflow-y-auto pr-1">
              {displayedDays?.map((day, index) => <article key={day.date.toISOString()} className="rounded-2xl border border-[#f0dfd5] bg-white p-4 sm:p-5"><div className="flex items-baseline justify-between gap-3"><h4 className="text-sm font-bold capitalize text-[#3f3033]">{dateLabel.format(day.date)}</h4><span className="text-[11px] font-semibold text-[#a37769]">Jour {index + 1}</span></div><ul className="mt-3 space-y-2">{day.sessions.map((session, slot) => <li key={`${session.subject}-${slot}`} className="flex items-start gap-3 rounded-xl bg-[#fff9f5] px-3 py-2.5"><span className={`mt-1 size-2 shrink-0 rounded-full ${session.kind === 'learn' ? 'bg-[#e97743]' : session.kind === 'recall' ? 'bg-[#b84432]' : 'bg-[#81a179]'}`} /><span className="min-w-0 text-xs leading-5 text-[#625458]"><strong className="font-bold text-[#4d373a]">{session.subject}</strong> · {session.title}</span></li>)}</ul></article>)}
            </div>
            {plan.days.length > 10 && <button type="button" onClick={() => setShowAll(value => !value)} className="mt-4 text-sm font-bold text-[#b84432] underline decoration-[#e3b7a6] underline-offset-4">{showAll ? 'Voir moins de jours' : `Voir les ${plan.days.length} jours`}</button>}
            <p className="mt-5 text-xs leading-5 text-[#8a7774]">Séances de 45 minutes. Le calendrier propose un départ à 18 h, modifiable après import. Ajuste le plan à ta réalité et garde du temps pour les pauses.</p>
          </> : <div className="flex min-h-[540px] flex-col justify-center"><span className="flex size-16 items-center justify-center rounded-[1.4rem] bg-white text-[#b84432] shadow-sm"><BookOpenText className="size-8" aria-hidden="true" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#b34c37]">Aperçu de ton planning</p><h2 className="font-editorial mt-3 max-w-md text-4xl leading-tight text-[#33252b] sm:text-5xl">Un plan clair, <span className="italic text-[#c25334]">sans y passer la soirée.</span></h2><p className="mt-5 max-w-md text-sm leading-7 text-[#756a69]">Indique ton examen, tes matières et tes jours disponibles. CramDesk répartit les chapitres et les rappels sur ton calendrier, sans inscription.</p><div className="mt-8 space-y-3">{[['01', 'Comprendre un chapitre'], ['02', 'Se rappeler sans notes'], ['03', 'Tester ce qui reste flou']].map(([number, text]) => <div key={number} className="flex items-center gap-4 rounded-xl border border-[#f0dfd5] bg-white px-4 py-3 text-sm text-[#67595b]"><span className="font-editorial text-2xl text-[#d76746]">{number}</span>{text}</div>)}</div></div>}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-5 rounded-[1.5rem] bg-[#33252b] px-6 py-7 text-white sm:px-9"><div><p className="font-editorial text-2xl">Prêt à travailler sur le cours lui-même ?</p><p className="mt-1 text-sm text-[#e2d4cf]">Importe un PDF pour en tirer une synthèse, des flashcards et un quiz.</p></div><Link href="/#essayer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#a94031] transition hover:bg-[#fff0e6]">Essayer avec mon PDF <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
    </section>
  )
}
