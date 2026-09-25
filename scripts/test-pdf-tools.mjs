import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import Module, { createRequire } from 'node:module'
import { File } from 'node:buffer'
import { resolve } from 'node:path'
import ts from 'typescript'
import { PDFDocument } from 'pdf-lib'

const path = resolve('src/lib/pdf-tools.ts')
const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const module = new Module(path)
module.filename = path
module.paths = Module._nodeModulePaths(resolve('src/lib'))
module.require = createRequire(path)
module._compile(code, path)
const { parsePages, runPdfTool } = module.exports

const fixture = await PDFDocument.create()
fixture.setTitle('Private title')
for (let i = 0; i < 3; i++) fixture.addPage([300 + i, 400])
const original = new File([await fixture.save()], 'study.pdf', { type: 'application/pdf' })
const second = new File([await fixture.save()], 'second.pdf', { type: 'application/pdf' })
const open = async bytes => PDFDocument.load(bytes)

assert.deepEqual(parsePages('3, 1-2', 3), [2, 0, 1])
assert.throws(() => parsePages('4', 3), /entre 1 et 3/)
assert.throws(() => parsePages('1,1', 3), /deux fois/)
assert.equal((await open(await runPdfTool('merge', [original, second], {}))).getPageCount(), 6)
const extracted = await open(await runPdfTool('extract', [original], { pages: '2-3' }))
assert.equal(extracted.getPageCount(), 2)
assert.equal(extracted.getPage(0).getWidth(), 301)
const reordered = await open(await runPdfTool('organize', [original], { pages: '3,1' }))
assert.deepEqual(reordered.getPages().map(page => page.getWidth()), [302, 300])
const rotated = await open(await runPdfTool('rotate', [original], { pages: '2', angle: 90 }))
assert.deepEqual(rotated.getPages().map(page => page.getRotation().angle), [0, 90, 0])
assert.equal((await open(await runPdfTool('number', [original], {}))).getPageCount(), 3)
assert.equal((await open(await runPdfTool('watermark', [original], { text: 'DRAFT' }))).getPageCount(), 3)
assert.equal((await open(await runPdfTool('metadata', [original], {}))).getTitle(), '')
const png = new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/RZkAAAAASUVORK5CYII=', 'base64')], 'pixel.png', { type: 'image/png' })
assert.equal((await open(await runPdfTool('images', [png], {}))).getPageCount(), 1)
await assert.rejects(() => runPdfTool('merge', [original], {}), /deux PDF/)
console.log('PDF tools: 8 operations and validation passed')
