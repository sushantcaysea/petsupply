import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../hooks'

const METRICS = [
  { id: 'year', target: 2008, prefix: '', suffix: '', label: 'Established', hint: 'Supplying global partners' },
  { id: 'farms', target: 800, prefix: '', suffix: '+', label: 'Himalayan farms & co-ops', hint: 'Milk to manufacture' },
  { id: 'fat', target: 1, prefix: '<', suffix: '%', label: 'Fat content', hint: 'Lactose-free for dogs' },
  { id: 'natural', target: 100, prefix: '', suffix: '%', label: 'Natural ingredients', hint: 'Three ingredients only' },
]

const CERTS = ['HACCP', 'cGMP', 'PCQI', 'Wholesale ready', 'Private label']

function Metric({ metric, active, delay }) {
  const value = useCountUp(active, metric.target, 1400 + delay * 120)
  return (
    <article className="proof__metric" style={{ '--d': delay }}>
      <strong>
        {metric.prefix}
        {active ? value : 0}
        {metric.suffix}
      </strong>
      <span>{metric.label}</span>
      <em>{metric.hint}</em>
    </article>
  )
}

export default function ProofBand() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="proof" id="proof" ref={ref} data-reveal="up" aria-label="Sansaar proof points">
      <div className="proof__glow" aria-hidden="true" />
      <div className="proof__inner">
        <header className="proof__intro">
          <p className="eyebrow">By the numbers</p>
          <h2>Proof you can put on a buyer sheet.</h2>
          <p>Clean specs. Certified manufacturing. Scale that holds up in wholesale conversations.</p>
        </header>

        <div className="proof__grid">
          {METRICS.map((metric, i) => (
            <Metric key={metric.id} metric={metric} active={active} delay={i} />
          ))}
        </div>

        <ul className="proof__certs">
          {CERTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
