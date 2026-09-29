import OpenAI from 'openai'
import type { DocumentDigest } from '@/types/database'
import { sampleDocumentSections, verifySourceQuote } from '@/lib/document-retrieval'
import { cleanSummaryItem, studyLanguageNames, type StudyLanguage } from '@/lib/study-language'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDocumentDigest(text: string, language: StudyLanguage = 'fr', documentType?: string) {
  const typeContext = documentType 
    ? `This is a ${documentType} document.` 
    : 'Identify the type of study material (lecture notes, textbook excerpt, article, exercise sheet, slides, or other).'

  const source = sampleDocumentSections(text, 60_000)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a study assistant helping students understand and review course material. ${typeContext}
        
Your task is to analyze the provided document and create a comprehensive digest with the following sections:

1. **Document Type**: Identify the actual material, even if it is not a course. Never pretend an unrelated PDF is a lesson.
2. **Summary**: The first item is one concise sentence naming the document's actual subject. Then give 2-5 distinct, specific ideas in logical order whenever the source supports them. Prefer explanations of relationships, mechanisms and distinctions over isolated facts. Scale the length to the source; do not pad a short document.
3. **Key Concepts/Sections**: Explain up to 5 important concepts in plain language. For each, include a short sourceQuote copied VERBATIM from the supplied text, at most 25 words, that directly supports the explanation. If no precise excerpt supports a concept, omit that concept. Never fabricate a quote or a page number.
4. **Points of Attention**: Identify only genuine nuances or likely misunderstandings supported by the document. Do not predict exam questions or invent risks.
5. **Practice Questions**: Ask questions answerable from this document.
6. **Study Actions**: Suggest concrete next review steps suited to the material.

Base every factual statement on the supplied text. If the source lacks information, do not invent it. Keep technical terminology accurate and explain it in plain language. Write EVERY generated field in ${studyLanguageNames[language]}, regardless of the source language. Only sourceQuote must remain verbatim in the original language. Summary array items must be plain prose: no Markdown, bold markers, headings, or numbering. The first item must state the document's actual subject in one sentence, without generic claims about its importance. The remaining items must each capture one distinct, specific idea from the source. Avoid filler and promotional language. Verify mathematical statements and examples before including them. If the source is sampled, do not claim comprehensive coverage.

Return your analysis in the following JSON format:
{
  "documentType": "string",
  "summary": ["one-sentence overview", "key idea 1", "key idea 2", ...],
  "keyClauses": [{"title": "string", "description": "string", "sourceQuote": "exact short excerpt from source"}, ...],
  "risks": [{"title": "string", "description": "string", "severity": "high|medium|low"}, ...],
  "questions": ["question 1", "question 2", ...],
  "actions": [{"action": "string", "priority": "high|medium|low"}, ...]
}`
      },
      {
        role: 'user',
        content: `Analyze these course excerpts and answer in ${studyLanguageNames[language]}:\n\n${source}`
      }
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No response from OpenAI')
  
  const parsed = JSON.parse(content) as DocumentDigest
  if (!Array.isArray(parsed.summary) || !parsed.summary.some(item => typeof item === 'string' && item.trim())) {
    throw new Error('The document summary is empty')
  }
  const keyClauses = Array.isArray(parsed.keyClauses) ? parsed.keyClauses : []
  const digest: DocumentDigest = {
    documentType: typeof parsed.documentType === 'string' ? parsed.documentType : 'Document',
    summary: parsed.summary.filter((item): item is string => typeof item === 'string' && !!item.trim()).map(cleanSummaryItem).filter(Boolean),
    keyClauses: keyClauses.filter(item => item && typeof item.title === 'string' && typeof item.description === 'string').map(item => {
      const quote = typeof item.sourceQuote === 'string' ? item.sourceQuote.trim() : ''
      const source = verifySourceQuote(text, quote)
      return { title: item.title.trim(), description: item.description.trim(), ...(source ? { sourceQuote: source.quote, ...(source.page ? { sourcePage: source.page } : {}) } : {}) }
    }),
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  }
  return { digest, tokensUsed: response.usage?.total_tokens ?? 0 }
}

export async function generateEasyReading(text: string, language: StudyLanguage = 'fr') {
  const source = sampleDocumentSections(text, 60_000)
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    reasoning_effort: 'medium',
    messages: [
      {
        role: 'system',
        content: `You are an expert study tutor and careful editor. Explain the supplied course material to a student who is encountering it for the first time. Write ONLY in ${studyLanguageNames[language]}, even if the source is in another language.

Guidelines:
- Explain 2 to 4 central ideas from the supplied material in at most 350 words total. Start directly with the first concept, without an introduction, table of contents, template labels, or conclusion.
- Format each idea as a Markdown heading beginning with "## " followed by one or two short, natural paragraphs. Prefer connected prose to lists. Do not write labels such as "Signification", "Pourquoi c'est important" or "Exemple rigoureux".
- Define technical terms precisely, in simple language. Include only formulas that actually matter for understanding. Format each formula in valid LaTeX delimiters: $...$ inline or $$...$$ on its own line. Never leave raw TeX commands or ad hoc math markup outside delimiters.
- Use only facts, formulas and examples present in the supplied extract. Do not add new proofs, examples, exercises, or broader claims, even if they seem familiar. Check signs, units and edge cases before writing. If the supplied extract appears inconsistent or contains OCR errors, explain the uncertainty briefly instead of repeating a false claim.
- Omit author, website, copyright, exercise inventory, generic encouragement and closing offers unless essential to the lesson. If the PDF is not study material, explain its actual contents instead of inventing a lesson. If excerpts cover only part of the document, state that briefly.

Return a concise, accurate, readable explanation in ${studyLanguageNames[language]}.`
      },
      {
        role: 'user',
        content: `Explain these course excerpts in ${studyLanguageNames[language]}:\n\n${source}`
      }
    ],
    max_completion_tokens: 5000,
  })

  const easyReading = response.choices[0]?.message?.content?.trim()
  if (!easyReading) throw new Error('No easy-reading response from OpenAI')
  return { easyReading, tokensUsed: response.usage?.total_tokens ?? 0 }
}

export async function compareDocuments(text1: string, text2: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    reasoning_effort: 'minimal',
    messages: [
      {
        role: 'system',
        content: `You are an expert at comparing documents and identifying differences. Compare the two documents provided and create a detailed comparison report.

Focus on:
1. **Main Differences**: Overall changes between the documents
2. **Clauses Added**: New sections or clauses in the second document
3. **Clauses Removed**: Sections that were in the first but not the second
4. **Clauses Modified**: Sections that exist in both but have been changed
5. **Impact Assessment**: How these changes affect the reader

Return your analysis in JSON format:
{
  "mainDifferences": ["difference 1", "difference 2", ...],
  "clausesAdded": [{"title": "string", "content": "string"}, ...],
  "clausesRemoved": [{"title": "string", "content": "string"}, ...],
  "clausesModified": [{"title": "string", "before": "string", "after": "string"}, ...],
  "impactAssessment": "string"
}`
      },
      {
        role: 'user',
        content: `Compare these two documents:\n\n--- DOCUMENT 1 ---\n${text1}\n\n--- DOCUMENT 2 ---\n${text2}`
      }
    ],
    max_completion_tokens: 6000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No response from OpenAI')
  
  return JSON.parse(content)
}

export async function translateText(text: string, targetLanguage: string = 'fr') {
  const languageNames: Record<string, string> = {
    'fr': 'French',
    'en': 'English',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'pl': 'Polish',
    'ru': 'Russian',
    'ja': 'Japanese',
    'zh': 'Chinese',
    'ar': 'Arabic'
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    reasoning_effort: 'minimal',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the provided text to ${languageNames[targetLanguage] || targetLanguage}. 
        
Guidelines:
- Maintain the original meaning and tone
- Keep technical terms accurate
- Preserve formatting (line breaks, bullet points, etc.)
- For academic course material, preserve technical terminology and definitions
- Do not add any commentary or notes, only provide the translation`
      },
      {
        role: 'user',
        content: text
      }
    ],
    max_completion_tokens: 6000,
  })

  const translation = response.choices[0]?.message?.content?.trim()
  if (!translation) throw new Error('No translation response from OpenAI')
  return translation
}
