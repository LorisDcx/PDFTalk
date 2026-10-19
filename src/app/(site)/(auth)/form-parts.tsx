'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/i18n'

export const authInputClass = 'h-11 rounded-xl border-[var(--cd-line)] bg-[var(--cd-paper)] px-3 text-base text-[var(--cd-ink)] placeholder:text-[var(--cd-muted)] focus-visible:ring-[var(--cd-brand)]'
export const authButtonClass = 'min-h-11 h-auto w-full rounded-xl bg-[var(--cd-brand)] px-3 py-2.5 text-base font-semibold text-white transition hover:bg-[var(--cd-brand-hover)] focus-visible:ring-[var(--cd-brand)]'
export const authTitleClass = 'font-editorial mt-2 text-[clamp(1.75rem,4dvh,2.5rem)] leading-[1.1] tracking-[-.035em] text-[var(--cd-ink)]'

const visibilityLabels: Record<string, [string, string]> = {
  fr: ['Afficher', 'Masquer'], en: ['Show', 'Hide'], es: ['Mostrar', 'Ocultar'],
  de: ['Anzeigen', 'Verbergen'], it: ['Mostra', 'Nascondi'], pt: ['Mostrar', 'Ocultar'],
  zh: ['显示', '隐藏'], ja: ['表示', '非表示'], ar: ['إظهار', 'إخفاء'],
}

type PasswordFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoComplete?: string
  minLength?: number
  hint?: string
}

export function PasswordField({ id, label, value, onChange, disabled, autoComplete, minLength, hint }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const { language } = useLanguage()
  const [showLabel, hideLabel] = visibilityLabels[language] ?? visibilityLabels.fr

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-semibold text-[#51434e]">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={event => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          disabled={disabled}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${authInputClass} pe-12`}
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          disabled={disabled}
          aria-label={`${visible ? hideLabel : showLabel} ${label}`}
          aria-pressed={visible}
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center rounded-xl text-[var(--cd-muted)] transition hover:text-[var(--cd-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]"
        >
          {visible ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs text-[#8c7d87]">{hint}</p>}
    </div>
  )
}
