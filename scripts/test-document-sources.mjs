import assert from 'node:assert/strict'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { extractTextFromPDF, prepareDocumentText } from '../src/lib/pdf.ts'
import { sampleDocumentSections, verifySourceQuote } from '../src/lib/document-retrieval.ts'

const pdf = await PDFDocument.create()
const font = await pdf.embedFont(StandardFonts.Helvetica)
for (const text of [
  'Organic chemistry studies carbon compounds and their reactions.',
  'Reaction mechanisms explain how electrons move between atoms.',
]) {
  const page = pdf.addPage([600, 800])
  page.drawText(text, { x: 50, y: 700, font, size: 14 })
}

const extracted = await extractTextFromPDF(Buffer.from(await pdf.save()))
assert.equal(extracted.numPages, 2)
assert.equal(extracted.pages[0].pageNumber, 1)
assert.match(extracted.pages[1].text, /electrons move/)

const prepared = prepareDocumentText(extracted)
assert.equal(prepared.sampled, false)
assert.deepEqual(
  verifySourceQuote(prepared.text, 'Reaction mechanisms explain how electrons move between atoms.'),
  { quote: 'Reaction mechanisms explain how electrons move between atoms.', page: 2 },
)
assert.equal(verifySourceQuote(prepared.text, 'A fabricated passage that is not in this PDF.'), null)

const long = prepareDocumentText({
  ...extracted,
  pages: [
    { pageNumber: 1, text: 'First page opening. ' + 'alpha '.repeat(1000) },
    { pageNumber: 2, text: 'Second page opening. ' + 'beta '.repeat(1000) },
  ],
}, 2000)
assert.equal(long.sampled, true)
assert.match(long.text, /\[\[PAGE 1\]\]/)
assert.match(long.text, /\[\[PAGE 2\]\]/)
assert.match(sampleDocumentSections(long.text, 500), /Near page 2/)

console.log('Document extraction, page mapping, citations and long-document sampling passed')
