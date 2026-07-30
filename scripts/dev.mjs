import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')

const children = [
  spawn(process.execPath, [path.join(root, 'server', 'contact-server.mjs')], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  }),
  spawn(process.execPath, [viteBin], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  }),
]

const shutdown = () => {
  children.forEach((child) => {
    if (!child.killed) child.kill('SIGTERM')
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

children.forEach((child) => {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      shutdown()
      process.exit(code)
    }
  })
})
