import type { VercelRequest, VercelResponse } from '@vercel/node'
import { config } from 'dotenv'

if (!process.env.VERCEL) {
  config()
}

// Lightweight endpoint the dashboard calls to verify the admin password before
// showing the admin UI. Returns 200 when the password matches, 401 otherwise.
export default function handler(req: VercelRequest, res: VercelResponse) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server.' })
  }
  const provided = req.headers['x-admin-password']
  if (typeof provided !== 'string' || provided !== expected) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }
  return res.status(200).json({ ok: true })
}
