import type { Choice, Question } from '../types'

const LABELS: Choice['label'][] = ['A', 'B', 'C', 'D']

/** Return a new array with the items in random order (Fisher–Yates). */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Rewrite the answer-letter references inside an explanation so they match the
 * new choice labels. The booklet always refers to options as "Choice X" or
 * "Choices X, Y, and Z", so we remap A–D only inside those clauses — leaving
 * unrelated letters (e.g. "figure A", "store B", "point A") untouched.
 */
function remapExplanationLabels(explanation: string, map: Record<string, string>): string {
  // Singular: "Choice A" (also covers possessives like "Choice C’s").
  let result = explanation.replace(
    /\bChoice ([A-D])\b/g,
    (_match, label: string) => `Choice ${map[label] ?? label}`,
  )
  // Plural enumeration: "Choices A, B, and C are/is/were ...".
  result = result.replace(/\bChoices\b[^.]*?\b(?:are|is|were)\b/g, (clause) =>
    clause.replace(/\b([A-D])\b/g, (_m, label: string) => map[label] ?? label),
  )
  return result
}

/**
 * Randomize the choice order of one multiple-choice question, relabeling A–D by
 * position and keeping `correctAnswer` and the explanation consistent. Non-MC
 * questions (grid-ins) are returned unchanged.
 */
function randomizeChoices(question: Question): Question {
  if (question.type !== 'multiple-choice' || !question.choices) return question

  const shuffled = shuffle(question.choices)
  const labelMap: Record<string, string> = {}
  const choices: Choice[] = shuffled.map((choice, i) => {
    const newLabel = LABELS[i]
    labelMap[choice.label] = newLabel
    return { label: newLabel, text: choice.text }
  })

  return {
    ...question,
    choices,
    correctAnswer: labelMap[question.correctAnswer] ?? question.correctAnswer,
    explanation: remapExplanationLabels(question.explanation, labelMap),
  }
}

/**
 * Produce a fresh randomized quiz: shuffled question order and shuffled answer
 * choices. Call once per attempt so the order is stable while the user plays.
 */
export function prepareQuiz(questions: Question[]): Question[] {
  return shuffle(questions).map(randomizeChoices)
}
