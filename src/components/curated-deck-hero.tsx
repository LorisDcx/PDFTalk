import Link from 'next/link'
import { ArrowRight, Layers3 } from 'lucide-react'
import { curatedDeckCopy } from '@/lib/curated-decks'
import { LandingBackdrop } from '@/components/landing-backdrop'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

const heroCopy: Record<StudyPdfLocale, { eyebrow: string; headline: string; browse: string; create: string; note: string }> = {
  fr: { eyebrow: 'Bibliothèque gratuite · Sans inscription', headline: 'Révise maintenant. Sans attendre.', browse: 'Choisir une matière', create: 'Créer mes cartes', note: 'Jeux originaux, modifiables et conservés sur cet appareil.' },
  en: { eyebrow: 'Free library · No sign-up', headline: 'Start studying. Right now.', browse: 'Choose a subject', create: 'Make my own cards', note: 'Original decks you can edit, saved on this device.' },
  es: { eyebrow: 'Biblioteca gratis · Sin registro', headline: 'Empieza a estudiar ahora.', browse: 'Elegir una materia', create: 'Crear mis tarjetas', note: 'Juegos originales y editables, guardados en este dispositivo.' },
  de: { eyebrow: 'Kostenlose Bibliothek · Ohne Anmeldung', headline: 'Lerne direkt los.', browse: 'Fach auswählen', create: 'Eigene Karten erstellen', note: 'Eigene, bearbeitbare Sets auf diesem Gerät gespeichert.' },
  it: { eyebrow: 'Biblioteca gratuita · Senza registrazione', headline: 'Inizia subito a studiare.', browse: 'Scegli una materia', create: 'Crea le tue carte', note: 'Mazzi originali e modificabili, salvati su questo dispositivo.' },
  pt: { eyebrow: 'Biblioteca grátis · Sem registo', headline: 'Começa já a estudar.', browse: 'Escolher uma matéria', create: 'Criar os meus cartões', note: 'Conjuntos originais e editáveis, guardados neste dispositivo.' },
  zh: { eyebrow: '免费卡组 · 无须注册', headline: '现在就开始复习。', browse: '选择学科', create: '制作自己的卡片', note: '原创、可编辑的卡组，保存在此设备。' },
  ja: { eyebrow: '無料ライブラリー · 登録不要', headline: '今すぐ復習を始めよう。', browse: '科目を選ぶ', create: '自分のカードを作る', note: 'オリジナルの編集可能なセットを、この端末に保存。' },
  ar: { eyebrow: 'مكتبة مجانية · بلا تسجيل', headline: 'ابدأ المراجعة الآن.', browse: 'اختر مادة', create: 'أنشئ بطاقاتي', note: 'مجموعات أصلية قابلة للتعديل ومحفوظة على هذا الجهاز.' },
}

export function CuratedDeckHero({ locale }: { locale: StudyPdfLocale }) {
  const c = curatedDeckCopy[locale]
  const h = heroCopy[locale]
  const previews = ['cell-biology', 'thermodynamics', 'organic-chemistry'] as const
  return <section lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="landing-hero px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
    <LandingBackdrop />
    <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
      <div><p className="inline-flex items-center gap-2 rounded-full border border-[#edcdbd] bg-[#fff0e6] px-4 py-2 text-xs font-bold text-[var(--cd-brand)]"><Layers3 className="size-4" aria-hidden="true" />{h.eyebrow}</p><h1 className="font-editorial mt-7 max-w-2xl text-[clamp(3.4rem,6vw,6rem)] leading-[1.01] tracking-[-.055em] text-[var(--cd-ink)]">{h.headline}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--cd-muted)]">{c.intro}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="#jeux" className="cd-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#983b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">{h.browse}<ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="#outil" className="cd-press inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--cd-line)] bg-white px-6 text-sm font-bold text-[var(--cd-ink)] transition hover:border-[#cead9d] hover:bg-[#fff4ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">{h.create}</Link></div><p className="mt-5 text-sm text-[var(--cd-muted)]">{h.note}</p></div>
      <div aria-hidden="true" className="relative mx-auto hidden h-[365px] w-full max-w-md sm:block"><div className="absolute inset-x-8 bottom-0 top-7 rounded-[2.3rem] bg-[#fff0e6]" />{previews.map((id, index) => <div key={id} className="curated-hero-card absolute inset-x-5 top-7 rounded-[1.6rem] border border-[#e8cfc0] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(94,49,32,.28)] sm:p-7" style={{ transform: `translate(${index * 18}px, ${index * 92}px) rotate(${index % 2 ? 2 : -2}deg)`, animationDelay: `${index * 90}ms`, zIndex: 3 - index }}><div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] text-[var(--cd-brand)]"><span>{c.deck[id].title}</span><span>{String(index + 1).padStart(2, '0')}</span></div><p className="font-editorial mt-7 line-clamp-2 text-2xl leading-tight text-[var(--cd-ink)]">{c.deck[id].cards[0][0]}</p><div className="mt-6 h-1 w-16 rounded-full bg-[#dd7650]" /></div>)}</div>
    </div>
  </section>
}
