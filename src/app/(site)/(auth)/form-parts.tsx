'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/i18n'

export const authInputClass = 'h-12 rounded-2xl border-[#ead9cf] bg-[#fffdf9] px-4 text-[#332a34] placeholder:text-[#aa9da7] focus-visible:ring-[#ae4731]'
export const authButtonClass = 'h-12 w-full rounded-full bg-[#a84431] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(76,41,70,.7)] transition hover:bg-[#8e3d32] focus-visible:ring-[#ae4731]'

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
    <div className="space-y-2">
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
          className="absolute inset-y-0 end-2 flex w-10 items-center justify-center rounded-xl text-[#83717d] transition hover:text-[#a84431] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]"
        >
          {visible ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs text-[#8c7d87]">{hint}</p>}
    </div>
  )
}
