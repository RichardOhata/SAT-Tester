import { useState } from 'react'
import type { Choice, Question, Section } from '../types'
import { SECTION_LABELS } from '../types'
import type { NewQuestion } from '../lib/api'
import { normalizeAnswer } from '../lib/scoring'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
const labelClass = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const

/** Read an image File as a base64 data URL (usable directly as <img src>). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read image.'))
    reader.readAsDataURL(file)
  })
}

function initialChoices(q?: Question): string[] {
  if (q?.type === 'multiple-choice' && q.choices) {
    const arr = q.choices.map((c) => c.text)
    while (arr.length < 4) arr.push('')
    return arr.slice(0, 4)
  }
  return ['', '', '', '']
}

function initialCorrectIndex(q?: Question): number {
  if (q?.type === 'multiple-choice' && q.choices) {
    const idx = q.choices.findIndex((c) => c.label === q.correctAnswer)
    return idx >= 0 ? idx : 0
  }
  return 0
}

function initialAccepted(q?: Question): string {
  if (q?.type === 'grid-in') {
    return (q.acceptedAnswers ?? [q.correctAnswer]).join(', ')
  }
  return ''
}

type Props = {
  /** Existing question to edit; omit for a blank create form. */
  initial?: Question
  submitLabel: string
  onSubmit: (q: NewQuestion) => Promise<void>
  onCancel?: () => void
}

