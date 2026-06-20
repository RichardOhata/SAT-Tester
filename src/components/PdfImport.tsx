import { useEffect, useRef, useState } from 'react'
import {
  createQuestion,
  extractQuestionsFromPdf,
  type ExtractedQuestion,
  type NewQuestion,
} from '../lib/api'
import { normalizeAnswer } from '../lib/scoring'

/** Read a File as base64 (without the data: URL prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })
}

/** Build a structured table from extracted data, or undefined if there's none. */
function toTable(t: ExtractedQuestion['table']): NewQuestion['table'] {
  if (!t || (t.headers.length === 0 && t.rows.length === 0)) return undefined
  return {
    headers: t.headers,
    rows: t.rows,
    caption: t.caption.trim() || undefined,
    note: t.note.trim() || undefined,
  }
}

/** Convert an extracted question into the shape the save endpoint expects. */
function toNewQuestion(q: ExtractedQuestion): NewQuestion {
  const base = {
    section: q.section,
    type: q.type,
    passage: q.passage.trim() || undefined,
    table: toTable(q.table),
    figureNote: q.figureNote.trim() || undefined,
    prompt: q.prompt.trim(),
    domain: q.domain.trim(),
    skill: q.skill.trim(),
    explanation: q.explanation.trim(),
  }
  if (q.type === 'multiple-choice') {
    return { ...base, type: 'multiple-choice', choices: q.choices, correctAnswer: q.correctAnswer }
  }
  return {
    ...base,
    type: 'grid-in',
    correctAnswer: q.correctAnswer,
    acceptedAnswers: q.acceptedAnswers.map(normalizeAnswer),
  }
}

export default function PdfImport({ onSaved }: { onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<'idle' | 'extracting' | 'saving'>('idle')
  const [error, setError] = useState('')
  const [extracted, setExtracted] = useState<ExtractedQuestion[] | null>(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (status !== 'extracting') return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  function handleFiles(files: FileList | null) {
    const picked = files?.[0]
    if (picked) {
      setFile(picked)
      setExtracted(null)
      setError('')
      setSavedMessage('')
    }
  }

  async function handleExtract() {
    if (!file) return
    setElapsed(0)
    setStatus('extracting')
    setError('')
    setSavedMessage('')
    setExtracted(null)
    try {
      const pdfBase64 = await fileToBase64(file)
      const questions = await extractQuestionsFromPdf(pdfBase64)
      setExtracted(questions)
      if (questions.length === 0) setError('No questions were found in this PDF.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed.')
    } finally {
      setStatus('idle')
    }
  }

  async function handleSaveAll() {
    if (!extracted || extracted.length === 0) return
    setStatus('saving')
    setError('')
    let saved = 0
    try {
      for (const q of extracted) {
        await createQuestion(toNewQuestion(q))
        saved++
      }
      setExtracted(null)
      setFile(null)
      setSavedMessage(`Saved ${saved} question${saved === 1 ? '' : 's'} to the database.`)
      onSaved()
    } catch (err) {
      setError(
        `Saved ${saved} of ${extracted.length} before an error: ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      )
    } finally {
      setStatus('idle')
    }
  }

  function discardReview() {
    setExtracted(null)
    setError('')
  }

  // 1. Extracting — prominent spinner.
  if (status === 'extracting') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
        <p className="mt-5 text-base font-semibold text-slate-800 dark:text-slate-100">
          Extracting questions…
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Claude is reading {file?.name ?? 'your PDF'}. This can take up to a minute.
        </p>
        <p className="mt-3 font-mono text-sm tabular-nums text-slate-400 dark:text-slate-500">
          {elapsed}s elapsed
        </p>
      </div>
    )
  }

  // 2. Review.
  if (extracted && extracted.length > 0) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Review extracted questions
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {extracted.length} found — check them, then save to the database.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={discardReview}
              disabled={status === 'saving'}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={status === 'saving'}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'saving' ? 'Saving…' : `Save all ${extracted.length}`}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-4">
          {extracted.map((q, i) => (
            <ReviewCard key={i} index={i} q={q} />
          ))}
        </div>
      </div>
    )
  }

  // 3. Idle.
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition ${
          dragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
            : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
        }`}
      >
        <div className="text-4xl">📄</div>
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">
          Drop a PDF here, or click to browse
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload a textbook or worksheet to extract SAT questions
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-xl">📕</span>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-sm font-semibold text-slate-500 transition hover:text-rose-600 dark:text-slate-400"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      )}
      {savedMessage && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {savedMessage}
        </p>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <span className="mr-auto text-xs text-slate-400 dark:text-slate-500">
          Extraction uses Claude and requires an API key.
        </span>
        <button
          type="button"
          onClick={handleExtract}
          disabled={!file}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Extract questions
        </button>
      </div>
    </div>
  )
}

/** One extracted question, shown for review before saving. */
function ReviewCard({ index, q }: { index: number; q: ExtractedQuestion }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {q.section === 'math' ? 'Math' : 'Reading & Writing'}
        </span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {q.type === 'grid-in' ? 'Grid-in' : 'Multiple choice'}
        </span>
        {q.domain && <span className="text-slate-400 dark:text-slate-500">{q.domain}</span>}
      </div>

      {q.passage && (
        <p className="mt-3 whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
          {q.passage}
        </p>
      )}
      {q.table && q.table.headers.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          {q.table.caption && (
            <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {q.table.caption}
            </p>
          )}
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                {q.table.headers.map((h) => (
                  <th
                    key={h}
                    className="border border-slate-300 bg-slate-100 px-2 py-1 text-left font-semibold dark:border-slate-600 dark:bg-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-slate-300 px-2 py-1 dark:border-slate-600"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {q.figureNote && (
        <p className="mt-2 rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
          Figure: {q.figureNote}
        </p>
      )}

      <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
        {index + 1}. {q.prompt}
      </p>

      {q.type === 'multiple-choice' ? (
        <ul className="mt-2 space-y-1 text-sm">
          {q.choices.map((c) => {
            const correct = c.label === q.correctAnswer
            return (
              <li
                key={c.label}
                className={
                  correct
                    ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300'
                }
              >
                {c.label}. {c.text} {correct && '✓'}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Answer: </span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {[q.correctAnswer, ...q.acceptedAnswers.filter((a) => a !== q.correctAnswer)].join(
              ' / ',
            )}
          </span>
        </p>
      )}

      {q.explanation && (
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer font-semibold text-indigo-600 dark:text-indigo-400">
            Explanation
          </summary>
          <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
            {q.explanation}
          </p>
        </details>
      )}
    </div>
  )
}
