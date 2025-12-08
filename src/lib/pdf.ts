// @ts-ignore - pdf-parse types
import pdf from 'pdf-parse'

export interface PDFExtractResult {
  text: string
  numPages: number
  info: {
    title?: string
    author?: string
    subject?: string
    keywords?: string
  }
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractResult> {
  try {
    const data = await pdf(buffer)
    
    return {
      text: data.text,
      numPages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
      }
    }
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export function truncateText(text: string, maxTokens: number = 100000): string {
  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n\n[Document truncated due to length...]'
}
