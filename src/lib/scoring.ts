import type { Question, Section } from '../types'
import { SECTION_LABELS } from '../types'

/** Map of question id -> the user's answer (choice label or typed grid-in value). */
export type AnswerMap = Record<string, string>

/** Normalize a free-response answer so equivalent forms compare equal. */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/−/g, '-') // unicode minus -> hyphen
    .replace(/\s+/g, '')
}

export function isCorrect(question: Question, answer: string | undefined): boolean {
  if (answer == null || answer === '') return false
  if (question.type === 'grid-in') {
    const accepted = question.acceptedAnswers ?? [normalizeAnswer(question.correctAnswer)]
    return accepted.includes(normalizeAnswer(answer))
  }
  return answer === question.correctAnswer
}

export type SectionScore = {
  section: Section
  label: string
  correct: number
  total: number
}

export type DomainScore = {
  domain: string
  correct: number
  total: number
}

export type ScoreResult = {
  correct: number
  total: number
  answered: number
  percent: number
  bySection: SectionScore[]
  byDomain: DomainScore[]
}

export function scoreTest(questions: Question[], answers: AnswerMap): ScoreResult {
  let correct = 0
  let answered = 0
  const sectionMap = new Map<Section, SectionScore>()
  const domainMap = new Map<string, DomainScore>()

  for (const q of questions) {
    const userAnswer = answers[q.id]
    if (userAnswer != null && userAnswer !== '') answered++

    const section =
      sectionMap.get(q.section) ??
      { section: q.section, label: SECTION_LABELS[q.section], correct: 0, total: 0 }
    section.total++

    const domain =
      domainMap.get(q.domain) ?? { domain: q.domain, correct: 0, total: 0 }
    domain.total++

    if (isCorrect(q, userAnswer)) {
      correct++
      section.correct++
      domain.correct++
    }

    sectionMap.set(q.section, section)
    domainMap.set(q.domain, domain)
  }

  const total = questions.length
  return {
    correct,
    total,
    answered,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    bySection: [...sectionMap.values()],
    byDomain: [...domainMap.values()],
  }
}
