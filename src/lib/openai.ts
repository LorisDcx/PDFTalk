import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDocumentDigest(text: string, documentType?: string) {
  const typeContext = documentType 
    ? `This is a ${documentType} document.` 
    : 'Identify the type of study material (lecture notes, textbook excerpt, article, exercise sheet, slides, or other).'

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a study assistant helping students understand and review course material. ${typeContext}
        
Your task is to analyze the provided document and create a comprehensive digest with the following sections:

1. **Document Type**: Identify the kind of study material.
2. **Summary**: 5-10 key ideas in the same language as the source.
3. **Key Concepts/Sections**: Explain the important concepts or sections.
4. **Points of Attention**: Identify likely misunderstandings, exceptions or distinctions students should check. Do not predict exam questions.
5. **Practice Questions**: Suggest questions a student can answer using this document.
6. **Study Actions**: Suggest concrete next review steps.

Base every factual statement on the supplied text. If the source lacks information, do not invent it. Keep technical terminology accurate and explain it in plain language. Use the source language for all fields.

Return your analysis in the following JSON format:
{
  "documentType": "string",
  "summary": ["bullet 1", "bullet 2", ...],
  "keyClauses": [{"title": "string", "description": "string"}, ...],
  "risks": [{"title": "string", "description": "string", "severity": "high|medium|low"}, ...],
  "questions": ["question 1", "question 2", ...],
  "actions": [{"action": "string", "priority": "high|medium|low"}, ...]
}`
      },
      {
        role: 'user',
        content: `Please analyze this document:\n\n${text}`
      }
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('No response from OpenAI')
  
  return { digest: JSON.parse(content), tokensUsed: response.usage?.total_tokens ?? 0 }
}

export async function generateEasyReading(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      {
        role: 'system',
        content: `You are an expert at simplifying complex documents for non-experts. Your task is to rewrite the provided document in plain, easy-to-understand language.

Guidelines:
- Use simple words and short sentences
- Break complex ideas into digestible paragraphs
- Explain technical terms in everyday language while preserving their precise meaning
- Keep the essential meaning intact
- Organize with clear headings and bullet points where appropriate
- Highlight important definitions, examples, dates and numbers accurately

Return a well-formatted, easy-to-read version that anyone can understand.`
      },
      {
        role: 'user',
        content: `Please simplify this document:\n\n${text}`
      }
    ],
    max_completion_tokens: 6000,
  })

  return { easyReading: response.choices[0].message.content || '', tokensUsed: response.usage?.total_tokens ?? 0 }
}

export async function compareDocuments(text1: string, text2: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-nano',
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

  return response.choices[0].message.content || ''
}
