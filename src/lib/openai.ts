import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDocumentDigest(text: string, documentType?: string) {
  const typeContext = documentType 
    ? `This is a ${documentType} document.` 
    : 'Analyze this document and determine its type (contract, quote, CGV/terms, report, or other).'

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert document analyst helping business professionals understand complex documents quickly. ${typeContext}
        
Your task is to analyze the provided document and create a comprehensive digest with the following sections:

1. **Document Type**: Identify what type of document this is
2. **Executive Summary**: 5-10 bullet points covering the most important information
3. **Key Clauses/Sections**: List the main sections and what they cover
4. **Risks & Points of Attention**: Highlight potential risks, unusual clauses, or things that require careful attention
5. **Questions to Ask**: Suggest questions the reader should ask the other party
6. **Suggested Actions**: Recommend next steps based on the document content

Be specific, actionable, and focus on what matters most to a busy professional. Use plain language and avoid unnecessary jargon.

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
  
  return JSON.parse(content)
}

export async function generateEasyReading(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert at simplifying complex documents for non-experts. Your task is to rewrite the provided document in plain, easy-to-understand language.

Guidelines:
- Use simple words and short sentences
- Break complex ideas into digestible paragraphs
- Replace legal/technical jargon with everyday language
- Keep the essential meaning intact
- Organize with clear headings and bullet points where appropriate
- Highlight important dates, numbers, and obligations clearly

Return a well-formatted, easy-to-read version that anyone can understand.`
      },
      {
        role: 'user',
        content: `Please simplify this document:\n\n${text}`
      }
    ],
    temperature: 0.4,
    max_tokens: 4000,
  })

  return response.choices[0].message.content || ''
}

export async function compareDocuments(text1: string, text2: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
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
    temperature: 0.3,
    max_tokens: 4000,
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
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the provided text to ${languageNames[targetLanguage] || targetLanguage}. 
        
Guidelines:
- Maintain the original meaning and tone
- Keep technical terms accurate
- Preserve formatting (line breaks, bullet points, etc.)
- For legal or business documents, use appropriate formal language
- Do not add any commentary or notes, only provide the translation`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.3,
    max_tokens: 4000,
  })

  return response.choices[0].message.content || ''
}
