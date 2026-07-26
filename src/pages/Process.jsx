import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { processSteps } from '../data'
import { usePageMotion } from '../hooks'

export default function Process() {
  const pageRef = usePageMotion()
  const processRef = useRef(null)
  const [processIndex, setProcessIndex] = useState(0)

  useEffect(() => {
    const el = processRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const scrolledInto = Math.min(Math.max(-rect.top, 0), total)
      const ratio = scrolledInto / total
      const next = Math.min(processSteps.length - 1, Math.floor(ratio * processSteps.length))
      setProcessIndex(next)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="page-main" ref={pageRef}>
      <PageHero
        eyebrow="Process"
        title="Unveiling the art of production"
        lede="Four steps from mountain milk to a lasting canine cheese chew."
        image="/images/process/quality.jpg"
        imagePosition="center 38%"
      />

      <section className="process" ref={processRef}>
        <div className="process__sticky">
          <div className="section-shell process__layout">
            <div className="process__copy">
              <p className="eyebrow">How we craft</p>
              <h2>Mountain milk to lasting chew</h2>
              <ol>
                {processSteps.map((step, i) => (
                  <li key={step.num} className={i === processIndex ? 'is-active' : ''}>
                    <button type="button" onClick={() => setProcessIndex(i)}>
                      <span>{step.num}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="process__cta-row">
                <Link className="btn btn--gold" to="/contact">
                  Enquire about supply
                </Link>
                <Link className="btn btn--ghost-dark" to="/products">
                  See our sizes
                </Link>
                <Link className="btn btn--ghost-dark" to="/story">
                  Our story
                </Link>
              </div>
            </div>

            <div className={`process__visual ${processSteps[processIndex].hasText ? 'has-text' : ''}`}>
              {processSteps.map((step, i) => (
                <img
                  key={step.num}
                  src={step.image}
                  alt=""
                  className={i === processIndex ? 'is-active' : ''}
                  data-parallax={i === processIndex ? '0.12' : undefined}
                />
              ))}
              <div className="process__caption">
                <span>{processSteps[processIndex].num}</span>
                <p>{processSteps[processIndex].title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
