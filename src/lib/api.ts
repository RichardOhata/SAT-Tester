import type { Choice, Question, Section } from '../types'
import { adminHeaders } from './auth'

/** A question being created — the server assigns `id` and `number`. */
export type NewQuestion = Omit<Question, 'id' | 'number'>

/** Raw shape returned by the PDF extraction endpoint (all fields populated). */
export type ExtractedQuestion = {
  section: Section
  type: 'multiple-choice' | 'grid-in'
  passage: string
  table: { caption: string; headers: string[]; rows: string[][]; note: string }
  figureNote: string
  prompt: string
  choices: Choice[]
  correctAnswer: string
  acceptedAnswers: string[]
  domain: string
  skill: string
  explanation: string
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null)
  return data?.error ?? `${fallback} (HTTP ${res.status}).`
}

/** Verify the admin password (sent via session headers). Throws if invalid. */
export async function checkAdmin(): Promise<void> {
  const res = await fetch('/api/admin-check', { headers: adminHeaders() })
  if (!res.ok) throw new Error(await errorMessage(res, 'Authentication failed'))
}

/** Send a base64-encoded PDF to Claude and get back extracted questions. */
export async function extractQuestionsFromPdf(
  pdfBase64: string,
): Promise<ExtractedQuestion[]> {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ pdfBase64 }),
  })
  if (!res.ok) throw new Error(await errorMessage(res, 'Extraction failed'))
  const data = await res.json()
  return (data.questions ?? []) as ExtractedQuestion[]
}

/** Fetch all stored questions from the backend (public). */
export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch('/api/questions')
  if (!res.ok) throw new Error(`Failed to load questions (HTTP ${res.status}).`)
  return res.json()
}

/** Save a new question to the database. Returns the created question. */
export async function createQuestion(input: NewQuestion): Promise<Question> {
  const res = await fetch('/api/questions', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await errorMessage(res, 'Failed to save question'))
  return res.json()
}

/** Update an existing question. Returns the updated question. */
export async function updateQuestion(id: string, input: NewQuestion): Promise<Question> {
  const res = await fetch('/api/questions', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ ...input, id }),
  })
  if (!res.ok) throw new Error(await errorMessage(res, 'Failed to update question'))
  return res.json()
}

/** Delete a question by id. */
export async function deleteQuestion(id: string): Promise<void> {
  const res = await fetch('/api/questions', {
    method: 'DELETE',
    headers: adminHeaders(),
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(await errorMessage(res, 'Failed to delete question'))
}
