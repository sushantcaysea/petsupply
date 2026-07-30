import { useEffect, useState } from 'react'

function EditorialTitle({ title }) {
  const lines = String(title)
    .trim()
    .split(/\n/)
    .flatMap((part) => {
      const words = part.trim().split(/\s+/)
      if (words.length <= 2) return [part.trim()]
      const mid = Math.ceil(words.length / 2)
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
    })
    .filter(Boolean)

  return (
    <h1 className="editorial-title" aria-label={title}>
      {lines.map((line, i) => (
        <span key={line} className="editorial-title__line" style={{ '--i': i }}>
          <span className="editorial-title__inner">{line}</span>
        </span>
      ))}
    </h1>
  )
}

export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
  video,
  imagePosition = '50% 40%',
  variant = 'default',
  className = '',
}) {
  const editorial = variant === 'editorial'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!editorial) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setReady(true)
      return undefined
    }
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [editorial])

  return (
    <section
      className={[
        'page-hero',
        editorial ? 'page-hero--editorial' : '',
        ready ? 'is-ready' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="page-hero__media" data-parallax={editorial ? '0.16' : '0.1'}>
        {video ? (
          <video src={video} autoPlay muted loop playsInline preload="metadata" />
        ) : (
          <img src={image} alt="" style={{ objectPosition: imagePosition }} />
        )}
      </div>
      <div className="page-hero__shade" />
      <div className="page-hero__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {editorial ? (
          <EditorialTitle title={title} />
        ) : (
          <h1 data-reveal="up">{title}</h1>
        )}
        {lede ? (
          editorial ? (
            <p className="page-hero__lede">{lede}</p>
          ) : (
            <p data-reveal="up" data-delay="1">
              {lede}
            </p>
          )
        ) : null}
      </div>
    </section>
  )
}
