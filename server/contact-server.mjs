import { createServer } from 'node:http'
import { mkdir, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const submissionsDir = path.join(root, 'data')
const submissionsFile = path.join(submissionsDir, 'contact-submissions.jsonl')
const port = Number(process.env.CONTACT_PORT || 8787)

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large.'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })

const validateSubmission = (payload) => {
  const errors = {}

  if (!payload.firstName?.trim()) errors.firstName = 'Enter a first name.'
  if (!payload.lastName?.trim()) errors.lastName = 'Enter a last name.'
  if (!payload.email?.trim()) errors.email = 'Enter an email address.'
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = 'Use a valid email address.'
  }
  if (!payload.message?.trim()) errors.message = 'Tell us what you need.'

  return errors
}

const server = createServer(async (req, res) => {
  if (!req.url) return json(res, 404, { ok: false, message: 'Route not found.' })

  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    return json(res, 200, { ok: true })
  }

  if (req.url === '/api/contact' && req.method === 'POST') {
    try {
      const raw = await readBody(req)
      const payload = JSON.parse(raw || '{}')
      const errors = validateSubmission(payload)

      if (Object.keys(errors).length > 0) {
        return json(res, 400, {
          ok: false,
          message: 'We could not send your enquiry yet. Check the highlighted fields and try again.',
          fieldErrors: errors,
        })
      }

      const submission = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || '',
        message: payload.message.trim(),
      }

      await mkdir(submissionsDir, { recursive: true })
      await appendFile(submissionsFile, `${JSON.stringify(submission)}\n`, 'utf8')

      return json(res, 200, {
        ok: true,
        message: 'Your enquiry has been received. We will review it and reply by email.',
        submissionId: submission.id,
      })
    } catch (error) {
      console.error('[contact-server]', error)
      return json(res, 500, {
        ok: false,
        message: 'The server could not save your enquiry. Please try again or email us directly.',
      })
    }
  }

  return json(res, 404, { ok: false, message: 'Route not found.' })
})

server.listen(port, () => {
  console.log(`[contact-server] listening on http://localhost:${port}`)
})
