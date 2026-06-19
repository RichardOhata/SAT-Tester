import type { Question } from '../types'
import { SECTION_LABELS } from '../types'
import type { AnswerMap } from '../lib/scoring'
import { isCorrect, scoreTest } from '../lib/scoring'
import { formatDuration } from '../lib/time'

type Props = {
  questions: Question[]
  answers: AnswerMap
  elapsedMs: number
  onRetake: () => void
  onHome: () => void
}

export default function ResultsScreen({
  questions,
  answers,
  elapsedMs,
  onRetake,
  onHome,
}: Props) {
  const result = scoreTest(questions, answers)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Score summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Your Practice Score
          </p>
          <p className="mt-3 text-6xl font-extrabold text-slate-900 dark:text-slate-100">
            {result.correct}
            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
              /{result.total}
            </span>
          </p>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            {result.percent}% correct
          </p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {result.answered} of {result.total} questions answered · raw practice score
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <span aria-hidden="true">⏱</span>
            <span className="font-mono tabular-nums">{formatDuration(elapsedMs)}</span>
            <span className="font-normal text-slate-500 dark:text-slate-400">completion time</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {result.bySection.map((s) => (
              <div key={s.section} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {s.correct}
                  <span className="text-base font-semibold text-slate-400 dark:text-slate-500">
                    /{s.total}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onRetake}
              className="w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Retake Test
            </button>
            <button
              onClick={onHome}
              className="w-full rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 sm:w-auto"
            >
              Back to Home
            </button>
          </div>
        </section>

        {/* Domain breakdown */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Performance by domain
          </h2>
          <div className="mt-4 space-y-3">
            {result.byDomain.map((d) => {
              const pct = Math.round((d.correct / d.total) * 100)
              return (
                <div key={d.domain}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {d.domain}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {d.correct}/{d.total}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Question-by-question review */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            Review answers
          </h2>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAnswer = answers[q.id]
              const correct = isCorrect(q, userAnswer)
              const userDisplay = displayAnswer(q, userAnswer)
              const correctDisplay = displayAnswer(q, q.correctAnswer)
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-800 ${
                    correct
                      ? 'border-emerald-200 dark:border-emerald-900'
                      : 'border-rose-200 dark:border-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {SECTION_LABELS[q.section]} · Q{q.number} · {q.domain}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        correct
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {correct ? 'Correct' : userAnswer ? 'Incorrect' : 'Skipped'}
                    </span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                    {i + 1}. {q.prompt}
                  </p>

                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Your answer:{' '}
                      </span>
                      <span
                        className={
                          correct
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }
                      >
                        {userDisplay || '— (skipped)'}
                      </span>
                    </p>
                    {!correct && (
                      <p>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          Correct answer:{' '}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          {correctDisplay}
                        </span>
                      </p>
                    )}
                  </div>

                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-semibold text-indigo-600 dark:text-indigo-400">
                      Explanation
                    </summary>
                    <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
                      {q.explanation}
                    </p>
                  </details>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

/** Build a human-readable string for an answer (choice letter + text, or raw value). */
function displayAnswer(q: Question, value: string | undefined): string {
  if (value == null || value === '') return ''
  if (q.type === 'grid-in') return value
  const choice = q.choices?.find((c) => c.label === value)
  if (!choice) return value
  return `${choice.label}. ${choice.text}`
}
