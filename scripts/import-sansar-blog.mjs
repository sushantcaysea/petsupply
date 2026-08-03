/**
 * One-time importer: copies exact blog post text from sansarpetsupply.com
 * into src/data/blogPosts.js
 *
 * Run: node scripts/import-sansar-blog.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outFile = path.join(root, 'src', 'data', 'blogPosts.js')

const urls = [
  'https://sansarpetsupply.com/unleash-your-dogs-joy-with-xlarge-canine-cheese-chew/',
  'https://sansarpetsupply.com/unveiling-the-best-canine-cheese-chews-in-seattle-sansar-pet-supply/',
  'https://sansarpetsupply.com/unveiling-the-canine-cheese-chew-a-tail-wagging-delight/',
  'https://sansarpetsupply.com/unveiling-the-canine-delight-the-ultimate-cheese-chew-experience/',
  'https://sansarpetsupply.com/exploring-the-nutritional-value-of-xlarge-canine-cheese-chew-for-canines/',
  'https://sansarpetsupply.com/why-canine-cheese-chews-are-the-new-favorite-treat-for-dogs/',
  'https://sansarpetsupply.com/unleashing-the-power-of-original-canine-cheese-chew-medium-for-your-furry-friend/',
  'https://sansarpetsupply.com/unleashing-the-ultimate-original-canine-cheese-chew-x-large-experience/',
  'https://sansarpetsupply.com/unleashing-the-power-of-original-canine-cheese-chew-for-small-dogs/',
  'https://sansarpetsupply.com/a-gourmet-experience-for-dogs-unveiling-sansar-pet-supplys-exclusive-cheese-chew/',
  'https://sansarpetsupply.com/unveiling-the-art-of-production-of-canine-cheese-chew-at-sansar-pet-supply/',
  'https://sansarpetsupply.com/unleashing-canine-happiness-sansar-pet-supplys-original-canine-cheese-chew/',
  'https://sansarpetsupply.com/unlocking-the-canine-cheese-chew-phenomenon-a-tasty-delight-for-dogs/',
  'https://sansarpetsupply.com/unveiling-the-original-canine-cheese-chew-a-game-changer-for-your-dogs-health/',
  'https://sansarpetsupply.com/exploring-the-superiority-of-sansar-pet-supplys-original-canine-cheese-chew/',
  'https://sansarpetsupply.com/the-secret-to-a-happy-pup-the-irresistible-canine-cheese-chew/',
  'https://sansarpetsupply.com/canine-cheese-chew-from-sansar-pet-supply-enhancing-your-pets-joy/',
  'https://sansarpetsupply.com/unveiling-the-original-canine-cheese-chew-from-sansar-pet-supply/',
  'https://sansarpetsupply.com/the-canine-cheese-chew-a-treat-your-dog-wont-resist/',
  'https://sansarpetsupply.com/tail-wagging-delights-why-custom-size-canine-cheese-chews-are-a-must-have-from-sansar-pet-supply/',
  'https://sansarpetsupply.com/barking-for-more-the-irresistible-allure-of-custom-size-cheese-chews-for-dogs-from-sansar-pet-supply/',
  'https://sansarpetsupply.com/from-pup-to-palate-how-custom-canine-cheese-chews-by-sansar-pet-supply-are-redefining-treat-time/',
  'https://sansarpetsupply.com/canine-culinary-artistry-exploring-sansar-pet-supplys-custom-size-cheese-chews/',
  'https://sansarpetsupply.com/going-gaga-for-cheese-chews-why-sansar-pet-supplys-custom-sizes-are-a-game-changer/',
  'https://sansarpetsupply.com/unleash-the-flavor-exploring-the-world-of-canine-cheese-chews/',
  'https://sansarpetsupply.com/keep-your-pup-smiling-and-healthy-with-delicious-original-canine-cheese-chews/',
  'https://sansarpetsupply.com/canine-cheese-chews-lactose-free-delights-for-dogs-with-digestive-sensitivities/',
  'https://sansarpetsupply.com/go-fetch-happiness-the-original-canine-cheese-chew-that-dogs-are-raving-about/',
  'https://sansarpetsupply.com/cheesy-delights-how-canine-cheese-chews-make-your-dogs-tail-wag/',
  'https://sansarpetsupply.com/a-taste-of-heaven-how-canine-cheese-chews-are-revolutionizing-treat-time/',
  'https://sansarpetsupply.com/finding-the-perfect-canine-cheese-chew-supplier-in-kathmandu/',
  'https://sansarpetsupply.com/the-ultimate-guide-to-ordering-custom-size-canine-cheese-chews/',
  'https://sansarpetsupply.com/the-ultimate-delight-large-size-canine-cheese-chews-for-dogs/',
  'https://sansarpetsupply.com/ageing-gracefully-understanding-how-dogs-traits-evolve-with-time/',
  'https://sansarpetsupply.com/the-canine-cheese-dog-chew-a-gourmet-treat-for-your-pooch/',
  'https://sansarpetsupply.com/pawsitive-connections-understanding-the-emotional-needs-of-dogs/',
  'https://sansarpetsupply.com/how-to-train-a-puppy-in-simple-ways/',
  'https://sansarpetsupply.com/pet-parenting-in-summer-decoded/',
  'https://sansarpetsupply.com/canine-cheese-chews-the-ultimate-treat/',
  'https://sansarpetsupply.com/canine-cheese-chews-from-sansar-pet-supply/',
  'https://sansarpetsupply.com/how-to-choose-digestive-friendly-chews-for-your-dog/',
  'https://sansarpetsupply.com/know-how-to-pick-the-best-chews-for-your-dogs-age-and-size/',
  'https://sansarpetsupply.com/best-dog-chew-for-excellent-health-and-well-being/',
  'https://sansarpetsupply.com/benefits-of-canine-cheese-chew-for-oral-health-and-plaque-reduction/',
  'https://sansarpetsupply.com/sending-smiles-to-dogs-everywhere-with-sansar-pet-supplys-original-canine-cheese-chews/',
  'https://sansarpetsupply.com/canine-cheese-chew-for-smaller-breeds/',
  'https://sansarpetsupply.com/the-home-of-original-canine-cheese-chew-small/',
  'https://sansarpetsupply.com/the-best-canine-cheese-chews-for-dogs-dental-health/',
  'https://sansarpetsupply.com/canine-cheese-chew-treats-that-your-dog-will-love/',
  'https://sansarpetsupply.com/healthy-treats-for-furry-friends-discover-the-original-canine-cheese-chew/',
]

const dateBySlug = {
  'unleash-your-dogs-joy-with-xlarge-canine-cheese-chew': 'April 30, 2024',
  'unveiling-the-best-canine-cheese-chews-in-seattle-sansar-pet-supply': 'April 20, 2024',
  'unveiling-the-canine-cheese-chew-a-tail-wagging-delight': 'April 10, 2024',
  'unveiling-the-canine-delight-the-ultimate-cheese-chew-experience': 'March 30, 2024',
  'exploring-the-nutritional-value-of-xlarge-canine-cheese-chew-for-canines': 'March 20, 2024',
  'why-canine-cheese-chews-are-the-new-favorite-treat-for-dogs': 'March 10, 2024',
  'unleashing-the-power-of-original-canine-cheese-chew-medium-for-your-furry-friend': 'February 29, 2024',
  'unleashing-the-ultimate-original-canine-cheese-chew-x-large-experience': 'February 20, 2024',
  'unleashing-the-power-of-original-canine-cheese-chew-for-small-dogs': 'February 10, 2024',
  'a-gourmet-experience-for-dogs-unveiling-sansar-pet-supplys-exclusive-cheese-chew': 'January 30, 2024',
  'unveiling-the-art-of-production-of-canine-cheese-chew-at-sansar-pet-supply': 'January 20, 2024',
  'unleashing-canine-happiness-sansar-pet-supplys-original-canine-cheese-chew': 'January 10, 2024',
  'unlocking-the-canine-cheese-chew-phenomenon-a-tasty-delight-for-dogs': 'December 30, 2023',
  'unveiling-the-original-canine-cheese-chew-a-game-changer-for-your-dogs-health': 'December 20, 2023',
  'exploring-the-superiority-of-sansar-pet-supplys-original-canine-cheese-chew': 'December 10, 2023',
  'the-secret-to-a-happy-pup-the-irresistible-canine-cheese-chew': 'November 30, 2023',
  'canine-cheese-chew-from-sansar-pet-supply-enhancing-your-pets-joy': 'November 20, 2023',
  'unveiling-the-original-canine-cheese-chew-from-sansar-pet-supply': 'November 10, 2023',
  'the-canine-cheese-chew-a-treat-your-dog-wont-resist': 'October 30, 2023',
  'tail-wagging-delights-why-custom-size-canine-cheese-chews-are-a-must-have-from-sansar-pet-supply': 'October 20, 2023',
  'barking-for-more-the-irresistible-allure-of-custom-size-cheese-chews-for-dogs-from-sansar-pet-supply': 'October 10, 2023',
  'from-pup-to-palate-how-custom-canine-cheese-chews-by-sansar-pet-supply-are-redefining-treat-time': 'September 30, 2023',
  'canine-culinary-artistry-exploring-sansar-pet-supplys-custom-size-cheese-chews': 'September 20, 2023',
  'going-gaga-for-cheese-chews-why-sansar-pet-supplys-custom-sizes-are-a-game-changer': 'September 10, 2023',
  'unleash-the-flavor-exploring-the-world-of-canine-cheese-chews': 'August 30, 2023',
  'keep-your-pup-smiling-and-healthy-with-delicious-original-canine-cheese-chews': 'August 20, 2023',
  'canine-cheese-chews-lactose-free-delights-for-dogs-with-digestive-sensitivities': 'August 10, 2023',
  'go-fetch-happiness-the-original-canine-cheese-chew-that-dogs-are-raving-about': 'July 30, 2023',
  'cheesy-delights-how-canine-cheese-chews-make-your-dogs-tail-wag': 'July 20, 2023',
  'a-taste-of-heaven-how-canine-cheese-chews-are-revolutionizing-treat-time': 'July 10, 2023',
  'finding-the-perfect-canine-cheese-chew-supplier-in-kathmandu': 'June 30, 2023',
  'the-ultimate-guide-to-ordering-custom-size-canine-cheese-chews': 'June 20, 2023',
  'the-ultimate-delight-large-size-canine-cheese-chews-for-dogs': 'June 10, 2023',
  'ageing-gracefully-understanding-how-dogs-traits-evolve-with-time': 'May 30, 2023',
  'the-canine-cheese-dog-chew-a-gourmet-treat-for-your-pooch': 'May 20, 2023',
  'pawsitive-connections-understanding-the-emotional-needs-of-dogs': 'May 10, 2023',
  'how-to-train-a-puppy-in-simple-ways': 'April 30, 2023',
  'pet-parenting-in-summer-decoded': 'April 20, 2023',
  'canine-cheese-chews-the-ultimate-treat': 'April 10, 2023',
  'canine-cheese-chews-from-sansar-pet-supply': 'March 30, 2023',
  'how-to-choose-digestive-friendly-chews-for-your-dog': 'March 20, 2023',
  'know-how-to-pick-the-best-chews-for-your-dogs-age-and-size': 'March 10, 2023',
  'best-dog-chew-for-excellent-health-and-well-being': 'February 28, 2023',
  'benefits-of-canine-cheese-chew-for-oral-health-and-plaque-reduction': 'February 20, 2023',
  'sending-smiles-to-dogs-everywhere-with-sansar-pet-supplys-original-canine-cheese-chews': 'February 10, 2023',
  'canine-cheese-chew-for-smaller-breeds': 'January 30, 2023',
  'the-home-of-original-canine-cheese-chew-small': 'January 20, 2023',
  'the-best-canine-cheese-chews-for-dogs-dental-health': 'January 10, 2023',
  'canine-cheese-chew-treats-that-your-dog-will-love': 'December 30, 2022',
  'healthy-treats-for-furry-friends-discover-the-original-canine-cheese-chew': 'December 20, 2022',
}

const decode = (value = '') =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&ndash;|&mdash;/g, '–')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

const strip = (html = '') =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )

function extractPost(html, url) {
  const slug = url.replace(/https?:\/\/sansarpetsupply\.com\//, '').replace(/\/$/, '')
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const title = decode((titleMatch?.[1] || '').replace(/<[^>]+>/g, ''))
  let date = dateBySlug[slug] || ''
  if (!date) {
    const dateMatch = html.match(/datetime=["']([^"']+)["']/i)
    if (dateMatch?.[1]) {
      const d = new Date(dateMatch[1])
      if (!Number.isNaN(d.getTime())) {
        date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }
    }
  }

  const contentMatch =
    html.match(/<div[^>]*class=["'][^"']*(?:entry-content|post-content|elementor-widget-theme-post-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  const contentHtml = contentMatch?.[1] || ''
  const paragraphs = [...contentHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, '')))
    .filter((text) => text.length > 25)
    .filter((text) => !/Quick Links|Contact Us|©20|Drop us a mail|Share Post|Recent Post/i.test(text))

  const imageMatch =
    html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)

  const excerpt = paragraphs[0] || ''
  return {
    slug,
    title,
    date,
    category: 'Blog',
    excerpt: excerpt.length > 180 ? `${excerpt.slice(0, 177).trim()}...` : excerpt,
    image: imageMatch?.[1] || '/images/lifestyle/home-concept.jpg',
    sourceUrl: url.replace(/\/$/, ''),
    body: paragraphs.length ? paragraphs : [strip(contentHtml)].filter(Boolean),
  }
}

const posts = []
for (const url of urls) {
  process.stdout.write(`Fetching ${url}...\n`)
  const res = await fetch(url)
  if (!res.ok) {
    process.stdout.write(`  skip (${res.status})\n`)
    continue
  }
  const html = await res.text()
  const post = extractPost(html, url)
  if (!post.title) {
    process.stdout.write('  skip (no title)\n')
    continue
  }
  posts.push(post)
  await new Promise((r) => setTimeout(r, 200))
}

const file = `/** Auto-generated from sansarpetsupply.com — run scripts/import-sansar-blog.mjs to refresh */\nexport const blogPosts = ${JSON.stringify(posts, null, 2)}\n`
fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, file, 'utf8')
process.stdout.write(`Wrote ${posts.length} posts to ${outFile}\n`)
