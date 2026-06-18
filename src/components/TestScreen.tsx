import { useState } from 'react'
import type { Question } from '../types'
import { SECTION_LABELS } from '../types'
import type { AnswerMap } from '../lib/scoring'
import QuestionView from './QuestionView'

type Props = {
  questions: Question[]
  answers: AnswerMap
  onAnswer: (questionId: string, value: string) => void
  onSubmit: () => void
}

export default function TestScreen({ questions, answers, onAnswer, onSubmit }: Props) {
  const [index, setIndex] = useState(0)
  const current = questions[index]
  const answeredCount = questions.filter((q) => answers[q.id]?.length).length
  const isLast = index === questions.length - 1

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {SECTION_LABELS[current.section]}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Question {index + 1} of {questions.length} · {answeredCount} answered
          </span>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-1 bg-indigo-600 transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            <span className="rounded bg-indigo-100 px-2 py-0.5 dark:bg-indigo-950">
              {current.domain}
            </span>
            <span className="text-slate-400 dark:text-slate-500">{current.skill}</span>
          </div>
          <QuestionView
            question={current}
            answer={answers[current.id]}
            onAnswer={(value) => onAnswer(current.id, value)}
          />
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500"
          >
            ← Previous
          </button>

          {isLast ? (
            <button
              onClick={onSubmit}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Next →
            </button>
          )}
        </div>

        {/* Question palette */}
        <div className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Jump to question
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const isAnswered = answers[q.id]?.length
              const isCurrent = i === index
              return (
                <button
                  key={q.id}
                  onClick={() => setIndex(i)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold transition ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isAnswered
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-600'
                  }`}
                  title={`${SECTION_LABELS[q.section]} ${q.number}`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onSubmit}
            className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
          >
            Finish and score now ({answeredCount}/{questions.length} answered)
          </button>
        </div>
      </main>
    </div>
  )
}
