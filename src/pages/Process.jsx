import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CurtainSplit, { CurtainCopy, CurtainVisual } from '../components/CurtainSplit'
import PageHero from '../components/PageHero'
import { processSteps } from '../data'
import { usePageMotion } from '../hooks'
import { imgs, media } from '../media'

const SHORT = {
  '01': 'High pastures',
  '02': 'Smoke & age',
  '03': 'Hand check',
  '04': 'Ship ready',
}

export default function Process() {
  const pageRef = usePageMotion()
  const journeyRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = journeyRef.current
    if (!root) return undefined
    const chapters = [...root.querySelectorAll('[data-step]')]
    if (!chapters.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number(entry.target.getAttribute('data-step'))
          if (!Number.isNaN(index)) setActive(index)
        })
      },
      { threshold: 0.45, rootMargin: '-10% 0px -35% 0px' },
    )

    chapters.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const jumpTo = (index) => {
    const root = journeyRef.current
    if (!root) return
    const target = root.querySelector(`[data-step="${index}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="main" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="Our process"
        title="From high pastures to hard cheese"
        lede="Pasteurized, cream-separated, coagulated, pressed, smoked, dried, and aged — then checked by hand."
        video={media.processVideo}
      />

      <CurtainSplit className="section">
        <div className="container container--wide">
          <div className="split" style={{ marginBottom: '3.5rem' }}>
            <CurtainVisual side="left">
              <img src={imgs.processArt} alt="Art of production" />
            </CurtainVisual>
            <CurtainCopy side="right">
              <p className="eyebrow">Craft</p>
              <h2>Two months of patience in every chew.</h2>
              <p>
                Milk from Himalayan co-ops above 6,000 ft becomes a long-lasting canine chew — with HACCP, cGMP, and
                PCQI-verified manufacturing behind every box.
              </p>
              <Link className="btn btn--secondary" to="/contact">
                Ask about supply
              </Link>
            </CurtainCopy>
          </div>
        </div>
      </CurtainSplit>

      <section className="journey" ref={journeyRef} aria-label="Process journey">
        <div className="journey__shell">
          <aside className="journey__rail" data-reveal="left" aria-label="Step navigator">
            <p className="eyebrow">The path</p>
            <ol>
              {processSteps.map((step, i) => (
                <li key={step.num}>
                  <button
                    type="button"
                    className={active === i ? 'is-active' : undefined}
                    onClick={() => jumpTo(i)}
                    aria-current={active === i ? 'step' : undefined}
                  >
                    <span>{step.num}</span>
                    <strong>{step.title}</strong>
                    <em>{SHORT[step.num]}</em>
                  </button>
                </li>
              ))}
            </ol>
            <div className="journey__progress" aria-hidden="true">
              <i style={{ height: `${((active + 1) / processSteps.length) * 100}%` }} />
            </div>
          </aside>

          <div className="journey__chapters">
            {processSteps.map((step, i) => (
              <article
                className={`journey__chapter ${i % 2 ? 'journey__chapter--flip' : ''}`}
                key={step.num}
                data-step={i}
                data-reveal="up"
              >
                <div className="journey__media">
                  <img src={step.image} alt={step.title} loading="lazy" />
                  <span className="journey__watermark" aria-hidden="true">
                    {step.num}
                  </span>
                </div>
                <div className="journey__copy">
                  <p className="eyebrow">Step {step.num}</p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <div className="journey__meta">
                    <span>
                      {i + 1} / {processSteps.length}
                    </span>
                    {i < processSteps.length - 1 ? (
                      <button type="button" className="journey__next" onClick={() => jumpTo(i + 1)}>
                        Next stage
                      </button>
                    ) : (
                      <Link className="journey__next" to="/contact">
                        Talk supply
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
