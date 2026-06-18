import type { Question } from '../types'

type Props = {
  question: Question
  answer: string | undefined
  onAnswer: (value: string) => void
}

/** Renders a single question's stimulus, optional figure/table, and answer input. */
export default function QuestionView({ question, answer, onAnswer }: Props) {
  return (
    <div>
      {question.passage && (
        <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 dark:text-slate-200">
          {question.passage}
        </p>
      )}

      {question.table && (
        <figure className="mt-4 overflow-x-auto">
          {question.table.caption && (
            <figcaption className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {question.table.caption}
            </figcaption>
          )}
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {question.table.headers.map((h) => (
                  <th
                    key={h}
                    className="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-slate-300 px-3 py-2 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {question.table.note && (
            <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
              {question.table.note}
            </p>
          )}
        </figure>
      )}

      {question.figureNote && (
        <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Figure description:{' '}
          </span>
          {question.figureNote}
        </p>
      )}

      <p className="mt-6 font-semibold text-slate-900 dark:text-slate-100">{question.prompt}</p>

      {question.type === 'multiple-choice' && question.choices ? (
        <fieldset className="mt-4 space-y-3">
          {question.choices.map((choice) => {
            const selected = answer === choice.label
            return (
              <label
                key={choice.label}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  selected
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:bg-indigo-950'
                    : 'border-slate-200 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={choice.label}
                  checked={selected}
                  onChange={() => onAnswer(choice.label)}
                  className="sr-only"
                />
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                    selected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 text-slate-600 dark:border-slate-500 dark:text-slate-300'
                  }`}
                >
                  {choice.label}
                </span>
                <span className="pt-0.5 text-slate-800 dark:text-slate-100">{choice.text}</span>
              </label>
            )
          })}
        </fieldset>
      ) : (
        <div className="mt-4">
          <label htmlFor={`grid-${question.id}`} className="sr-only">
            Your answer
          </label>
          <input
            id={`grid-${question.id}`}
            type="text"
            inputMode="text"
            autoComplete="off"
            value={answer ?? ''}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer"
            className="w-48 rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      )}
    </div>
  )
}
