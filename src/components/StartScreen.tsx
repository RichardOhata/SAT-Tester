import type { Question } from '../types'
import { SECTION_LABELS } from '../types'
import type { Theme } from '../App'
import ThemeToggle from './ThemeToggle'

type Props = {
  questions: Question[]
  loading: boolean
  loadError: string | null
  onRetry: () => void
  onStart: () => void
  theme: Theme
  onToggleTheme: () => void
}

export default function StartScreen({
  questions,
  loading,
  loadError,
  onRetry,
  onStart,
  theme,
  onToggleTheme,
}: Props) {
  const counts = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.section] = (acc[q.section] ?? 0) + 1
    return acc
  }, {})
  const hasQuestions = questions.length > 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-3xl justify-end px-6 pt-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-10 text-center">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Digital SAT Practice
        </span>
        <h1 className="mx-auto mt-6 max-w-2xl text-5xl font-extrabold leading-tight tracking-tight">
          SAT Practice Test
        </h1>

        {loading ? (
          <p className="mt-8 text-lg text-slate-500 dark:text-slate-400">Loading questions…</p>
        ) : loadError ? (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm dark:border-rose-900 dark:bg-rose-950/40">
            <p className="font-semibold text-rose-700 dark:text-rose-300">
              Couldn’t load questions
            </p>
            <p className="mt-1 text-rose-600 dark:text-rose-400">{loadError}</p>
            <button
              onClick={onRetry}
              className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              {hasQuestions
                ? `Answer all ${questions.length} questions, then submit to see your score, a domain breakdown, and a full explanation for every question.`
                : 'No questions yet. Add questions to build your practice test.'}
            </p>

            {hasQuestions && (
              <div className="mx-auto mt-10 grid max-w-md gap-4 sm:grid-cols-2">
                {Object.entries(counts).map(([section, count]) => (
                  <div
                    key={section}
                    className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {count}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {SECTION_LABELS[section as keyof typeof SECTION_LABELS]} questions
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10">
              <button
                onClick={onStart}
                disabled={!hasQuestions}
                className="w-full rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Start Practice Test
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
              Untimed · your progress is kept until you submit
            </p>
          </>
        )}
      </section>
    </div>
  )
}