export default function QuestionForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [section, setSection] = useState<Section>(initial?.section ?? 'reading-writing')
  const [type, setType] = useState<'multiple-choice' | 'grid-in'>(
    initial?.type ?? 'multiple-choice',
  )
  const [passage, setPassage] = useState(initial?.passage ?? '')
  const [prompt, setPrompt] = useState(initial?.prompt ?? '')
  const [choices, setChoices] = useState(() => initialChoices(initial))
  const [correctIndex, setCorrectIndex] = useState(() => initialCorrectIndex(initial))
  const [acceptedAnswers, setAcceptedAnswers] = useState(() => initialAccepted(initial))
  const [domain, setDomain] = useState(initial?.domain ?? '')
  const [skill, setSkill] = useState(initial?.skill ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? '')
  const [figureNote, setFigureNote] = useState(initial?.figureNote ?? '')
  const [explanation, setExplanation] = useState(initial?.explanation ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleImageFile(file: File | undefined) {
    if (!file) return
    try {
      setImageUrl(await fileToDataUrl(file))
    } catch {
      setMessage('Could not read that image.')
      setStatus('error')
    }
  }

  async function handleAudioFile(file: File | undefined) {
    if (!file) return
    try {
      setAudioUrl(await fileToDataUrl(file))
    } catch {
      setMessage('Could not read that audio file.')
      setStatus('error')
    }
  }

  function updateChoice(index: number, value: string) {
    setChoices((prev) => prev.map((c, i) => (i === index ? value : c)))
  }

  function resetForm() {
    setSection('reading-writing')
    setType('multiple-choice')
    setPassage('')
    setPrompt('')
    setChoices(['', '', '', ''])
    setCorrectIndex(0)
    setAcceptedAnswers('')
    setDomain('')
    setSkill('')
    setImageUrl('')
    setAudioUrl('')
    setFigureNote('')
    setExplanation('')
  }

  function build(): NewQuestion | string {
    if (prompt.trim() === '') return 'A prompt is required.'
    const base = {
      section,
      passage: passage.trim() || undefined,
      prompt: prompt.trim(),
      imageUrl: imageUrl.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined,
      figureNote: figureNote.trim() || undefined,
      domain: domain.trim(),
      skill: skill.trim(),
      explanation: explanation.trim(),
    }
    if (type === 'multiple-choice') {
      const filled: Choice[] = choices.map((text, i) => ({
        label: CHOICE_LABELS[i],
        text: text.trim(),
      }))
      if (filled.some((c) => c.text === '')) return 'Please fill in all four answer choices.'
      return { ...base, type, choices: filled, correctAnswer: CHOICE_LABELS[correctIndex] }
    }
    const accepted = acceptedAnswers
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
    if (accepted.length === 0) return 'Please enter at least one accepted answer.'
    return {
      ...base,
      type,
      correctAnswer: accepted[0],
      acceptedAnswers: accepted.map(normalizeAnswer),
    }
  }

  async function handleSave() {
    const result = build()
    if (typeof result === 'string') {
      setStatus('error')
      setMessage(result)
      return
    }
    setStatus('saving')
    setMessage('')
    try {
      await onSubmit(result)
      if (initial) {
        onCancel?.() // edit: parent closes and refreshes
      } else {
        resetForm()
        setStatus('success')
        setMessage('Question saved.')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to save question.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as Section)}
            className={inputClass}
          >
            {Object.entries(SECTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Question type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'multiple-choice' | 'grid-in')}
            className={inputClass}
          >
            <option value="multiple-choice">Multiple choice</option>
            <option value="grid-in">Grid-in (student response)</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Passage / stimulus (optional)</label>
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          rows={4}
          placeholder="Reading passage, scenario, or equation setup…"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Question prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="Which choice best states the main idea of the text?"
          className={inputClass}
        />
      </div>

      {type === 'multiple-choice' ? (
        <fieldset>
          <legend className={labelClass}>Answer choices (select the correct one)</legend>
          <div className="space-y-2">
            {choices.map((choice, i) => (
              <div key={i} className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-choice"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-300 text-sm font-bold text-slate-600 dark:border-slate-500 dark:text-slate-300">
                    {CHOICE_LABELS[i]}
                  </span>
                </label>
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => updateChoice(i, e.target.value)}
                  placeholder={`Choice ${CHOICE_LABELS[i]} text`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ) : (
        <div>
          <label className={labelClass}>Accepted answers</label>
          <input
            type="text"
            value={acceptedAnswers}
            onChange={(e) => setAcceptedAnswers(e.target.value)}
            placeholder="e.g. 3.44, 86/25"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Separate multiple acceptable forms with commas.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. Algebra"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Skill</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. Linear functions"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Figure image (optional)</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={imageUrl.startsWith('data:') ? '' : imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste an image URL…"
            className={inputClass + ' flex-1'}
          />
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files?.[0])}
            />
          </label>
        </div>
        {imageUrl && (
          <div className="mt-3 flex items-start gap-3">
            <img
              src={imageUrl}
              alt="Figure preview"
              className="max-h-40 w-auto rounded-lg border border-slate-200 dark:border-slate-700"
            />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="text-sm font-semibold text-slate-500 transition hover:text-rose-600 dark:text-slate-400"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Figure description / caption (optional)</label>
        <textarea
          value={figureNote}
          onChange={(e) => setFigureNote(e.target.value)}
          rows={2}
          placeholder="Describe an accompanying graph or figure in words…"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Listening audio (optional)</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={audioUrl.startsWith('data:') ? '' : audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="Paste an audio URL…"
            className={inputClass + ' flex-1'}
          />
          <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500">
            Upload
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleAudioFile(e.target.files?.[0])}
            />
          </label>
        </div>
        {audioUrl && (
          <div className="mt-3 flex items-center gap-3">
            <audio controls src={audioUrl} className="max-w-xs">
              Your browser does not support audio playback.
            </audio>
            <button
              type="button"
              onClick={() => setAudioUrl('')}
              className="text-sm font-semibold text-slate-500 transition hover:text-rose-600 dark:text-slate-400"
            >
              Remove
            </button>
          </div>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          For longer clips, host the file and paste a URL — large uploaded files can exceed
          the save limit.
        </p>
      </div>

      <div>
        <label className={labelClass}>Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={4}
          placeholder="Why the correct answer is correct (and why the others aren’t)…"
          className={inputClass}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
        {message && (
          <span
            className={`mr-auto text-sm font-medium ${
              status === 'error'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {message}
          </span>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={status === 'saving'}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  )
}
