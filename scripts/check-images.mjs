import fs from 'fs'
import path from 'path'

const files = ['src/data.js', 'src/App.jsx']
const urls = new Set()
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  for (const m of s.matchAll(/['"](\/images\/[^'"]+)['"]/g)) urls.add(m[1])
}
let miss = 0
for (const u of [...urls].sort()) {
  const p = path.join('public', ...u.replace(/^\//, '').split('/'))
  if (!fs.existsSync(p)) {
    console.log('MISSING', u)
    miss++
  }
}
console.log('checked', urls.size, 'missing', miss)
