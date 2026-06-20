import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown

// Run a request through the matching api/<route>.ts handler, adapting Node's
// req/res to the small Vercel-style surface those handlers use.
async function runApiRoute(server: ViteDevServer, req: IncomingMessage, res: ServerResponse) {
  try {
    const pathname = new URL(req.url ?? '', 'http://localhost').pathname

    const chunks: Uint8Array[] = []
    for await (const chunk of req) chunks.push(chunk as Uint8Array)
    const rawBody = Buffer.concat(chunks).toString('utf8')

    const vercelReq = req as unknown as VercelRequest
    vercelReq.body = rawBody.length > 0 ? rawBody : undefined

    const vercelRes = res as unknown as VercelResponse
    vercelRes.status = (code: number) => {
      res.statusCode = code
      return vercelRes
    }
    vercelRes.json = (data: unknown) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
      return vercelRes
    }

    // Load the function through Vite so its TypeScript and node deps resolve,
    // and so its top-level `.env` loading runs.
    const mod = await server.ssrLoadModule(`${pathname}.ts`)
    const handler = mod.default as ApiHandler
    await handler(vercelReq, vercelRes)
  } catch (err) {
    server.config.logger.error(`[dev-api] ${String(err)}`)
    if (!res.writableEnded) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Dev API error' }))
    }
  }
}

// Dev-only plugin: serve the /api serverless functions from the Vite dev server
// so `npm run dev` works end-to-end without `vercel dev`. On Vercel these same
// functions run natively, so production is unaffected.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          next()
          return
        }
        void runApiRoute(server, req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
})
