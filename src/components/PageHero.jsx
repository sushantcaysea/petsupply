export default function PageHero({
  eyebrow,
  title,
  accent,
  lede,
  image,
  imagePosition = 'center',
}) {
  return (
    <section className="page-hero">
      <div className="page-hero__bg" aria-hidden="true">
        <img
          src={image}
          alt=""
          style={{ objectPosition: imagePosition }}
          decoding="async"
          fetchPriority="high"
        />
        <div className="page-hero__veil" />
      </div>
      <div className="page-hero__content" data-reveal="up">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {accent ? <p className="page-hero__accent">{accent}</p> : null}
        {lede ? <p className="page-hero__lede">{lede}</p> : null}
      </div>
    </section>
  )
}
