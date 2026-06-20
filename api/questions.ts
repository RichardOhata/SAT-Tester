import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient, type Db } from 'mongodb'
import { config } from 'dotenv'

// Local development: load variables from the project's .env file. On Vercel
// (process.env.VERCEL is set), the platform injects env vars and there is no
// .env file, so we skip this and use Vercel's environment variables.
if (!process.env.VERCEL) {
  config()
}

const DB_NAME = process.env.MONGODB_DB || 'sat_tester'
const COLLECTION = 'questions'

/**
 * Build the connection string. Supports either a complete MONGODB_URI, or an
 * Atlas URI that still contains <username>/<password> placeholders which we fill
 * from MONGODB_USERNAME / MONGODB_PASSWORD.
 */
function buildUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set')
  const user = process.env.MONGODB_USERNAME
  const pass = process.env.MONGODB_PASSWORD
  let result = uri
  if (user) {
    result = result
      .replace('<username>', encodeURIComponent(user))
      .replace('<db_username>', encodeURIComponent(user))
  }
  if (pass) {
    result = result
      .replace('<password>', encodeURIComponent(pass))
      .replace('<db_password>', encodeURIComponent(pass))
  }
  return result
}

// Reuse the connection across warm serverless invocations instead of opening a
// new one per request.
let clientPromise: Promise<MongoClient> | null = null
function getDb(): Promise<Db> {
  if (!clientPromise) {
    clientPromise = new MongoClient(buildUri()).connect()
  }
  return clientPromise.then((client) => client.db(DB_NAME))
}

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

type QuestionInput = Record<string, unknown>

function validate(body: QuestionInput): string | null {
  if (body.section !== 'reading-writing' && body.section !== 'math') {
    return 'A valid section is required.'
  }
  if (body.type !== 'multiple-choice' && body.type !== 'grid-in') {
    return 'A valid question type is required.'
  }
  if (typeof body.prompt !== 'string' || body.prompt.trim() === '') {
    return 'A prompt is required.'
  }
  if (body.type === 'multiple-choice') {
    if (!Array.isArray(body.choices) || body.choices.length < 2) {
      return 'At least two answer choices are required.'
    }
    if (typeof body.correctAnswer !== 'string' || body.correctAnswer === '') {
      return 'A correct answer is required.'
    }
  } else {
    if (!Array.isArray(body.acceptedAnswers) || body.acceptedAnswers.length === 0) {
      return 'At least one accepted answer is required.'
    }
  }
  return null
}

/** Build Mongo $set/$unset ops from a full question body (used for updates). */
function buildUpdateOps(body: QuestionInput) {
  const set: Record<string, unknown> = {
    section: body.section,
    type: body.type,
    prompt: body.prompt,
    domain: typeof body.domain === 'string' ? body.domain : '',
    skill: typeof body.skill === 'string' ? body.skill : '',
    explanation: typeof body.explanation === 'string' ? body.explanation : '',
  }
  const unset: Record<string, ''> = {}

  if (typeof body.passage === 'string' && body.passage !== '') set.passage = body.passage
  else unset.passage = ''
  if (typeof body.figureNote === 'string' && body.figureNote !== '') set.figureNote = body.figureNote
  else unset.figureNote = ''
  if (typeof body.imageUrl === 'string' && body.imageUrl !== '') set.imageUrl = body.imageUrl
  else unset.imageUrl = ''

  if (body.type === 'multiple-choice') {
    set.choices = body.choices
    set.correctAnswer = body.correctAnswer
    unset.acceptedAnswers = ''
  } else {
    set.correctAnswer = body.correctAnswer
    set.acceptedAnswers = body.acceptedAnswers
    unset.choices = ''
  }

  const ops: Record<string, unknown> = { $set: set }
  if (Object.keys(unset).length > 0) ops.$unset = unset
  return ops
}

function parseBody(req: VercelRequest): QuestionInput {
  return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb()
    const collection = db.collection(COLLECTION)

    // Reads are public so the quiz can load. Writes require the admin password.
    if (req.method === 'GET') {
      const questions = await collection
        .find({}, { projection: { _id: 0 } })
        .sort({ section: 1, number: 1 })
        .toArray()
      return res.status(200).json(questions)
    }

    const denied = adminError(req)
    if (denied) return res.status(denied.status).json({ error: denied.error })

    if (req.method === 'POST') {
      const body = parseBody(req)
      const error = validate(body)
      if (error) return res.status(400).json({ error })

      const number = (await collection.countDocuments({ section: body.section })) + 1
      const question = {
        ...body,
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        number,
      }
      await collection.insertOne({ ...question })
      return res.status(201).json(question)
    }

    if (req.method === 'PUT') {
      const body = parseBody(req)
      const id = body.id
      if (typeof id !== 'string' || id === '') {
        return res.status(400).json({ error: 'A question id is required.' })
      }
      const error = validate(body)
      if (error) return res.status(400).json({ error })

      const result = await collection.updateOne({ id }, buildUpdateOps(body))
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Question not found.' })
      }
      const updated = await collection.findOne({ id }, { projection: { _id: 0 } })
      return res.status(200).json(updated)
    }

    if (req.method === 'DELETE') {
      const body = parseBody(req)
      const id = body.id
      if (typeof id !== 'string' || id === '') {
        return res.status(400).json({ error: 'A question id is required.' })
      }
      const result = await collection.deleteOne({ id })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Question not found.' })
      }
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('questions API error:', err)
    return res.status(500).json({ error: 'Database error' })
  }
}
