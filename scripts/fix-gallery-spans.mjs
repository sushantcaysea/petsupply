import fs from 'fs'

let s = fs.readFileSync('src/data.js', 'utf8')
s = s.replace(/span: '(tall|wide|square)'/g, "span: 'square'")
if (!s.includes("keep-healthy.jpg',\n    span: 'square',\n    hasText:")) {
  s = s.replace(
    "src: '/images/lifestyle/keep-healthy.jpg',\n    span: 'square',\n    caption:",
    "src: '/images/lifestyle/keep-healthy.jpg',\n    span: 'square',\n    hasText: true,\n    caption:",
  )
}
fs.writeFileSync('src/data.js', s)
console.log('ok', (s.match(/span: 'square'/g) || []).length)
