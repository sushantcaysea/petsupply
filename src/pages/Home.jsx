import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import HeroChew from '../components/HeroChew'
import { products, qualityPledges } from '../data'
import { usePageMotion, useScrollProgress, useViewProgress } from '../hooks'
import { imgs, media } from '../media'

const faqs = [
  {
    q: 'What are Original Canine Cheese Chews made from?',
    a: 'Only three ingredients: skim milk, citrus juice, and salt. They are lactose-free, gluten-free, and contain less than 1% fat.',
  },
  {
    q: 'How long do the chews last for a dog?',
    a: 'Dogs typically work for several hours to soften a chew. Supervise chewing, and the final piece can be microwaved into a crunchy treat.',
  },
  {
    q: 'Do you support wholesale and private label?',
    a: 'Yes. We supply distributors and brands with mixed sizes, custom packing, and private-label options.',
  },
  {
    q: 'Where are the chews produced?',
    a: 'We manufacture and source from more than 800 farmers, milk co-ops, and dairy centers across the Himalayas.',
  },
]

const sizeLine = products.filter((p) => !p.contactOnly)

export default function Home() {
  const pageRef = usePageMotion()
  const scrubRef = useRef(null)
  const dogsRef = useRef(null)
  const storyRef = useRef(null)
  const pledgesRef = useRef(null)
  const catalogRef = useRef(null)
  const stillRef = useRef(null)
  const easeScene = (t) => t * t * (3 - 2 * t)
  const processIn = easeScene(useViewProgress(scrubRef))
  const dogsIn = easeScene(useViewProgress(dogsRef))
  const storyIn = easeScene(useViewProgress(storyRef))
  const pledgeProgress = useScrollProgress(pledgesRef)
  const catalogProgress = useScrollProgress(catalogRef)

  useEffect(() => {
    const still = stillRef.current
    if (!still) return undefined
    still.pause()
    still.controls = false
    still.disablePictureInPicture = true
    still.setAttribute('playsinline', '')

    const freeze = () => {
      if (!still.duration || Number.isNaN(still.duration)) return
      try {
        still.currentTime = Math.min(still.duration * 0.28, still.duration - 0.05)
      } catch {
        /* ignore */
      }
      still.pause()
    }

    const blockPlay = () => {
      still.pause()
    }

    still.addEventListener('loadedmetadata', freeze)
    still.addEventListener('play', blockPlay)
    if (still.readyState >= 1) freeze()
    return () => {
      still.removeEventListener('loadedmetadata', freeze)
      still.removeEventListener('play', blockPlay)
    }
  }, [])

  return (
    <main className="main" ref={pageRef}>
      <HeroChew>
        <p className="hero-chew__brand">Sansaar Pet Supply</p>
        <p className="hero-chew__eyebrow">Est. 2008 · Himalaya</p>
        <h1 className="hero-chew__title" aria-label="Hard cheese. Hard work.">
          <span className="hero-chew__line" aria-hidden="true">
            Hard cheese.
          </span>
          <span className="hero-chew__line hero-chew__line--accent" aria-hidden="true">
            Hard work.
          </span>
        </h1>
        <p className="hero-chew__lede">
          Original Canine Cheese Chews from the Himalayas — nearly bone-hard, lactose-free, built for wholesale
          partners who need a SKU that lasts.
        </p>
        <div className="hero-chew__actions">
          <Link className="btn btn--primary" to="/contact">
            Request wholesale
          </Link>
          <Link className="btn btn--secondary" to="/products">
            See sizes
          </Link>
        </div>
      </HeroChew>

      <section className="kb-split">
        <div className="kb-split__media kb-split__dock">
          <img
            className="kb-split__dock-img kb-split__dock-img--static"
            src={media.productStudio}
            alt="Original Canine Cheese Chew"
            decoding="async"
          />
        </div>
        <div className="kb-split__copy" data-reveal="right" data-delay="1">
          <p className="eyebrow">Why Sansaar</p>
          <h2 data-reveal="text">Three ingredients. Zero excuses.</h2>
          <p>
            Skim milk, citrus juice, salt. Pressed, smoked, dried, aged two months. A cleaner alternative to rawhide —
            for dogs and for the buyers stocking the aisle.
          </p>
          <Link className="btn btn--primary" to="/benefits">
            Read benefits
          </Link>
        </div>
      </section>

      <section className="kb-pledges" ref={pledgesRef}>
        <div className="kb-pledges__sticky">
          <div className="container container--wide">
            <div className="section__head" data-reveal="up">
              <p className="eyebrow">The pledges</p>
              <h2 className="section-title">What the chew delivers</h2>
            </div>
            <div className="kb-grid kb-grid--4 kb-pledges__grid">
              {qualityPledges.map((item, i) => {
                // First card peeks in immediately; rest scrub in as you scroll the runway
                const p = 0.14 + pledgeProgress * 0.86
                const start = i * 0.2
                const on = Math.min(1, Math.max(0, (p - start) / 0.22))
                return (
                  <article
                    className="kb-card kb-pledges__card"
                    key={item.title}
                    style={{
                      '--on': on.toFixed(4),
                      '--i': String(i),
                    }}
                  >
                    <div className="kb-card__body">
                      <p className="eyebrow">0{i + 1}</p>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="kb-pledges__track" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(0.04, pledgeProgress)})` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="kb-catalog" ref={catalogRef}>
        <div className="kb-catalog__sticky">
          <div className="container container--wide">
            <div className="section__head-row" data-reveal="up">
              <div>
                <p className="eyebrow">Catalog</p>
                <h2 className="section-title">Pick a size. Ship a line.</h2>
              </div>
              <Link className="btn btn--secondary" to="/products">
                Full catalog
              </Link>
            </div>
            <div className="kb-rail">
              {sizeLine.map((item, i) => {
                const p = 0.14 + catalogProgress * 0.86
                const start = i * 0.2
                const on = Math.min(1, Math.max(0, (p - start) / 0.22))
                return (
                  <Link
                    key={item.id}
                    to="/products"
                    className="kb-sku kb-catalog__sku"
                    style={{
                      '--on': on.toFixed(4),
                      '--i': String(i),
                    }}
                  >
                    <div className="kb-sku__media">
                      <img src={item.images[0].src} alt={item.title} loading="lazy" />
                    </div>
                    <div className="kb-sku__meta">
                      <h3>{item.name}</h3>
                      <strong>{item.weight}</strong>
                      <p>{item.size}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="kb-catalog__track" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(0.04, catalogProgress)})` }} />
            </div>
          </div>
        </div>
      </section>

      <section
        className="kb-split kb-split--flip kb-scene kb-scrub"
        ref={scrubRef}
        style={{ '--scene-in': processIn }}
      >
        <div className="kb-split__media kb-scene__media">
          <video
            ref={stillRef}
            className="kb-scrub__still"
            src={media.processVideo}
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
          <span className="kb-scrub__matte" aria-hidden="true" />
        </div>
        <div className="kb-split__copy kb-scene__copy">
          <p className="eyebrow">Our process</p>
          <h2>Scroll the craft</h2>
          <p>
            From high-altitude milk to smoked, aged cheese — production you can show a buyer, start to finish.
          </p>
          <Link className="btn btn--secondary" to="/process">
            Full process
          </Link>
        </div>
      </section>

      <section className="kb-split kb-scene" ref={dogsRef} style={{ '--scene-in': dogsIn }}>
        <div className="kb-split__media kb-scene__media">
          <img src={media.lifestyleNew} alt="Dog with cheese chew" />
        </div>
        <div className="kb-split__copy kb-scene__copy">
          <p className="eyebrow">For dogs</p>
          <h2>Long chew. Quiet house.</h2>
          <p>
            Hours of occupation. Clean ingredients. No toxic preservatives, no binding agents, no gluten, soy, corn,
            wheat, or grain.
          </p>
          <Link className="btn btn--primary" to="/benefits">
            Explore benefits
          </Link>
        </div>
      </section>

      <section
        className="kb-split kb-split--flip kb-scene"
        ref={storyRef}
        style={{ '--scene-in': storyIn }}
      >
        <div className="kb-split__media kb-scene__media">
          <img src={imgs.heroHimalaya} alt="Himalayan foothills" loading="lazy" />
        </div>
        <div className="kb-split__copy kb-scene__copy">
          <p className="eyebrow">Story</p>
          <h2>Sansaar means world</h2>
          <p>
            Since 2008 we have supplied Original Canine Cheese Chews to pioneers across the US, Europe, and Asia —
            manufacturing ourselves and sourcing from 800+ Himalayan farms and co-ops.
          </p>
          <ul className="checklist">
            <li>Custom size, shape, flavor, density</li>
            <li>Private label packing</li>
            <li>Kathmandu + Seattle offices</li>
          </ul>
          <Link className="btn btn--secondary" to="/story">
            Full story
          </Link>
        </div>
      </section>

      <section className="section section--ground">
        <div className="container">
          <div className="section__head" data-reveal="up">
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">Buyer questions</h2>
          </div>
          <div className="kb-faq">
            {faqs.map((item, i) => (
              <details key={item.q} data-reveal="up" data-delay={String((i % 4) + 1)}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
