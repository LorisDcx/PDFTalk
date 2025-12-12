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
  isScannedOrImageBased?: boolean
  warning?: string
}

/**
 * Clean and normalize extracted PDF text
 */
function cleanPDFText(text: string): string {
  if (!text) return ''
  
  return text
    // Remove null bytes and control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize various Unicode spaces to regular space
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    // Fix common PDF extraction artifacts
    .replace(/\ufffd/g, '') // replacement character
    .replace(/\u0000/g, '') // null
    // Normalize multiple spaces to single space
    .replace(/[^\S\n]+/g, ' ')
    // Normalize multiple newlines to max 2
    .replace(/\n{3,}/g, '\n\n')
    // Remove lines that are just spaces
    .replace(/^\s+$/gm, '')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim()
}

/**
 * Check if PDF appears to be scanned/image-based (very little text per page)
 */
function detectScannedPDF(text: string, numPages: number): boolean {
  if (numPages === 0) return true
  const cleanedText = text.replace(/\s+/g, '')
  const avgCharsPerPage = cleanedText.length / numPages
  // If less than 100 chars per page on average, likely scanned
  return avgCharsPerPage < 100
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractResult> {
  try {
    // pdf-parse options for better extraction
    const options = {
      // Limit pages to prevent memory issues
      max: 200,
      // Custom page renderer for better text extraction (handles tables/columns)
      pagerender: function(pageData: any) {
        return pageData.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        }).then(function(textContent: any) {
          // Collect all text items with their positions
          const items: { str: string; x: number; y: number; width: number }[] = []
          
          for (const item of textContent.items) {
            if ('str' in item && item.str.trim()) {
              items.push({
                str: item.str,
                x: Math.round(item.transform[4]), // X position
                y: Math.round(item.transform[5]), // Y position
                width: item.width || 0
              })
            }
          }
          
          if (items.length === 0) return ''
          
          // Sort by Y (descending - PDF coordinates start from bottom) then X (ascending)
          items.sort((a, b) => {
            const yDiff = b.y - a.y
            // If on same line (within 5 units), sort by X
            if (Math.abs(yDiff) < 5) {
              return a.x - b.x
            }
            return yDiff
          })
          
          // Group items into lines based on Y position
          const lines: { y: number; items: typeof items }[] = []
          let currentLine: typeof items = []
          let currentY = items[0]?.y
          
          for (const item of items) {
            // New line if Y changed significantly
            if (Math.abs(item.y - currentY) > 5) {
              if (currentLine.length > 0) {
                lines.push({ y: currentY, items: [...currentLine] })
              }
              currentLine = [item]
              currentY = item.y
            } else {
              currentLine.push(item)
            }
          }
          // Don't forget last line
          if (currentLine.length > 0) {
            lines.push({ y: currentY, items: currentLine })
          }
          
          // Build text from lines, detecting columns/tables
          let text = ''
          for (const line of lines) {
            // Sort items in line by X position
            line.items.sort((a, b) => a.x - b.x)
            
            let lineText = ''
            let lastX = 0
            
            for (const item of line.items) {
              // Add tab/space if there's a significant gap (column separator)
              const gap = item.x - lastX
              if (lastX > 0 && gap > 50) {
                lineText += '\t' // Tab for column separation
              } else if (lastX > 0 && gap > 10) {
                lineText += ' ' // Space for normal word separation
              }
              lineText += item.str
              lastX = item.x + (item.width || item.str.length * 5)
            }
            
            text += lineText.trim() + '\n'
          }
          
          return text
        })
      }
    }

    const data = await pdf(buffer, options)
    
    // Clean the extracted text
    const cleanedText = cleanPDFText(data.text)
    
    // Check if it appears to be a scanned document
    const isScanned = detectScannedPDF(cleanedText, data.numpages)
    
    const result: PDFExtractResult = {
      text: cleanedText,
      numPages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
      },
      isScannedOrImageBased: isScanned,
    }

    // Add warning for scanned documents
    if (isScanned && cleanedText.length > 0) {
      result.warning = 'This PDF appears to contain mostly images or scanned content. Text extraction may be incomplete.'
    } else if (cleanedText.length === 0) {
      result.warning = 'No text could be extracted from this PDF. It may be a scanned document or contain only images.'
    }

    return result
    
  } catch (error: any) {
    console.error('Error extracting PDF text:', error)
    
    // Provide more specific error messages
    const errorMessage = error?.message || String(error)
    
    if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
      throw new Error('This PDF is password-protected. Please provide an unencrypted version.')
    }
    
    if (errorMessage.includes('Invalid') || errorMessage.includes('corrupt')) {
      throw new Error('This PDF appears to be corrupted or invalid. Please try a different file.')
    }
    
    if (errorMessage.includes('memory') || errorMessage.includes('heap')) {
      throw new Error('This PDF is too complex to process. Please try a simpler document.')
    }
    
    // Generic fallback
    throw new Error('Failed to read this PDF. Please ensure it is a valid, unencrypted PDF file.')
  }
}

export function truncateText(text: string, maxTokens: number = 100000): string {
  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n\n[Document truncated due to length...]'
}
