import type { Question } from '../types'
import { SECTION_LABELS } from '../types'
import type { Theme } from '../App'
import ThemeToggle from './ThemeToggle'

type Props = {
  questions: Question[]
  onStart: () => void
  theme: Theme
  onToggleTheme: () => void
}

export default function StartScreen({ questions, onStart, theme, onToggleTheme }: Props) {
  const counts = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.section] = (acc[q.section] ?? 0) + 1
    return acc
  }, {})

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
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
          Answer all {questions.length} questions, then submit to see your score,
          a domain breakdown, and a full explanation for every question.
        </p>

        <div className="mx-auto mt-10 grid max-w-md gap-4 sm:grid-cols-2">
          {Object.entries(counts).map(([section, count]) => (
            <div
              key={section}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                {SECTION_LABELS[section as keyof typeof SECTION_LABELS]} questions
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="mt-10 rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Start Practice Test
        </button>
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
          Untimed · your progress is kept until you submit
        </p>
      </section>
    </div>
  )
}
