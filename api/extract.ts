import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { config } from 'dotenv'

// Local development loads .env; on Vercel the platform injects env vars.
if (!process.env.VERCEL) {
  config()
}

// Allow the model up to a minute on large PDFs (Vercel Pro honors this).
export const maxDuration = 60

// Sonnet 4.6 balances cost and quality well for transcription-style extraction
// (cheaper and faster than Opus, still strong on layout and math).
const MODEL = 'claude-sonnet-4-6'

// JSON schema the model must fill. Every field is required (with an "empty"
// value when not applicable) to keep the structured-output schema strict.
const QUESTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          section: { type: 'string', enum: ['reading-writing', 'math'] },
          type: { type: 'string', enum: ['multiple-choice', 'grid-in'] },
          passage: { type: 'string' },
          table: {
            type: 'object',
            additionalProperties: false,
            properties: {
              caption: { type: 'string' },
              headers: { type: 'array', items: { type: 'string' } },
              rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
              note: { type: 'string' },
            },
            required: ['caption', 'headers', 'rows', 'note'],
          },
          figureNote: { type: 'string' },
          prompt: { type: 'string' },
          choices: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                label: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
                text: { type: 'string' },
              },
              required: ['label', 'text'],
            },
          },
          correctAnswer: { type: 'string' },
          acceptedAnswers: { type: 'array', items: { type: 'string' } },
          domain: { type: 'string' },
          skill: { type: 'string' },
          explanation: { type: 'string' },
        },
        required: [
          'section',
          'type',
          'passage',
          'table',
          'figureNote',
          'prompt',
          'choices',
          'correctAnswer',
          'acceptedAnswers',
          'domain',
          'skill',
          'explanation',
        ],
      },
    },
  },
  required: ['questions'],
}

const SYSTEM_PROMPT = `You transcribe SAT practice questions from a source document (textbook or worksheet) into structured JSON.

Extract EVERY distinct practice question. Ignore cover pages, section headers, page numbers, and general instructions that are not themselves questions.

For each question:
- section: "reading-writing" for reading/writing/grammar/verbal questions; "math" for math questions.
- type: "multiple-choice" if it has answer choices; "grid-in" if it is a student-produced response with no choices.
- passage: the stimulus that precedes the question — reading passage, scenario, notes, or equation setup. Empty string if there is none.
- table: if the question includes a data table, put it here as structured data — "headers" (the column titles) and "rows" (each row as an array of cell strings, same length as headers), plus "caption" and "note" if the document shows them. If there is NO table, use empty arrays for headers and rows and empty strings for caption and note. Do NOT also duplicate the table inside the passage text.
- figureNote: a concise text description of any graph, chart, or figure needed to answer it (images are not captured separately). Empty string if none.
- prompt: the actual question being asked.
- choices: for multiple-choice, the options as {label, text} with labels A, B, C, D in order. Empty array for grid-in.
- correctAnswer: read it directly from the document's answer key (e.g. a "Key: C" line) — the LETTER (A/B/C/D) for multiple-choice, or the answer value for grid-in. Do NOT solve the question yourself.
- acceptedAnswers: for grid-in, every acceptable answer form the document lists (e.g. ["3.44", "86/25"]). Empty array for multiple-choice.
- domain and skill: use the document's labels if present; otherwise classify as best you can. Empty string if unknown.
- explanation: copy the answer explanation from the document. Empty string if the document has none.

The document already contains the answers (answer keys and explanations) — retrieve them from the document; never work out or solve the questions yourself. If a question's answer genuinely is not present in the document, leave correctAnswer as an empty string rather than guessing. Render math with Unicode (², ³, √, −, ×, ÷, ≤, ≥, π). Preserve the question wording faithfully.`

/** Reject the request unless it carries the correct admin password. */
function adminError(req: VercelRequest): { status: number; error: string } | null {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return { status: 500, error: 'ADMIN_PASSWORD is not configured on the server.' }
  }
  const provided = req.headers['x-admin-password']
  if (typeof provided !== 'string' || provided !== expected) {
    return { status: 401, error: 'Unauthorized — admin password required.' }
  }
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const denied = adminError(req)
  if (denied) return res.status(denied.status).json({ error: denied.error })
  if (!process.env.ANTHROPIC_API_KEY) {
    return res
      .status(500)
      .json({ error: 'ANTHROPIC_API_KEY is not set. Add it to your environment.' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
    const pdfBase64: unknown = body.pdfBase64
    if (typeof pdfBase64 !== 'string' || pdfBase64 === '') {
      return res.status(400).json({ error: 'A base64-encoded PDF (pdfBase64) is required.' })
    }

    const client = new Anthropic()
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      // Thinking off: this is transcription, not problem-solving, so the model
      // doesn't need a reasoning phase. Faster and cheaper. The structured
      // output schema keeps the response to clean JSON.
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: QUESTION_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
            },
            {
              type: 'text',
              text: 'Extract every SAT practice question from this document into the structured format.',
            },
          ],
        },
      ],
    })

    const message = await stream.finalMessage()
    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return res.status(502).json({ error: 'The model did not return structured output.' })
    }

    const parsed = JSON.parse(textBlock.text)
    return res.status(200).json({ questions: parsed.questions ?? [] })
  } catch (err) {
    console.error('extract API error:', err)
    const message = err instanceof Error ? err.message : 'Extraction failed.'
    return res.status(500).json({ error: message })
  }
}
