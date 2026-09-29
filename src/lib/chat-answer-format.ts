import katex from 'katex'

/** Make model-generated display equations safe for the Markdown math parser. */
export function formatChatAnswer(raw: string): string | null {
  const answer = raw.replace(/\r\n?/g, '\n').trim()
  if (!answer) return null

  const parts = answer.split(/(?<!\\)\$\$/g)
  if (parts.length % 2 === 0) return null // An unclosed equation would swallow the rest of the answer.

  const formatted: string[] = []
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index].trim()
    if (index % 2 === 1) {
      if (!part || part.length > 1500 || /(?<!\\)\$/.test(part)) return null
      formatted.push(`$$\n${part}\n$$`)
    } else if (part) {
      if ((part.match(/(?<!\\)\$/g) || []).length % 2 !== 0) return null
      if (/\|\s+\|\s*:?-{3}/.test(part)) return null // Table rows collapsed into one line need repair.
      // Models occasionally put headings and rules on the same line as prose.
      formatted.push(part
        .replace(/\s+---(?=\s|$)/g, '\n\n---')
        .replace(/\s+(#{1,3}) (?=\S)/g, '\n\n$1 '))
    }
  }

  return formatted.join('\n\n').trim()
}

export function isRenderableChatAnswer(answer: string): boolean {
  try {
    for (const match of answer.matchAll(/\$\$\n([\s\S]*?)\n\$\$/g)) {
      katex.renderToString(match[1], { displayMode: true, throwOnError: true, trust: false })
    }
    const prose = answer.replace(/\$\$\n[\s\S]*?\n\$\$/g, '')
    for (const match of prose.matchAll(/(?<!\\)\$(?!\$)([\s\S]*?)(?<!\\)\$(?!\$)/g)) {
      if (!match[1] || match[1].length > 500 || match[1].includes('\n')) return false
      katex.renderToString(match[1], { throwOnError: true, trust: false })
    }
    return true
  } catch {
    return false
  }
}
